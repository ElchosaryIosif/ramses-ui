import { create } from 'zustand';
import type { CartItem, Product } from '../types';
import { getShippingCost } from '../services/shipping';

interface CartState {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>((set) => ({
  items: [],
  add: (product) =>
    set((state) => {
      if (!product.stock) return state;
      const existing = state.items.find((c) => c.id === product.id);
      if (existing) {
        return {
          items: state.items.map((c) => (c.id === product.id ? { ...c, qty: c.qty + 1 } : c)),
        };
      }
      return { items: [...state.items, { ...product, qty: 1 }] };
    }),
  remove: (id) => set((state) => ({ items: state.items.filter((c) => c.id !== id) })),
  changeQty: (id, delta) =>
    set((state) => {
      const items = state.items.map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0);
      return { items };
    }),
  clear: () => set({ items: [] }),
}));

export const cartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = getShippingCost(subtotal);
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    count: items.reduce((s, c) => s + c.qty, 0),
  };
};
