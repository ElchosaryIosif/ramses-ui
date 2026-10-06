/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Build-time fallback for the API address; the container's runtime-config.js wins. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
