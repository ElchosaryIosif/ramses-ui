import { useState } from 'react';
import { useSettings } from '../../store/useSettings';
import { useAuth } from '../../store/useAuth';
import { useUI } from '../../store/useUI';
import { api } from '../../services/api';

export const SettingsPanel = () => {
  const settings = useSettings((s) => s.settings);
  const save = useSettings((s) => s.save);
  const toast = useUI((s) => s.showToast);

  const [form, setForm] = useState({
    whatsapp: settings.whatsapp,
    phone: settings.phone,
    address: settings.address,
    iban: settings.iban || '',
    bank: settings.bank || '',
    accountName: settings.accountName || '',
    email: settings.email || '',
  });
  const [busy, setBusy] = useState(false);

  const update =
    <K extends keyof typeof form>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await save({
      whatsapp: form.whatsapp.replace(/[^\d]/g, ''),
      phone: form.phone.trim(),
      address: form.address.trim(),
      iban: form.iban.trim(),
      bank: form.bank.trim(),
      accountName: form.accountName.trim(),
      email: form.email.trim(),
    });
    setBusy(false);
    toast(ok ? '✓ Οι ρυθμίσεις αποθηκεύτηκαν' : 'Δεν αποθηκεύτηκαν — έλεγξε τη σύνδεση', ok ? 'success' : 'error');
  };

  return (
    <div>
      <PasswordCard />

      <form onSubmit={onSave}>
        <div className="settings-card">
          <h3>📲 ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">WhatsApp / κλήση (με κωδικό χώρας)</label>
              <input className="form-input" inputMode="tel" value={form.whatsapp} onChange={update('whatsapp')} />
              <p className="form-hint">π.χ. 302721096103</p>
            </div>
            <div className="form-group">
              <label className="form-label">Τηλέφωνο (όπως φαίνεται)</label>
              <input className="form-input" value={form.phone} onChange={update('phone')} />
            </div>
            <div className="form-group full">
              <label className="form-label">Διεύθυνση</label>
              <input className="form-input" value={form.address} onChange={update('address')} />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h3>🏦 ΤΡΑΠΕΖΙΚΑ ΣΤΟΙΧΕΙΑ</h3>
          <p className="settings-note">Εμφανίζονται στον πελάτη μετά την παραγγελία, για μεταφορά.</p>
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">IBAN</label>
              <input
                className="form-input"
                value={form.iban}
                onChange={update('iban')}
                placeholder="GR00 0000 0000 0000 0000 0000 000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Τράπεζα</label>
              <input className="form-input" value={form.bank} onChange={update('bank')} />
            </div>
            <div className="form-group">
              <label className="form-label">Δικαιούχος</label>
              <input className="form-input" value={form.accountName} onChange={update('accountName')} />
            </div>
            <div className="form-group full">
              <label className="form-label">Email για παραγγελίες</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={update('email')}
                placeholder="ramsesbazaar@email.com"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? <span className="spinner dark" /> : '💾'} Αποθήκευση ρυθμίσεων
          </button>
        </div>
      </form>
    </div>
  );
};

const PasswordCard = () => {
  const token = useAuth((s) => s.token);
  const adopt = useAuth((s) => s.adopt);
  const expire = useAuth((s) => s.expire);
  const isDefault = useAuth((s) => s.status?.defaultPassword);
  const toast = useUI((s) => s.showToast);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmNext, setConfirmNext] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next.length < 8) return setError('Ο νέος κωδικός θέλει τουλάχιστον 8 χαρακτήρες');
    if (next !== confirmNext) return setError('Οι δύο νέοι κωδικοί δεν ταιριάζουν');
    if (!token) return;
    setBusy(true);
    const res = await api.changePassword(token, current, next);
    setBusy(false);
    if (res.ok) {
      adopt(res.data, true);
      setCurrent('');
      setNext('');
      setConfirmNext('');
      toast('✓ Ο κωδικός άλλαξε — οι άλλες συσκευές αποσυνδέθηκαν');
    } else if (res.status === 403) setError('Ο τωρινός κωδικός δεν είναι σωστός');
    else if (res.status === 401) expire();
    else setError('Δεν υπάρχει σύνδεση — δοκίμασε ξανά');
  };

  return (
    <form className={`settings-card${isDefault ? ' highlight' : ''}`} onSubmit={submit}>
      <h3>🔐 ΑΛΛΑΓΗ ΚΩΔΙΚΟΥ</h3>
      <div className="form-grid">
        <div className="form-group full">
          <label className="form-label">Τωρινός κωδικός</label>
          <input
            type="password"
            className="form-input"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Νέος κωδικός</label>
          <input
            type="password"
            className="form-input"
            autoComplete="new-password"
            placeholder="τουλάχιστον 8 χαρακτήρες"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Ξανά ο νέος</label>
          <input
            type="password"
            className="form-input"
            autoComplete="new-password"
            value={confirmNext}
            onChange={(e) => setConfirmNext(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="field-error">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="btn-secondary" disabled={busy || !current || !next}>
          {busy ? <span className="spinner small" /> : null} Αλλαγή κωδικού
        </button>
      </div>
    </form>
  );
};
