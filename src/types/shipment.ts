export type ShipmentStatus =
  | 'CREATED'
  | 'AT_FARM'
  | 'IN_WAREHOUSE'
  | 'IN_TRANSIT'
  | 'AT_PORT'
  | 'EXPORTED'
  | 'DELIVERED'
  | 'ALERT'
  | 'CLOSED';

export type ProductCategory = 
  | 'Fresh Fruit' 
  | 'Fresh Vegetable' 
  | 'Cold Seafood' 
  | 'Pharmaceutical Produce' 
  | 'Dairy & Poultry';

export interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface CustodyEvent {
  id: string;
  shipmentId: string;
  stage: 'FARM' | 'WAREHOUSE' | 'TRANSPORT' | 'PORT' | 'EXPORT' | 'IMPORTER';
  stageTitle: string;
  organization: string;
  personName: string;
  role: string;
  location: string;
  timestamp: string;
  transactionId: string;
  blockchainVerified: boolean;
  notes?: string;
}

export interface Shipment {
  id: string;
  shipmentId: string; // e.g., MANGO-001
  product: string; // e.g. Alphonso Mango
  category: ProductCategory;
  quantity: string; // e.g., 5,000 kg (100 crates)
  origin: string; // e.g., Erode, Tamil Nadu
  destination: string; // e.g., Dubai, UAE
  producer: string; // e.g., GreenValley Agro Farms
  transporter: string; // e.g., ColdExpress Logistics
  importer: string; // e.g., Al-Madina Fresh Import LLC
  expectedDelivery: string;
  harvestDate: string;
  sensorDeviceId: string;
  status: ShipmentStatus;
  currentOwner: string;
  createdAt: string;
  updatedAt: string;
  lastSensorHash?: string;
  custodyHistory: CustodyEvent[];
  routeCoordinates: [number, number][];
  currentLocationIndex: number;
}
