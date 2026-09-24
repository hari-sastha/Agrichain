import { BlockchainTransaction, VerificationResult } from '../../types/blockchain';

export interface IBlockchainProvider {
  /**
   * Initializes blockchain connection or mock ledger
   */
  initialize(): Promise<void>;

  /**
   * Creates a new shipment asset on the blockchain
   */
  createShipment(shipmentData: any): Promise<BlockchainTransaction>;

  /**
   * Registers a new IoT device asset
   */
  registerDevice(deviceData: any): Promise<BlockchainTransaction>;

  /**
   * Records a batch of IoT telemetry readings on-chain
   */
  recordSensorBatch(shipmentId: string, deviceId: string, readings: any[]): Promise<BlockchainTransaction>;

  /**
   * Records a chain-of-custody transfer event
   */
  transferCustody(shipmentId: string, custodyEvent: any): Promise<BlockchainTransaction>;

  /**
   * Records an alert or breach event on-chain
   */
  recordAlert(shipmentId: string, alertData: any): Promise<BlockchainTransaction>;

  /**
   * Records a device tamper detection event
   */
  recordTamperEvent(shipmentId: string, deviceId: string, tamperDetails: any): Promise<BlockchainTransaction>;

  /**
   * Verifies the cryptographic integrity of telemetry against the blockchain anchor
   */
  verifyIntegrity(shipmentId: string, currentTelemetry: any): Promise<VerificationResult>;

  /**
   * Retrieves all transaction logs
   */
  getTransactions(): Promise<BlockchainTransaction[]>;

  /**
   * Retrieves transactions for a specific shipment
   */
  getShipmentTransactions(shipmentId: string): Promise<BlockchainTransaction[]>;
}
