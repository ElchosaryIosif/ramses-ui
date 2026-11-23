import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initAnalytics } from './services/analytics';
import './styles/fonts.css';
import './styles/global.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found');

// When the page arrived with the pre-rendered nav + hero, index.html has already added the
// `handoff` class: React swaps in identical markup and the hero doesn't fade in again.

const start = () =>
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  );

/**
 * Resolves once the pre-rendered hero has been painted and recorded as the page's largest
 * content. Its title only draws once its font is in (preloaded by index.html), and the browser
 * discards the record if the element is replaced before the frame reaches the screen.
 */
const heroPainted = (): Promise<void> => {
  const fontReady = (document.fonts?.load('700 1em Cinzel') ?? Promise.resolve()).then(
    () => undefined,
    () => undefined
  );
  if (!PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
    // Safari and Firefox don't report it: wait for the font and one painted frame.
    return fontReady.then(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0))));
  }
  return new Promise((resolve) => {
    const observer = new PerformanceObserver((list) => {
      if (list.getEntries().some((e) => rootEl.contains((e as LargestContentfulPaint).element))) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  });
};

// With the pre-rendered nav + hero in place, let it paint first, then take over with identical
// markup (never waiting more than 2.5 s). Without it, start straight away.
if (rootEl.firstElementChild) {
  void Promise.race([heroPainted(), new Promise((r) => setTimeout(r, 2500))]).then(start);
} else {
  start();
}

initAnalytics();

// Registers the service worker that makes "Add to Home Screen" available.
// Production-only: in dev it would fight Vite's own module reloading.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}
