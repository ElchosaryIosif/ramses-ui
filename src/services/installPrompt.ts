/**
 * Captures the browser's "beforeinstallprompt" event (Android/Chrome) the
 * moment it fires — which can happen before React has mounted anything —
 * and lets any component ask for it later. The event is single-use, so we
 * keep at most one and clear it once consumed.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferred = e as BeforeInstallPromptEvent;
  listeners.forEach((fn) => fn());
});

window.addEventListener('appinstalled', () => {
  deferred = null;
  listeners.forEach((fn) => fn());
});

export const installPrompt = {
  get available() {
    return deferred !== null;
  },
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  prompt: async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferred) return 'unavailable';
    const event = deferred;
    deferred = null;
    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome;
  },
};

export const isStandalone = (): boolean =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  (navigator as unknown as { standalone?: boolean }).standalone === true;

export const isIOS = (): boolean =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
