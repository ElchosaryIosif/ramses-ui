/**
 * Keeps the page title, description and canonical address in step with in-app navigation.
 * The first load of a product page already has them in its HTML (the server writes them);
 * this covers moving between pages without a reload.
 */
const SITE = 'https://ramsesbazaar.com';

export const HOME_META = {
  title: 'Ramses Bazaar — Boho & Ethnic Gift Store | Καλαμάτα',
  description:
    'Ramses Bazaar, Καλαμάτα, από το 1996: boho, ethnic και hippie κοσμήματα, ρούχα, home decor, θυμιάματα και collectibles από τη Μέση Ανατολή, την Αίγυπτο και όλο τον κόσμο. Στοά Λόντου 1.',
  path: '/',
};

const upsert = (selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  set(el);
};

const meta = (attr: 'name' | 'property', key: string, content: string) =>
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const m = document.createElement('meta');
      m.setAttribute(attr, key);
      return m;
    },
    (el) => el.setAttribute('content', content)
  );

export const setPageMeta = ({ title, description, path }: { title: string; description: string; path: string }) => {
  const url = SITE + path;
  document.title = title;
  meta('name', 'description', description);
  meta('property', 'og:title', title);
  meta('property', 'og:description', description);
  meta('property', 'og:url', url);
  upsert(
    'link[rel="canonical"]',
    () => {
      const l = document.createElement('link');
      l.rel = 'canonical';
      return l;
    },
    (el) => el.setAttribute('href', url)
  );
};
