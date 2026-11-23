/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Build-time fallback for the API address; the container's runtime-config.js wins. */
  readonly VITE_API_URL?: string;
  /** Build-time fallback for the GA4 measurement ID; the container's runtime-config.js wins. */
  readonly VITE_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
