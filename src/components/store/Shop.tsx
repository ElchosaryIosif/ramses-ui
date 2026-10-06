import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../store/useProducts';
import { useLang } from '../../store/useLang';
import { t } from '../../i18n/translations';
import { ProductCard } from './ProductCard';
import type { Category } from '../../types';

type Filter = 'all' | Category;

const CATS: { key: Filter; tKey: 'all' | Category }[] = [
  { key: 'all', tKey: 'all' },
  { key: 'jewelry', tKey: 'jewelry' },
  { key: 'clothes', tKey: 'clothes' },
  { key: 'home', tKey: 'home' },
  { key: 'incense', tKey: 'incense' },
  { key: 'collectibles', tKey: 'collectibles' },
];

interface Props {
  initialFilter?: Filter;
}

export const Shop = ({ initialFilter }: Props) => {
  const products = useProducts((s) => s.products);
  const lang = useLang((s) => s.lang);
  const [filter, setFilter] = useState<Filter>(initialFilter ?? 'all');

  useEffect(() => {
    if (initialFilter) setFilter(initialFilter);
  }, [initialFilter]);

  // Re-trigger reveal observer when filter changes / products change
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.product-card.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [filter, products]);

  const filtered = useMemo(
    () => (filter === 'all' ? products : products.filter((p) => p.cat === filter)),
    [filter, products]
  );

  return (
    <section id="shop" className="shop-section">
      <div className="section-header">
        <div className="divider" />
        <h2 className="section-title">{t('collection', lang)}</h2>
        <p className="section-sub">{t('collection_sub', lang)}</p>
      </div>
      <div className="cat-filter">
        {CATS.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`cat-pill${filter === c.key ? ' active' : ''}`}
            onClick={() => setFilter(c.key)}
          >
            {t(c.tKey, lang)}
          </button>
        ))}
      </div>
      <div className="products-grid">
        {products.length === 0 ? (
          <div className="empty-store">
            <div className="empty-icon">🏺</div>
            <h3>Η συλλογή ετοιμάζεται…</h3>
            <p>
              Σύντομα θα βρείτε εδώ μοναδικά
              <br />
              boho & ethnic αντικείμενα από όλο τον κόσμο.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-store">
            <div className="empty-icon">🔍</div>
            <h3>Δεν βρέθηκαν προϊόντα</h3>
            <p>Δοκίμασε άλλη κατηγορία.</p>
          </div>
        ) : (
          filtered.map((p, i) => <ProductCard key={p.id} product={p} delayMs={(i % 4) * 80} />)
        )}
      </div>
    </section>
  );
};
