import { memo, useState } from 'react';
import type { Product } from '../../types';
import { CAT_ICONS, catName, t, tagName } from '../../i18n/translations';
import { useCart } from '../../store/useCart';
import { useLang } from '../../store/useLang';
import { mediaUrl } from '../../services/api';
import { track } from '../../services/analytics';
import { linkClick, productPath } from '../../services/router';

interface Props {
  product: Product;
  delayMs: number;
}

export const ProductCard = memo(({ product, delayMs }: Props) => {
  const add = useCart((s) => s.add);
  const lang = useLang((s) => s.lang);
  const [added, setAdded] = useState(false);
  const href = productPath(product);

  const onAdd = () => {
    if (!product.stock) return;
    add(product);
    track.addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  const badgeClass =
    product.tag === 'new'
      ? 'badge-new'
      : product.tag === 'best'
        ? 'badge-best'
        : product.tag === 'sale'
          ? 'badge-sale'
          : '';

  return (
    <div className="product-card reveal" style={{ transitionDelay: `${delayMs}ms` }}>
      <div className="product-img-wrap">
        {product.tag && <span className={`product-badge ${badgeClass}`}>{tagName(product.tag, lang)}</span>}
        <a href={href} onClick={linkClick(href)} className="product-img-link" tabIndex={-1} aria-hidden="true">
          {product.image ? (
            <img
              src={mediaUrl(product.image)}
              alt={product.name}
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
            />
          ) : (
            <div className="product-img-placeholder">{CAT_ICONS[product.cat]}</div>
          )}
        </a>
        {!product.stock && <div className="out-of-stock-overlay">{t('out_of_stock', lang)}</div>}
      </div>
      <div className="product-body">
        <div className="product-category">{catName(product.cat, lang)}</div>
        <h3 className="product-name">
          <a href={href} onClick={linkClick(href)}>
            {product.name}
          </a>
        </h3>
        {product.desc && <div className="product-desc">{product.desc}</div>}
        <div className="product-footer">
          <span className="product-price">€{product.price.toFixed(2)}</span>
          <button type="button" className={`btn-add${added ? ' added' : ''}`} disabled={!product.stock} onClick={onAdd}>
            {!product.stock ? t('sold_out', lang) : added ? t('added', lang) : t('add_to_cart', lang)}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
