import { memo, useState } from 'react';
import type { Product } from '../../types';
import { CAT_ICONS, CAT_LABELS, tagLabel } from '../../i18n/translations';
import { useCart } from '../../store/useCart';
import { useUI } from '../../store/useUI';
import { mediaUrl } from '../../services/api';

interface Props {
  product: Product;
  delayMs: number;
}

export const ProductCard = memo(({ product, delayMs }: Props) => {
  const add = useCart((s) => s.add);
  const openLightbox = useUI((s) => s.openLightbox);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    if (!product.stock) return;
    add(product);
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
        {product.tag && <span className={`product-badge ${badgeClass}`}>{tagLabel(product.tag)}</span>}
        {product.image ? (
          <img
            src={mediaUrl(product.image)}
            alt={product.name}
            loading="lazy"
            onClick={() => openLightbox(product.id)}
            style={{ cursor: 'zoom-in' }}
          />
        ) : (
          <div className="product-img-placeholder">{CAT_ICONS[product.cat]}</div>
        )}
        {!product.stock && <div className="out-of-stock-overlay">Εκτός αποθέματος</div>}
      </div>
      <div className="product-body">
        <div className="product-category">{CAT_LABELS[product.cat]}</div>
        <div className="product-name">{product.name}</div>
        {product.desc && <div className="product-desc">{product.desc}</div>}
        <div className="product-footer">
          <span className="product-price">€{product.price.toFixed(2)}</span>
          <button type="button" className={`btn-add${added ? ' added' : ''}`} disabled={!product.stock} onClick={onAdd}>
            {!product.stock ? 'Εξαντλήθηκε' : added ? '✓ Προστέθηκε' : '+ Καλάθι'}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
