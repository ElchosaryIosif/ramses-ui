import { useEffect, useRef, useState } from 'react';
import { useAuth, type LoginResult } from '../../store/useAuth';

interface Props {
  onBack: () => void;
}

const MESSAGES: Record<Exclude<LoginResult, 'ok'>, string> = {
  wrong: 'Λάθος κωδικός — δοκίμασε ξανά',
  network: 'Δεν υπάρχει σύνδεση. Έλεγξε το internet και ξαναδοκίμασε.',
};

export const PasswordGate = ({ onBack }: Props) => {
  const login = useAuth((s) => s.login);
  const expired = useAuth((s) => s.expired);
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Exclude<LoginResult, 'ok'> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || busy) return;
    setBusy(true);
    const result = await login(value, remember);
    setBusy(false);
    if (result !== 'ok') {
      setError(result);
      if (result === 'wrong') setValue('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="password-gate">
      <div className="gate-card">
        <div className="gate-icon">🔐</div>
        <h2 className="gate-title">ADMIN PANEL</h2>
        <p className="gate-sub">Ramses Bazaar · Διαχείριση Καταστήματος</p>
        {expired && !error && <p className="gate-note">Η σύνδεση έληξε — συνδέσου ξανά.</p>}
        <form className="gate-form" onSubmit={submit}>
          <div className="pw-field">
            <input
              ref={inputRef}
              type={show ? 'text' : 'password'}
              className="form-input"
              placeholder="Κωδικός πρόσβασης"
              autoComplete="current-password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
            />
            <button
              type="button"
              className="pw-eye"
              aria-label={show ? 'Απόκρυψη κωδικού' : 'Εμφάνιση κωδικού'}
              onClick={() => setShow((s) => !s)}
            >
              {show ? '🙈' : '👁'}
            </button>
          </div>
          <label className="check-row">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span>Να με θυμάσαι σε αυτή τη συσκευή (30 ημέρες)</span>
          </label>
          <button type="submit" className="btn-primary btn-block" disabled={busy || !value}>
            {busy ? <span className="spinner" aria-label="Σύνδεση…" /> : 'Είσοδος'}
          </button>
          {error && <p className="gate-error">{MESSAGES[error]}</p>}
        </form>
        <a
          href="#"
          className="gate-back"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          ← Πίσω στο κατάστημα
        </a>
      </div>
    </div>
  );
};
