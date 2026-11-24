/**
 * A small path router. The shop is `/`, a product is `/p/<slug>`, and the admin panel stays at
 * `/#admin`. Product pages are real addresses so Google can index each product and people can
 * share a link to one.
 */
import { useSyncExternalStore } from 'react';
import type { Product } from '../types';

export type Route = { name: 'store' } | { name: 'product'; slug: string } | { name: 'admin' };

const parse = (): Route => {
  if (window.location.hash === '#admin') return { name: 'admin' };
  const m = window.location.pathname.match(/^\/p\/([^/]+)\/?$/);
  if (m) {
    try {
      return { name: 'product', slug: decodeURIComponent(m[1]) };
    } catch {
      return { name: 'product', slug: m[1] };
    }
  }
  return { name: 'store' };
};

let current = parse();
let key = window.location.pathname + window.location.hash;
const listeners = new Set<() => void>();

const update = () => {
  const next = window.location.pathname + window.location.hash;
  if (next === key) return;
  key = next;
  current = parse();
  listeners.forEach((l) => l());
};

window.addEventListener('popstate', update);
window.addEventListener('hashchange', update);

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useRoute = (): Route => useSyncExternalStore(subscribe, () => current);

/** Goes to a path inside the shop without reloading the page. */
export const navigate = (path: string, { replace = false } = {}) => {
  if (path === window.location.pathname + window.location.hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history[replace ? 'replaceState' : 'pushState'](null, '', path);
  update();
  if (!path.includes('#')) window.scrollTo(0, 0);
};

/** onClick for <a href>: keeps new-tab and modifier clicks working, handles plain clicks in-app. */
export const linkClick = (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  navigate(path);
};

export const productPath = (p: Pick<Product, 'id' | 'slug'>) => `/p/${p.slug || p.id}`;

/** Finds a product by its address, including addresses from before a rename (they end in the id). */
export const findBySlug = (products: Product[], slug: string): Product | undefined =>
  products.find((p) => p.slug === slug) ?? products.find((p) => slug === p.id || slug.endsWith(`-${p.id}`));
