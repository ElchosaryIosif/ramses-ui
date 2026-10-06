import type { Product, Settings } from '../types';

/**
 * Client for the Ramses API (api/). The browser holds at most a short-lived
 * admin session token.
 *
 * The API's address is read at runtime from /runtime-config.js, which the
 * web container writes from its API_BASE env var on start-up, so one image
 * works against any API. Empty means same origin (`npm run dev` proxies /api).
 */
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: { API_BASE?: string };
  }
}

const API_BASE = (window.__RUNTIME_CONFIG__?.API_BASE || import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/** Product photos are stored as API-relative paths; this makes them loadable from the shop's origin. */
export const mediaUrl = (src: string): string => (src.startsWith('/api/') ? API_BASE + src : src);

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string; data?: unknown };

export interface AdminStatus {
  /** False while the deploy still runs on the legacy, publicly-known credentials. */
  secure: boolean;
  /** True while the admin password is still the old public default. */
  defaultPassword: boolean;
}

export interface Catalogue {
  rev: number;
  products: Product[];
}

export interface SessionGrant {
  token: string;
  exp: number;
  status: AdminStatus;
}

const call = async <T>(
  method: string,
  path: string,
  { body, token }: { body?: unknown; token?: string | null } = {}
): Promise<ApiResult<T>> => {
  try {
    const res = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = (await res.json().catch(() => null)) as unknown;
    if (res.ok) return { ok: true, data: data as T };
    const error = (data as { error?: string } | null)?.error ?? `http_${res.status}`;
    return { ok: false, status: res.status, error, data };
  } catch {
    return { ok: false, status: 0, error: 'network' };
  }
};

export type OrderStatus = 'NEW' | 'CONFIRMED' | 'SHIPPED' | 'CANCELLED';

export interface OrderInput {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  items: { id: string; qty: number }[];
  /** Honeypot: stays empty for people. */
  website: string;
}

export interface OrderReceipt {
  id: string;
  subtotal: number;
  shipping: number;
  total: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
}

export const api = {
  products: () => call<Catalogue>('GET', '/products'),
  saveProducts: (token: string, baseRev: number, products: Product[]) =>
    call<Catalogue>('PUT', '/products', { token, body: { baseRev, products } }),
  settings: () => call<Partial<Settings>>('GET', '/settings'),
  saveSettings: (token: string, settings: Partial<Settings>) =>
    call<Partial<Settings>>('PUT', '/settings', { token, body: { settings } }),
  login: (password: string, remember: boolean) =>
    call<SessionGrant>('POST', '/login', { body: { password, remember } }),
  session: (token: string) => call<{ status: AdminStatus }>('GET', '/session', { token }),
  changePassword: (token: string, current: string, next: string) =>
    call<SessionGrant>('POST', '/password', { token, body: { current, next } }),
  placeOrder: (order: OrderInput) => call<OrderReceipt>('POST', '/orders', { body: order }),
  orders: (token: string) => call<Order[]>('GET', '/orders', { token }),
  setOrderStatus: (token: string, id: string, status: OrderStatus) =>
    call<Order>('PATCH', `/orders/${id}`, { token, body: { status } }),
};
