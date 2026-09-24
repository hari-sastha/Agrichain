/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_TAGLINE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_MOCK_BLOCKCHAIN: string;
  readonly VITE_FABRIC_PEER_ENDPOINT: string;
  readonly VITE_FABRIC_CHANNEL: string;
  readonly VITE_FABRIC_CHAINCODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
