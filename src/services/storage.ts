export const readJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or disabled — silent */
  }
};

export const STORAGE_KEYS = {
  products: 'rb_products',
  settings: 'rb_settings',
  lang: 'rb_lang',
  session: 'rb_session',
  outbox: 'rb_outbox',
  draft: 'rb_product_draft',
} as const;
