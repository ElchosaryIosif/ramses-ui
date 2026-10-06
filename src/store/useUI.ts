import { create } from 'zustand';

interface ToastState {
  message: string;
  type: 'success' | 'error' | '';
  visible: boolean;
}

interface UIState {
  cartOpen: boolean;
  orderOpen: boolean;
  lightboxId: string | null;
  toast: ToastState;
  openCart: () => void;
  closeCart: () => void;
  openOrder: () => void;
  closeOrder: () => void;
  openLightbox: (productId: string) => void;
  closeLightbox: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  orderOpen: false,
  lightboxId: null,
  toast: { message: '', type: '', visible: false },
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openOrder: () => set({ orderOpen: true }),
  closeOrder: () => set({ orderOpen: false }),
  openLightbox: (productId) => set({ lightboxId: productId }),
  closeLightbox: () => set({ lightboxId: null }),
  showToast: (message, type = 'success') => {
    set({ toast: { message, type, visible: true } });
    window.clearTimeout((window as unknown as { __toastTimer?: number }).__toastTimer);
    (window as unknown as { __toastTimer?: number }).__toastTimer = window.setTimeout(() => {
      set((s) => ({ toast: { ...s.toast, visible: false } }));
    }, 2800);
  },
  hideToast: () => set((s) => ({ toast: { ...s.toast, visible: false } })),
}));
