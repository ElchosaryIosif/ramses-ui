import { create } from 'zustand';
import type { Product } from '../types';
import { readJSON, writeJSON, STORAGE_KEYS } from '../services/storage';
import { api } from '../services/api';
import { generateId } from '../services/image';
import { useAuth } from './useAuth';

/**
 * Admin edits are recorded as operations in a persisted outbox and replayed
 * on top of the latest server catalogue. That gives us:
 *  - honest status (an edit is "saved" only once the server accepted it),
 *  - no lost work on a bad connection (the outbox survives reloads),
 *  - no silent overwrites between devices (on a revision conflict the
 *    pending operations are re-applied to the fresh catalogue and retried).
 */
export type ProductOp =
  { type: 'upsert'; product: Product } | { type: 'remove'; id: string } | { type: 'toggleStock'; id: string };

export type SyncState = 'idle' | 'saving' | 'error';
export type SyncError = 'network' | 'auth' | 'invalid' | 'too_large' | null;

export type ProductInput = Omit<Product, 'id' | 'createdAt'> & { id?: string };

interface ProductsState {
  /** What the UI shows: server catalogue + pending local edits. */
  products: Product[];
  server: Product[];
  rev: number | null;
  outbox: ProductOp[];
  hydrated: boolean;
  sync: SyncState;
  syncError: SyncError;
  hydrate: () => Promise<void>;
  upsert: (input: ProductInput) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  toggleStock: (id: string) => Promise<boolean>;
  flush: () => Promise<boolean>;
  discardPending: () => void;
}

const applyOp = (list: Product[], op: ProductOp): Product[] => {
  switch (op.type) {
    case 'upsert': {
      const idx = list.findIndex((p) => p.id === op.product.id);
      if (idx === -1) return [op.product, ...list];
      const next = [...list];
      next[idx] = op.product;
      return next;
    }
    case 'remove':
      return list.filter((p) => p.id !== op.id);
    case 'toggleStock':
      return list.map((p) => (p.id === op.id ? { ...p, stock: !p.stock } : p));
  }
};

const view = (server: Product[], outbox: ProductOp[]) => outbox.reduce(applyOp, server);

let inflight: Promise<boolean> | null = null;

export const useProducts = create<ProductsState>((set, get) => {
  const setOutbox = (outbox: ProductOp[]) => {
    writeJSON(STORAGE_KEYS.outbox, outbox);
    set({ outbox, products: view(get().server, outbox) });
  };

  const setServer = (server: Product[], rev: number) => {
    writeJSON(STORAGE_KEYS.products, server);
    set({ server, rev, products: view(server, get().outbox) });
  };

  const fail = (syncError: SyncError) => {
    set({ sync: 'error', syncError });
    return false;
  };

  const run = async (): Promise<boolean> => {
    set({ sync: 'saving', syncError: null });
    for (let attempt = 0; attempt < 4; attempt++) {
      const { outbox, server, rev } = get();
      if (outbox.length === 0) {
        set({ sync: 'idle' });
        return true;
      }
      const token = useAuth.getState().token;
      if (!token) return fail('auth');
      if (rev === null) {
        const fresh = await api.products();
        if (!fresh.ok) return fail('network');
        setServer(fresh.data.products, fresh.data.rev);
        continue;
      }

      const batch = outbox.length;
      const res = await api.saveProducts(token, rev, view(server, outbox));
      if (res.ok) {
        setServer(res.data.products, res.data.rev);
        // Keep anything queued while this request was in flight.
        setOutbox(get().outbox.slice(batch));
        attempt = -1;
        continue;
      }
      if (res.status === 409) {
        const latest = res.data as { rev: number; products: Product[] };
        setServer(latest.products, latest.rev);
        continue;
      }
      if (res.status === 401) {
        useAuth.getState().expire();
        return fail('auth');
      }
      if (res.status === 413) return fail('too_large');
      if (res.status === 422 || res.status === 400) return fail('invalid');
      return fail('network');
    }
    return fail('network');
  };

  const enqueue = (op: ProductOp): Promise<boolean> => {
    setOutbox([...get().outbox, op]);
    return get().flush();
  };

  const server = readJSON<Product[]>(STORAGE_KEYS.products, []);
  const outbox = readJSON<ProductOp[]>(STORAGE_KEYS.outbox, []);

  return {
    products: view(Array.isArray(server) ? server : [], Array.isArray(outbox) ? outbox : []),
    server: Array.isArray(server) ? server : [],
    rev: null,
    outbox: Array.isArray(outbox) ? outbox : [],
    hydrated: false,
    sync: 'idle',
    syncError: null,

    hydrate: async () => {
      const res = await api.products();
      if (res.ok) setServer(res.data.products, res.data.rev);
      set({ hydrated: true });
      if (get().outbox.length && useAuth.getState().token) void get().flush();
    },

    upsert: (input) => {
      const existing = input.id ? get().products.find((p) => p.id === input.id) : undefined;
      const product: Product = {
        ...input,
        id: existing?.id ?? generateId(),
        createdAt: existing?.createdAt ?? Date.now(),
      };
      return enqueue({ type: 'upsert', product });
    },

    remove: (id) => enqueue({ type: 'remove', id }),
    toggleStock: (id) => enqueue({ type: 'toggleStock', id }),

    flush: () => {
      // run() keeps going until the outbox is empty, so a running save picks
      // up new edits; re-check afterwards for ones queued as it finished.
      if (inflight) return inflight.then(() => (get().outbox.length ? get().flush() : true));
      const p = run().finally(() => {
        if (inflight === p) inflight = null;
      });
      inflight = p;
      return p;
    },

    discardPending: () => {
      setOutbox([]);
      set({ sync: 'idle', syncError: null });
    },
  };
});
