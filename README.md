# ramses-ui

The Ramses Bazaar shop, its product pages (`/p/<slug>`) and its admin panel (`/#admin`). The API it talks to is
[ramses-api](https://github.com/ElchosaryIosif/ramses-api); deployment is
described in its [docs/deploy.md](https://github.com/ElchosaryIosif/ramses-api/blob/main/docs/deploy.md).

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- Zustand for client state
- Plain CSS (custom properties)
- nginx in Docker → `ghcr.io/elchosaryiosif/ramses-ui`, run on Railway
- Installable PWA (`public/manifest.webmanifest`, `public/sw.js`)

## Setup

```sh
npm install
cp .env.example .env.local
npm run dev            # http://localhost:5173
```

`npm run dev` forwards `/api` to ramses-api on http://localhost:8080 (override with
`API_PROXY_TARGET`).

## Scripts

```sh
npm run dev
npm run build
npm run typecheck
npm run format         # prettier
npm run docker:build   # scripts/docker.sh, reads .env.prod
```

## Runtime configuration

The image is built once and pointed at an API when it starts:
`docker-entrypoint.sh` writes the runtime config from the container's `API_BASE`
env var (inline in `index.html`, and as `/runtime-config.js`), and `src/services/api.ts`
reads it. Empty means the API is on the same origin. The entrypoint also points nginx at
the API for the sitemap and product page tags, and adds preconnect/preload hints for it.

```sh
docker run -p 8080:80 -e API_BASE=https://api.ramsesbazaar.com ghcr.io/elchosaryiosif/ramses-ui
```

`GA_ID` (a GA4 measurement ID, `G-XXXXXXX`) turns on Google Analytics the same
way. Without it there is no analytics and no cookie banner. With it, visitors see
a consent banner and gtag.js loads only after they accept
(`src/services/analytics.ts`). The shop sends the standard e-commerce events
`view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`
and `purchase`, plus `order_failed`. A browser that has logged into the admin
panel is never tracked.

## Product pages, search engines and speed

- **Product pages.** Every product has its own address, `/p/<name>-<id>` (the slug comes from the
  API). `src/services/router.ts` handles in-app navigation; an old address of a renamed product
  still works and is replaced by the current one.
- **What Google and link previews see.** nginx serves `index.html` with SSI. On a product page it
  asks the API for the page's `<head>` tags (title, description, canonical, Open Graph, Product
  structured data, a photo preload) and for its visible top part (photo, name, price), so the
  product is there before any JavaScript runs. If the API can't be reached, the home page's tags
  are used and the app renders the page as usual.
- **Sitemap.** `/sitemap.xml` comes from the API and lists every product page;
  `public/sitemap-static.xml` is the fallback.
- **Google Merchant Center.** `/products-feed.xml` (from the API) lists every product with a photo
  for free Google Shopping listings. `/policies` (shipping, returns, payment, contact) is the
  return-policy page Merchant Center links to.
- **First paint.** `npm run build` pre-renders the nav and the home hero into `index.html`
  (`src/prerender.tsx`, `scripts/prerender.mjs`). `main.tsx` waits until the browser has painted
  it, then React takes over with identical markup. Fonts are self-hosted (`src/styles/fonts.css`),
  the hero title's font is preloaded, Google Maps loads only on demand, and the admin panel is a
  separate chunk.
- **AI agents.** `/.well-known/ard.json` is an Agentic Resource Discovery manifest. Files that
  don't exist are real 404s, never the app shell.

## Structure

```
src/
  App.tsx              routes (store, /p/<slug>, #admin → admin panel, loaded on demand)
  main.tsx             start-up; takes over from the pre-rendered nav + hero
  prerender.tsx        build-time render of the nav + hero (scripts/prerender.mjs)
  services/api.ts      API client, runtime API address, photo URLs
  store/               Zustand slices; useProducts keeps unsent admin edits in an
                       outbox so a flaky connection never loses work
  components/
    store/             public shop
    admin/             admin panel: products, orders, settings
    common/            toast, lightbox, back-to-top
  i18n/translations.ts gr/en/fr/de/es
  styles/global.css
```

## CI

`.github/workflows/release.yml`: type check, format check and build on every
pull request and push; pushes to `release` also build and push the image.
