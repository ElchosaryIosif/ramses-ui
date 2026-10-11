import { useEffect, useRef, useState } from 'react';
import { useCart, cartTotals } from '../../store/useCart';
import { useUI } from '../../store/useUI';
import { useSettings } from '../../store/useSettings';
import { api } from '../../services/api';

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
      setError('⚠ Συμπλήρωσε όλα τα υποχρεωτικά πεδία.');
      return;
    }
    if (!form.email.includes('@')) {
      setError('⚠ Βάλε έγκυρο email.');
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
        ? '⚠ Κάποιο προϊόν του καλαθιού δεν είναι πλέον διαθέσιμο. Αφαίρεσέ το και δοκίμασε ξανά.'
        : res.status === 0
          ? '⚠ Δεν υπάρχει σύνδεση. Έλεγξε το internet και ξαναδοκίμασε.'
          : '⚠ Η παραγγελία δεν στάλθηκε. Δοκίμασε ξανά ή επικοινώνησε μαζί μας τηλεφωνικά.'
    );
  };

  const whatsappLink = () => {
    const lines = items.map((c) => `• ${c.name} ×${c.qty} — €${(c.price * c.qty).toFixed(2)}`);
    const text = [
      'Γεια σας! Μόλις έστειλα παραγγελία από το ramsesbazaar.com:',
      ...lines,
      `Σύνολο: €${total.toFixed(2)}`,
      `Όνομα: ${form.name}`,
    ].join('\n');
    return `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(text)}`;
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
              <h2 className="modal-title">ΟΛΟΚΛΗΡΩΣΗ ΠΑΡΑΓΓΕΛΙΑΣ</h2>
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
                  <span style={{ fontFamily: "'Cinzel', serif", color: 'var(--sand)' }}>Σύνολο</span>
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
                  <label className="form-label">Ονοματεπώνυμο *</label>
                  <input
                    ref={nameRef}
                    className="form-input"
                    placeholder="Γιώργος Παπαδόπουλος"
                    value={form.name}
                    onChange={update('name')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Τηλέφωνο *</label>
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
                  <label className="form-label">Διεύθυνση αποστολής *</label>
                  <input
                    className="form-input"
                    placeholder="Οδός Αρ., Πόλη, ΤΚ"
                    value={form.address}
                    onChange={update('address')}
                  />
                </div>
                <div className="form-group full">
                  <label className="form-label">Σχόλια / Παρατηρήσεις</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: 60 }}
                    placeholder="Ειδικές οδηγίες, χρώμα, μέγεθος…"
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
                {submitting ? 'Αποστολή…' : 'Αποστολή Παραγγελίας →'}
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
                Η ΠΑΡΑΓΓΕΛΙΑ ΣΤΑΛΗΚΕ!
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                Λάβαμε την παραγγελία σας και θα επικοινωνήσουμε σύντομα για επιβεβαίωση.
              </p>
              {settings.whatsapp ? (
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-phone">
                  💬 <span>Στείλτε την παραγγελία και στο WhatsApp</span>
                </a>
              ) : null}
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
                  ΤΡΑΠΕΖΙΚΗ ΜΕΤΑΦΟΡΑ
                </p>
                <div className="bank-row">
                  <span className="bank-label">Τράπεζα</span>
                  <span className="bank-val">{settings.bank || 'Επικοινωνήστε μαζί μας'}</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">Δικαιούχος</span>
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
                  <span className="bank-label">Ποσό</span>
                  <span
                    className="bank-val"
                    style={{ fontFamily: "'Cinzel', serif", color: 'var(--gold)', fontSize: '1.1rem' }}
                  >
                    €{total.toFixed(2)}
                    {shipping > 0 ? ` (συμπ. €${shipping.toFixed(2)} αποστολή)` : ' (δωρεάν αποστολή 🎉)'}
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
                  Αναλυτικά:
                </strong>
                <br />
                {items.map((c) => (
                  <div key={c.id}>
                    • {c.name} ×{c.qty} — €{(c.price * c.qty).toFixed(2)}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                Στείλτε αντίγραφο μεταφοράς στο{' '}
                <strong style={{ color: 'var(--sand)' }}>{settings.email || settings.phone || '—'}</strong>
                <br />
                μετά την πληρωμή για άμεση επεξεργασία.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-order" style={{ marginBottom: 0 }} onClick={close}>
                ← Κλείσιμο
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
