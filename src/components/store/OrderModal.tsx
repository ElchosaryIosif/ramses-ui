import { useEffect, useRef, useState } from 'react';
import { useCart, cartTotals } from '../../store/useCart';
import { useUI } from '../../store/useUI';
import { useSettings } from '../../store/useSettings';
import { api } from '../../services/api';
import { useLang } from '../../store/useLang';
import { t, tf } from '../../i18n/translations';

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  website: string;
}

const empty: FormState = { name: '', phone: '', email: '', address: '', notes: '', website: '' };

export const OrderModal = () => {
  const open = useUI((s) => s.orderOpen);
  const closeOrder = useUI((s) => s.closeOrder);
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const settings = useSettings((s) => s.settings);
  const lang = useLang((s) => s.lang);

  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setForm(empty);
      setError('');
      setConfirmed(false);
      setSubmitting(false);
      window.setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;
  const { subtotal, shipping, total } = cartTotals(items);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async () => {
    if (!form.name || !form.phone || !form.email || !form.address) {
      setError(t('err_required', lang));
      return;
    }
    if (!form.email.includes('@')) {
      setError(t('err_email', lang));
      return;
    }
    setError('');
    setSubmitting(true);

    const res = await api.placeOrder({
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      notes: form.notes,
      items: items.map((c) => ({ id: c.id, qty: c.qty })),
      website: form.website,
    });
    setSubmitting(false);
    if (res.ok) {
      setConfirmed(true);
      return;
    }
    setError(
      res.error === 'unavailable_product'
        ? t('err_unavailable', lang)
        : res.status === 0
          ? t('err_offline', lang)
          : t('err_failed', lang)
    );
  };

  const close = () => {
    closeOrder();
    if (confirmed) clear();
  };

  return (
    <>
      <div className="modal-overlay" onClick={close} />
      <div className="modal" role="dialog" aria-modal="true">
        {!confirmed ? (
          <>
            <div className="modal-header">
              <h2 className="modal-title">{t('order_title', lang)}</h2>
              <button type="button" className="btn-close" onClick={close} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div
                style={{
                  background: 'var(--dark3)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.82rem',
                  color: 'var(--muted)',
                  lineHeight: 1.8,
                }}
              >
                {items.map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      {c.name} ×{c.qty}
                    </span>
                    <span style={{ color: 'var(--gold)' }}>€{(c.price * c.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontFamily: "'Cinzel', serif", color: 'var(--sand)' }}>{t('total_label', lang)}</span>
                  <span style={{ fontFamily: "'Cinzel', serif", color: 'var(--gold)' }}>
                    €{(subtotal + shipping).toFixed(2)}
                  </span>
                </div>
              </div>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                value={form.website}
                onChange={update('website')}
              />
              <div className="form-grid">
                <div className="form-group full">
                  <label className="form-label">{t('f_name', lang)}</label>
                  <input
                    ref={nameRef}
                    className="form-input"
                    placeholder={t('f_name_ph', lang)}
                    value={form.name}
                    onChange={update('name')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('f_phone', lang)}</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="694 000 0000"
                    value={form.phone}
                    onChange={update('phone')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="email@email.com"
                    value={form.email}
                    onChange={update('email')}
                  />
                </div>
                <div className="form-group full">
                  <label className="form-label">{t('f_address', lang)}</label>
                  <input
                    className="form-input"
                    placeholder={t('f_address_ph', lang)}
                    value={form.address}
                    onChange={update('address')}
                  />
                </div>
                <div className="form-group full">
                  <label className="form-label">{t('f_notes', lang)}</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: 60 }}
                    placeholder={t('f_notes_ph', lang)}
                    value={form.notes}
                    onChange={update('notes')}
                  />
                </div>
              </div>
              {error && <p style={{ fontSize: '0.75rem', color: '#e05c4a', marginTop: 8 }}>{error}</p>}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-order"
                onClick={onSubmit}
                disabled={submitting}
                style={{ marginBottom: 0 }}
              >
                {submitting ? t('sending', lang) : t('submit_order', lang)}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div />
              <button type="button" className="btn-close" onClick={close} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', paddingTop: 0 }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✦</div>
              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.1rem',
                  color: 'var(--gold)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem',
                }}
              >
                {t('order_sent', lang)}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                {t('order_sent_body', lang)}
              </p>
              <div
                style={{
                  background: 'var(--dark3)',
                  border: '1px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '1.25rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {t('bank_transfer', lang)}
                </p>
                <div className="bank-row">
                  <span className="bank-label">{t('bank', lang)}</span>
                  <span className="bank-val">{settings.bank || t('bank_contact', lang)}</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">{t('beneficiary', lang)}</span>
                  <span className="bank-val">{settings.accountName || '—'}</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">IBAN</span>
                  <span
                    className="bank-val"
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all' }}
                  >
                    {settings.iban || '—'}
                  </span>
                </div>
                <div className="bank-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <span className="bank-label">{t('amount', lang)}</span>
                  <span
                    className="bank-val"
                    style={{ fontFamily: "'Cinzel', serif", color: 'var(--gold)', fontSize: '1.1rem' }}
                  >
                    €{total.toFixed(2)}
                    {shipping > 0
                      ? tf('incl_shipping', lang, { amount: `€${shipping.toFixed(2)}` })
                      : t('free_shipping_paren', lang)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--muted)',
                  textAlign: 'left',
                  marginBottom: '1.25rem',
                  lineHeight: 1.9,
                }}
              >
                <strong
                  style={{
                    color: 'var(--sand)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('details', lang)}
                </strong>
                <br />
                {items.map((c) => (
                  <div key={c.id}>
                    • {c.name} ×{c.qty} — €{(c.price * c.qty).toFixed(2)}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                {t('send_receipt_to', lang)}{' '}
                <strong style={{ color: 'var(--sand)' }}>{settings.email || settings.phone || '—'}</strong>
                <br />
                {t('send_receipt_after', lang)}
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-order" style={{ marginBottom: 0 }} onClick={close}>
                {t('close', lang)}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
