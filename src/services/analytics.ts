/**
 * Google Analytics 4, loaded only after the visitor accepts cookies.
 *
 * The measurement ID (G-XXXXXXX) comes from /runtime-config.js, which
 * docker-entrypoint.sh writes from the container's GA_ID env var, so it can be
 * set on Railway without a rebuild. No ID means analytics stays off and the
 * consent banner is not shown.
 *
 * Nothing is sent to Google before consent: gtag.js is not even downloaded.
 * Browsers that have opened the admin panel are marked as the owner's and never
 * tracked, so the shop's own visits don't count as customers.
 */
import type { CartItem, Product } from '../types';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type Consent = 'granted' | 'denied';

const CONSENT_KEY = 'rb_consent';
const OWNER_KEY = 'rb_no_track';

const GA_ID = (() => {
  const id = window.__RUNTIME_CONFIG__?.GA_ID || import.meta.env.VITE_GA_ID || '';
  return /^G-[A-Z0-9]+$/.test(id) ? id : '';
})();

const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode: the choice lasts for this visit only */
  }
};

let sessionConsent: Consent | null = null;
let loaded = false;

export const isOwner = () => read(OWNER_KEY) === '1' || window.location.hash === '#admin';

/** Analytics is configured and this browser is not the owner's. */
export const analyticsAvailable = () => GA_ID !== '' && !isOwner();

export const getConsent = (): Consent | null => {
  const v = sessionConsent ?? read(CONSENT_KEY);
  return v === 'granted' || v === 'denied' ? v : null;
};

const load = () => {
  if (loaded || !analyticsAvailable() || getConsent() !== 'granted') return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js reads the `arguments` object, not an array.
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
};

export const setConsent = (c: Consent) => {
  sessionConsent = c;
  write(CONSENT_KEY, c);
  if (c === 'granted') load();
  else if (loaded) {
    // Withdrawn after loading: stop the tracker for the rest of this page view.
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
  }
};

/** Called once at start-up: loads GA for visitors who already said yes. */
export const initAnalytics = () => load();

/** Marks this browser as the shop owner's so it is never tracked. */
export const markOwner = () => write(OWNER_KEY, '1');

const send = (name: string, params: Record<string, unknown>) => {
  if (!loaded || isOwner()) return;
  window.gtag?.('event', name, params);
};

const item = (p: Product, qty = 1) => ({
  item_id: p.id,
  item_name: p.name,
  item_category: p.cat,
  price: p.price,
  quantity: qty,
});

const cartParams = (items: CartItem[], value: number) => ({
  currency: 'EUR',
  value: Number(value.toFixed(2)),
  items: items.map((c) => item(c, c.qty)),
});

// Standard GA4 e-commerce events, so the built-in purchase-journey report works.
export const track = {
  viewItem: (p: Product) => send('view_item', { currency: 'EUR', value: p.price, items: [item(p)] }),
  addToCart: (p: Product) => send('add_to_cart', { currency: 'EUR', value: p.price, items: [item(p)] }),
  removeFromCart: (p: CartItem) =>
    send('remove_from_cart', { currency: 'EUR', value: p.price * p.qty, items: [item(p, p.qty)] }),
  viewCart: (items: CartItem[], value: number) => send('view_cart', cartParams(items, value)),
  beginCheckout: (items: CartItem[], value: number) => send('begin_checkout', cartParams(items, value)),
  purchase: (orderId: string, items: CartItem[], value: number, shipping: number) =>
    send('purchase', { transaction_id: orderId, shipping, ...cartParams(items, value) }),
  orderFailed: (reason: string) => send('order_failed', { reason }),
};
