export type TransactionType = 
  | 'CREATE_SHIPMENT'
  | 'REGISTER_DEVICE'
  | 'SENSOR_BATCH'
  | 'TRANSFER_CUSTODY'
  | 'ALERT_EVENT'
  | 'TAMPER_EVENT'
  | 'UPDATE_STATUS'
  | 'CLOSE_SHIPMENT';

export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REJECTED';

export interface BlockchainTransaction {
  transactionId: string; // e.g. TX-8F92A7
  blockNumber: number; // e.g. 1042
  timestamp: string;
  type: TransactionType;
  shipmentId: string;
  deviceId?: string;
  payloadHash: string;
  previousHash: string;
  status: TransactionStatus;
  endorsingPeers: string[];
  channel: string;
  chaincode: string;
  details?: Record<string, any>;
}

export interface VerificationResult {
  verified: boolean;
  shipmentId: string;
  blockchainHash: string;
  currentDataHash: string;
  blockNumber: number;
  timestamp: string;
  tamperDetected: boolean;
  message: string;
}

export interface BlockHeader {
  blockNumber: number;
  currentHash: string;
  previousHash: string;
  transactionCount: number;
  timestamp: string;
}
