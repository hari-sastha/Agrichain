import { IBlockchainProvider } from './IBlockchainProvider';
import { BlockchainTransaction, VerificationResult } from '../../types/blockchain';
import { INITIAL_TRANSACTIONS } from '../../data/mockSeedData';
import { generateSHA256 } from '../../utils/crypto';

export class MockBlockchainProvider implements IBlockchainProvider {
  private transactions: BlockchainTransaction[] = [...INITIAL_TRANSACTIONS];
  private currentBlockNumber = 1043;
  private lastHash = '92ab1c3d4e5f67890abcdef1234567890abcdef1234567890abcdef123456789';

  async initialize(): Promise<void> {
    console.log('[MockBlockchainProvider] Initialized mock ledger with', this.transactions.length, 'transactions.');
  }

  private generateTxId(): string {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
    return `TX-${hex}`;
  }

  async createShipment(shipmentData: any): Promise<BlockchainTransaction> {
    const payloadHash = generateSHA256(shipmentData);
    const txId = this.generateTxId();
    this.currentBlockNumber += 1;
    const currentHash = generateSHA256({
      txId,
      blockNumber: this.currentBlockNumber,
      payloadHash,
      previousHash: this.lastHash,
    });

    const tx: BlockchainTransaction = {
      transactionId: txId,
      blockNumber: this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      type: 'CREATE_SHIPMENT',
      shipmentId: shipmentData.shipmentId || shipmentData.id,
      deviceId: shipmentData.sensorDeviceId,
      payloadHash,
      previousHash: this.lastHash,
      status: 'CONFIRMED',
      endorsingPeers: ['peer0.org1.agrichain.com', 'peer0.org2.agrichain.com'],
      channel: 'agrichain-channel',
      chaincode: 'agrichain-cc',
      details: shipmentData,
    };

    this.lastHash = currentHash;
    this.transactions.unshift(tx);
    return tx;
  }

  async registerDevice(deviceData: any): Promise<BlockchainTransaction> {
    const payloadHash = generateSHA256(deviceData);
    const txId = this.generateTxId();
    this.currentBlockNumber += 1;

    const tx: BlockchainTransaction = {
      transactionId: txId,
      blockNumber: this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      type: 'REGISTER_DEVICE',
      shipmentId: deviceData.shipmentId || 'N/A',
      deviceId: deviceData.deviceId,
      payloadHash,
      previousHash: this.lastHash,
      status: 'CONFIRMED',
      endorsingPeers: ['peer0.org1.agrichain.com'],
      channel: 'agrichain-channel',
      chaincode: 'agrichain-cc',
    };

    this.lastHash = generateSHA256(tx);
    this.transactions.unshift(tx);
    return tx;
  }

  async recordSensorBatch(shipmentId: string, deviceId: string, readings: any[]): Promise<BlockchainTransaction> {
    const payloadHash = generateSHA256(readings);
    const txId = this.generateTxId();
    this.currentBlockNumber += 1;

    const tx: BlockchainTransaction = {
      transactionId: txId,
      blockNumber: this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      type: 'SENSOR_BATCH',
      shipmentId,
      deviceId,
      payloadHash,
      previousHash: this.lastHash,
      status: 'CONFIRMED',
      endorsingPeers: ['peer0.org1.agrichain.com', 'peer0.org2.agrichain.com'],
      channel: 'agrichain-channel',
      chaincode: 'agrichain-cc',
      details: { recordCount: readings.length },
    };

    this.lastHash = generateSHA256(tx);
    this.transactions.unshift(tx);
    return tx;
  }

  async transferCustody(shipmentId: string, custodyEvent: any): Promise<BlockchainTransaction> {
    const payloadHash = generateSHA256(custodyEvent);
    const txId = this.generateTxId();
    this.currentBlockNumber += 1;

    const tx: BlockchainTransaction = {
      transactionId: txId,
      blockNumber: this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      type: 'TRANSFER_CUSTODY',
      shipmentId,
      payloadHash,
      previousHash: this.lastHash,
      status: 'CONFIRMED',
      endorsingPeers: ['peer0.org1.agrichain.com', 'peer0.org2.agrichain.com'],
      channel: 'agrichain-channel',
      chaincode: 'agrichain-cc',
      details: custodyEvent,
    };

    this.lastHash = generateSHA256(tx);
    this.transactions.unshift(tx);
    return tx;
  }

  async recordAlert(shipmentId: string, alertData: any): Promise<BlockchainTransaction> {
    const payloadHash = generateSHA256(alertData);
    const txId = this.generateTxId();
    this.currentBlockNumber += 1;

    const tx: BlockchainTransaction = {
      transactionId: txId,
      blockNumber: this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      type: 'ALERT_EVENT',
      shipmentId,
      deviceId: alertData.deviceId,
      payloadHash,
      previousHash: this.lastHash,
      status: 'CONFIRMED',
      endorsingPeers: ['peer0.org1.agrichain.com'],
      channel: 'agrichain-channel',
      chaincode: 'agrichain-cc',
    };

    this.lastHash = generateSHA256(tx);
    this.transactions.unshift(tx);
    return tx;
  }

  async recordTamperEvent(shipmentId: string, deviceId: string, tamperDetails: any): Promise<BlockchainTransaction> {
    const payloadHash = generateSHA256(tamperDetails);
    const txId = this.generateTxId();
    this.currentBlockNumber += 1;

    const tx: BlockchainTransaction = {
      transactionId: txId,
      blockNumber: this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      type: 'TAMPER_EVENT',
      shipmentId,
      deviceId,
      payloadHash,
      previousHash: this.lastHash,
      status: 'CONFIRMED',
      endorsingPeers: ['peer0.org1.agrichain.com', 'peer0.org2.agrichain.com'],
      channel: 'agrichain-channel',
      chaincode: 'agrichain-cc',
    };

    this.lastHash = generateSHA256(tx);
    this.transactions.unshift(tx);
    return tx;
  }

  async verifyIntegrity(shipmentId: string, currentTelemetry: any): Promise<VerificationResult> {
    const currentHash = generateSHA256(currentTelemetry);
    
    // Find latest on-chain transaction hash for this shipment
    const tx = this.transactions.find((t) => t.shipmentId === shipmentId);
    const blockchainHash = tx ? tx.payloadHash : this.transactions[0].payloadHash;

    const isMatch = currentHash.toLowerCase() === blockchainHash.toLowerCase();

    return {
      verified: isMatch,
      shipmentId,
      blockchainHash,
      currentDataHash: currentHash,
      blockNumber: tx ? tx.blockNumber : this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      tamperDetected: !isMatch,
      message: isMatch
        ? 'Cryptographic integrity verified. Data matches Hyperledger Fabric anchored record.'
        : 'Tampering detected! Current telemetry payload hash does NOT match blockchain anchored record.',
    };
  }

  async getTransactions(): Promise<BlockchainTransaction[]> {
    return [...this.transactions];
  }

  async getShipmentTransactions(shipmentId: string): Promise<BlockchainTransaction[]> {
    return this.transactions.filter((tx) => tx.shipmentId === shipmentId);
  }
}
