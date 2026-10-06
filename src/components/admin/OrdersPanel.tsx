import { useCallback, useEffect, useState } from 'react';
import { api, type Order, type OrderStatus } from '../../services/api';
import { useAuth } from '../../store/useAuth';

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: '🆕 Νέα',
  CONFIRMED: '✅ Επιβεβαιωμένη',
  SHIPPED: '📦 Στάλθηκε',
  CANCELLED: '✖ Ακυρώθηκε',
};

const euro = (n: number) => `€${n.toFixed(2)}`;

const when = (iso: string) =>
  new Date(iso).toLocaleString('el-GR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export const OrdersPanel = () => {
  const token = useAuth((s) => s.token);
  const expire = useAuth((s) => s.expire);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setFailed(false);
    const res = await api.orders(token);
    if (res.ok) setOrders(res.data);
    else if (res.status === 401) expire();
    else setFailed(true);
  }, [token, expire]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: OrderStatus) => {
    if (!token) return;
    const res = await api.setOrderStatus(token, id, status);
    if (res.ok) setOrders((list) => list?.map((o) => (o.id === id ? res.data : o)) ?? null);
    else if (res.status === 401) expire();
    else alert('Η αλλαγή δεν αποθηκεύτηκε. Δοκίμασε ξανά.');
  };

  if (failed) {
    return (
      <div className="admin-empty small">
        <span>Δεν φορτώθηκαν οι παραγγελίες.</span>
        <button type="button" className="btn-secondary" onClick={() => void load()}>
          Δοκίμασε ξανά
        </button>
      </div>
    );
  }
  if (!orders) return <div className="admin-empty small">Φόρτωση…</div>;
  if (!orders.length) {
    return (
      <div className="admin-empty">
        <span className="admin-empty-icon" aria-hidden>
          🧾
        </span>
        <span>Δεν υπάρχουν παραγγελίες ακόμα.</span>
      </div>
    );
  }

  return (
    <div className="order-list">
      <div className="order-list-head">
        <span>{orders.filter((o) => o.status === 'NEW').length} νέες</span>
        <button type="button" className="btn-secondary" onClick={() => void load()}>
          ↻ Ανανέωση
        </button>
      </div>
      {orders.map((o) => (
        <article key={o.id} className={`order-card status-${o.status.toLowerCase()}`}>
          <header className="order-card-head">
            <div>
              <strong>{o.name}</strong>
              <small>{when(o.createdAt)}</small>
            </div>
            <select
              className="form-input order-status"
              value={o.status}
              onChange={(e) => void setStatus(o.id, e.target.value as OrderStatus)}
              aria-label="Κατάσταση παραγγελίας"
            >
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </header>
          <ul className="order-items">
            {o.items.map((i) => (
              <li key={i.productId}>
                <span>
                  {i.name} ×{i.qty}
                </span>
                <span>{euro(i.price * i.qty)}</span>
              </li>
            ))}
            <li className="order-total">
              <span>Σύνολο {o.shipping > 0 ? `(με μεταφορικά ${euro(o.shipping)})` : '(δωρεάν μεταφορικά)'}</span>
              <span>{euro(o.total)}</span>
            </li>
          </ul>
          <div className="order-contact">
            <a href={`tel:${o.phone}`}>📞 {o.phone}</a>
            <a href={`mailto:${o.email}`}>✉️ {o.email}</a>
            <span>📍 {o.address}</span>
            {o.notes && <span>📝 {o.notes}</span>}
          </div>
        </article>
      ))}
    </div>
  );
};
