# ramses-ui

The Ramses Bazaar shop and its admin panel (`/#admin`). The API it talks to is
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
`docker-entrypoint.sh` writes `/runtime-config.js` from the container's `API_BASE`
env var, and `src/services/api.ts` reads it. Empty means the API is on the
same origin.

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

## Structure

```
src/
  App.tsx              hash router (#admin → admin panel) + hydration
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
