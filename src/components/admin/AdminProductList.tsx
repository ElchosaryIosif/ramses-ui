import { useMemo, useState } from 'react';
import { useProducts } from '../../store/useProducts';
import { useUI } from '../../store/useUI';
import { CAT_ICONS, CAT_LABELS, tagLabel } from '../../i18n/translations';
import type { Category, Product } from '../../types';
import { mediaUrl } from '../../services/api';

interface Props {
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onAdd: () => void;
}

type Filter = 'all' | 'out' | Category;

const CATS = Object.keys(CAT_LABELS) as Category[];

/** Case- and accent-insensitive, so "κομπολοι" finds "Κομπολόι". */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const AdminProductList = ({ onEdit, onDuplicate, onAdd }: Props) => {
  const products = useProducts((s) => s.products);
  const outbox = useProducts((s) => s.outbox);
  const remove = useProducts((s) => s.remove);
  const toggleStock = useProducts((s) => s.toggleStock);
  const toast = useUI((s) => s.showToast);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const pending = useMemo(() => new Set(outbox.map((op) => (op.type === 'upsert' ? op.product.id : op.id))), [outbox]);

  const counts = useMemo(() => {
    const c: Partial<Record<Filter, number>> = { all: products.length, out: 0 };
    for (const p of products) {
      c[p.cat] = (c[p.cat] ?? 0) + 1;
      if (!p.stock) c.out = (c.out ?? 0) + 1;
    }
    return c;
  }, [products]);

  const visible = useMemo(() => {
    const q = fold(query.trim());
    return products.filter(
      (p) =>
        (filter === 'all' || (filter === 'out' ? !p.stock : p.cat === filter)) &&
        (!q || fold(`${p.name} ${p.desc}`).includes(q))
    );
  }, [products, query, filter]);

  if (products.length === 0) {
    return (
      <div className="admin-empty">
        <div className="admin-empty-icon">🏺</div>
        <p>Δεν υπάρχουν προϊόντα ακόμα.</p>
        <button type="button" className="btn-primary" onClick={onAdd}>
          ➕ Πρόσθεσε το πρώτο προϊόν
        </button>
      </div>
    );
  }

  const onDelete = async (p: Product) => {
    if (!confirm(`Διαγραφή του «${p.name}»;\nΔεν αναιρείται.`)) return;
    const ok = await remove(p.id);
    toast(ok ? '🗑 Διαγράφηκε' : 'Θα διαγραφεί μόλις υπάρξει σύνδεση', ok ? 'success' : 'error');
  };

  const filters: [Filter, string][] = [
    ['all', 'Όλα'],
    ...CATS.filter((c) => counts[c]).map((c): [Filter, string] => [c, `${CAT_ICONS[c]} ${CAT_LABELS[c]}`]),
    ...(counts.out ? ([['out', 'Εξαντλημένα']] as [Filter, string][]) : []),
  ];

  return (
    <div>
      <div className="list-toolbar">
        <div className="search-field">
          <span aria-hidden>🔍</span>
          <input
            type="search"
            className="form-input"
            placeholder="Αναζήτηση προϊόντος…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="button" className="btn-primary" onClick={onAdd}>
          ➕ <span className="btn-label">Νέο</span>
        </button>
      </div>
      <div className="chip-row scroll">
        {filters.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`chip${filter === value ? ' active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label} <span className="chip-count">{counts[value] ?? 0}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="admin-empty small">
          <p>Δεν βρέθηκε κάτι{query ? ` για «${query}»` : ''}.</p>
        </div>
      ) : (
        <div className="admin-product-list">
          {visible.map((p) => (
            <div className={`admin-product-row${p.stock ? '' : ' sold-out'}`} key={p.id}>
              <button
                type="button"
                className="apr-thumb"
                onClick={() => onEdit(p)}
                aria-label={`Επεξεργασία ${p.name}`}
              >
                {p.image ? <img src={mediaUrl(p.image)} alt="" loading="lazy" /> : CAT_ICONS[p.cat]}
              </button>
              <div className="apr-info">
                <div className="apr-name">
                  {p.name}
                  {pending.has(p.id) && (
                    <span className="apr-pending" title="Δεν έχει σταλεί ακόμα">
                      ● σε αναμονή
                    </span>
                  )}
                </div>
                <div className="apr-meta">
                  {CAT_LABELS[p.cat]} · €{p.price.toFixed(2)}
                  {p.tag && ` · ${tagLabel(p.tag)}`}
                </div>
                <label className="stock-toggle compact" onClick={(e) => e.preventDefault()}>
                  <div
                    role="switch"
                    aria-checked={p.stock}
                    tabIndex={0}
                    className={`toggle-switch${p.stock ? ' on' : ''}`}
                    onClick={() => void toggleStock(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        void toggleStock(p.id);
                      }
                    }}
                  />
                  <span>{p.stock ? 'Σε απόθεμα' : 'Εξαντλήθηκε'}</span>
                </label>
              </div>
              <div className="apr-actions">
                <button type="button" className="btn-edit" onClick={() => onEdit(p)}>
                  ✏️ <span className="btn-label">Επεξεργασία</span>
                </button>
                <button type="button" className="btn-edit" onClick={() => onDuplicate(p)} title="Αντίγραφο">
                  ⧉ <span className="btn-label">Αντίγραφο</span>
                </button>
                <button type="button" className="btn-danger" onClick={() => void onDelete(p)} title="Διαγραφή">
                  🗑 <span className="btn-label">Διαγραφή</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
