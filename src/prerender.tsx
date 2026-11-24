/**
 * Build-time render of the nav and the home page's hero into index.html, so the first screen
 * paints before any JavaScript runs. scripts/prerender.mjs runs this after `vite build`.
 * Product pages get their top part from the server instead (nginx SSI, see index.html).
 * The browser app replaces it with the same markup once it starts (see main.tsx).
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { Nav } from './components/store/Nav';
import { Hero } from './components/store/Hero';

export const renderNav = (): string => renderToStaticMarkup(<Nav />);

export const renderHomeMain = (): string =>
  renderToStaticMarkup(
    <main id="main">
      <Hero />
    </main>
  );
