/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string;
  readonly VITE_IESO_API_KEY: string;
  readonly VITE_OEB_API_KEY: string;
  readonly VITE_NRCAN_API_KEY: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_UPDATE_INTERVAL: string;
  readonly VITE_FALLBACK_TO_MOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
