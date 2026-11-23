import type { Category, Product, Tag } from '../types';

/**
 * A product page's HTML carries the product as JSON (<script id="product-data">, written by
 * nginx from the API). Reading it lets the page show the product without waiting for the full
 * catalogue request.
 */
export const embeddedProduct = (slug: string): Product | undefined => {
  try {
    const el = document.getElementById('product-data');
    if (!el?.textContent) return undefined;
    const p = JSON.parse(el.textContent) as Partial<Product>;
    if (typeof p.id !== 'string' || typeof p.name !== 'string' || typeof p.price !== 'number') return undefined;
    if (p.slug !== slug && slug !== p.id && !slug.endsWith(`-${p.id}`)) return undefined;
    return {
      id: p.id,
      name: p.name,
      cat: p.cat as Category,
      price: p.price,
      tag: (p.tag ?? '') as Tag,
      desc: p.desc ?? '',
      stock: p.stock !== false,
      image: p.image ?? null,
      createdAt: p.createdAt ?? 0,
      slug: p.slug,
    };
  } catch {
    return undefined;
  }
};
