import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../store/useProducts';
import { useCart } from '../../store/useCart';
import { useUI } from '../../store/useUI';
import { useLang } from '../../store/useLang';
import { CAT_ICONS, catName, t, tagName, tf } from '../../i18n/translations';
import { mediaUrl } from '../../services/api';
import { track } from '../../services/analytics';
import { findBySlug, linkClick, navigate, productPath } from '../../services/router';
import { setPageMeta } from '../../services/pageMeta';
import { embeddedProduct } from '../../services/embeddedProduct';
import { FREE_SHIPPING_AT } from '../../services/shipping';
import { ProductCard } from './ProductCard';
import { useRevealCards } from '../../hooks/useRevealCards';

const describe = (name: string, desc: string, price: number) =>
  (desc.trim() || `${name} από το Ramses Bazaar, Καλαμάτα. €${price.toFixed(2)}.`).replace(/\s+/g, ' ').slice(0, 160);

export const ProductPage = ({ slug }: { slug: string }) => {
  const products = useProducts((s) => s.products);
  const hydrated = useProducts((s) => s.hydrated);
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const openLightbox = useUI((s) => s.openLightbox);
  const lang = useLang((s) => s.lang);
  const [added, setAdded] = useState(false);

  // Until the catalogue arrives, use the copy embedded in the page's HTML.
  const product = useMemo(
    () => findBySlug(products, slug) ?? (hydrated ? undefined : embeddedProduct(slug)),
    [products, slug, hydrated]
  );
  const related = useMemo(
    () => (product ? products.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, 4) : []),
    [products, product]
  );

  useEffect(() => {
    if (!product) return;
    const path = productPath(product);
    // An old address (the product was renamed since): show the current one.
    if (window.location.pathname !== path) navigate(path, { replace: true });
    setPageMeta({
      title: `${product.name} | Ramses Bazaar`,
      description: describe(product.name, product.desc, product.price),
      path,
    });
    track.viewItem(product);
    // Only when the product itself changes, not on every catalogue refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  useEffect(() => setAdded(false), [product?.id]);
  useRevealCards([related]);

  if (!product) {
    if (!hydrated) return <section className="product-page product-page-loading" aria-busy="true" />;
    return (
      <section className="product-page">
        <div className="empty-store">
          <div className="empty-icon">🏺</div>
          <h1 className="product-missing-title">{t('product_missing_title', lang)}</h1>
          <p>{t('product_missing_body', lang)}</p>
          <a className="product-back" href="/#shop" onClick={linkClick('/')}>
            ← {t('back_to_shop', lang)}
          </a>
        </div>
      </section>
    );
  }

  const onAdd = () => {
    if (!product.stock) return;
    add(product);
    track.addToCart(product);
    setAdded(true);
  };

  return (
    <>
      <section className="product-page">
        <nav className="breadcrumb" aria-label={t('breadcrumb', lang)}>
          <a href="/" onClick={linkClick('/')}>
            {t('breadcrumb_home', lang)}
          </a>
          <span aria-hidden="true">›</span>
          <span>{catName(product.cat, lang)}</span>
        </nav>
        <div className="product-detail">
          <div className="product-detail-media">
            {product.tag && <span className={`product-badge badge-${product.tag}`}>{tagName(product.tag, lang)}</span>}
            {product.image ? (
              <button type="button" className="product-zoom" onClick={() => openLightbox(product.id)}>
                <img
                  src={mediaUrl(product.image)}
                  alt={product.name}
                  width={800}
                  height={800}
                  fetchPriority="high"
                  decoding="async"
                />
              </button>
            ) : (
              <div className="product-img-placeholder">{CAT_ICONS[product.cat]}</div>
            )}
          </div>
          <div className="product-detail-info">
            <p className="product-category">{catName(product.cat, lang)}</p>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-price">€{product.price.toFixed(2)}</p>
            <p className={`product-stock${product.stock ? '' : ' out'}`}>
              {product.stock ? t('in_stock', lang) : t('out_of_stock', lang)}
            </p>
            {product.desc && <p className="product-detail-desc">{product.desc}</p>}
            <div className="product-detail-actions">
              <button type="button" className="btn-order" disabled={!product.stock} onClick={onAdd}>
                {!product.stock ? t('sold_out', lang) : added ? t('added', lang) : t('add_to_cart', lang)}
              </button>
              {added && (
                <button type="button" className="btn-secondary" onClick={openCart}>
                  {t('view_cart', lang)}
                </button>
              )}
            </div>
            <p className="product-ship-note">
              🚚 {tf('free_shipping_from', lang, { amount: `€${FREE_SHIPPING_AT.toFixed(0)}` })}
            </p>
            <a className="product-back" href="/#shop" onClick={linkClick('/')}>
              ← {t('back_to_shop', lang)}
            </a>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="shop-section related-section" aria-labelledby="related-title">
          <div className="section-header">
            <div className="divider" />
            <h2 className="section-title" id="related-title">
              {t('related_products', lang)}
            </h2>
          </div>
          <div className="products-grid">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} delayMs={(i % 4) * 80} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};
