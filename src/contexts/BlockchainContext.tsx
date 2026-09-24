import React, { createContext, useContext, useState, useEffect } from 'react';
import { IBlockchainProvider } from '../services/blockchain/IBlockchainProvider';
import { MockBlockchainProvider } from '../services/blockchain/MockBlockchainProvider';
import { HyperledgerFabricProvider } from '../services/blockchain/HyperledgerFabricProvider';
import { BlockchainTransaction, VerificationResult } from '../types/blockchain';

interface BlockchainContextType {
  provider: IBlockchainProvider;
  transactions: BlockchainTransaction[];
  isHyperledgerFabricActive: boolean;
  tamperedShipments: Set<string>;
  recordShipmentOnChain: (shipmentData: any) => Promise<BlockchainTransaction>;
  recordCustodyTransfer: (shipmentId: string, custodyEvent: any) => Promise<BlockchainTransaction>;
  recordAlertOnChain: (shipmentId: string, alertData: any) => Promise<BlockchainTransaction>;
  verifyIntegrity: (shipmentId: string, telemetryPayload: any) => Promise<VerificationResult>;
  simulateDataTamper: (shipmentId: string, corruptedTemp?: number) => void;
  restoreDataIntegrity: (shipmentId: string) => void;
  refreshTransactions: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider] = useState<IBlockchainProvider>(() => {
    // Select provider based on environment config
    const useFabric = import.meta.env.VITE_ENABLE_MOCK_BLOCKCHAIN === 'false';
    return useFabric ? new HyperledgerFabricProvider() : new MockBlockchainProvider();
  });

  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [tamperedShipments, setTamperedShipments] = useState<Set<string>>(new Set());

  const refreshTransactions = async () => {
    const txs = await provider.getTransactions();
    setTransactions(txs);
  };

  useEffect(() => {
    provider.initialize().then(() => {
      refreshTransactions();
    });
  }, [provider]);

  const recordShipmentOnChain = async (shipmentData: any) => {
    const tx = await provider.createShipment(shipmentData);
    await refreshTransactions();
    return tx;
  };

  const recordCustodyTransfer = async (shipmentId: string, custodyEvent: any) => {
    const tx = await provider.transferCustody(shipmentId, custodyEvent);
    await refreshTransactions();
    return tx;
  };

  const recordAlertOnChain = async (shipmentId: string, alertData: any) => {
    const tx = await provider.recordAlert(shipmentId, alertData);
    await refreshTransactions();
    return tx;
  };

  const verifyIntegrity = async (shipmentId: string, telemetryPayload: any): Promise<VerificationResult> => {
    // If artificially tampered via UI demo control
    if (tamperedShipments.has(shipmentId)) {
      const corruptedPayload = { ...telemetryPayload, temperature: 17.4, tamperedFlag: true };
      const res = await provider.verifyIntegrity(shipmentId, corruptedPayload);
      return {
        ...res,
        verified: false,
        tamperDetected: true,
        message: 'Tampering detected! Current telemetry payload (17.4°C) does NOT match blockchain anchored record (7.4°C).',
      };
    }
    return provider.verifyIntegrity(shipmentId, telemetryPayload);
  };

  const simulateDataTamper = (shipmentId: string) => {
    setTamperedShipments((prev) => new Set(prev).add(shipmentId));
  };

  const restoreDataIntegrity = (shipmentId: string) => {
    setTamperedShipments((prev) => {
      const next = new Set(prev);
      next.delete(shipmentId);
      return next;
    });
  };

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        transactions,
        isHyperledgerFabricActive: import.meta.env.VITE_ENABLE_MOCK_BLOCKCHAIN === 'false',
        tamperedShipments,
        recordShipmentOnChain,
        recordCustodyTransfer,
        recordAlertOnChain,
        verifyIntegrity,
        simulateDataTamper,
        restoreDataIntegrity,
        refreshTransactions,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = (): BlockchainContextType => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};
