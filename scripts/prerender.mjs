// Puts the pre-rendered nav and home hero (src/prerender.tsx) into dist/index.html.
// Usage: node scripts/prerender.mjs  (after `vite build` and the SSR build into dist-ssr/)
//
// The result inside #root:
//   <div id="store-view">NAV  [home hero, or the product's top part on /p/<slug> pages]</div>
// nginx (SSI) fills in a product page's top part from the API; the hero is the fallback.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// The shared modules read a few browser globals when they load; give them harmless stand-ins.
globalThis.window = { location: { hash: '', pathname: '/' }, addEventListener() {} };

const ssr = await import(pathToFileURL('dist-ssr/prerender.js').href);
const shell =
  '<div id="store-view">' +
  ssr.renderNav() +
  '<!--# block name="home_main" -->' +
  ssr.renderHomeMain() +
  '<!--# endblock -->' +
  '<!--# include virtual="/__body$request_uri" stub="home_main" -->' +
  '</div>';

const file = 'dist/index.html';
const html = readFileSync(file, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error(`${file}: ${marker} not found`);
writeFileSync(file, html.replace(marker, `<div id="root">${shell}</div>`));
rmSync('dist-ssr', { recursive: true, force: true });
console.log(`prerender: ${shell.length} bytes of nav + hero written into ${file}`);
