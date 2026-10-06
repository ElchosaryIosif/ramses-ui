import { useEffect, useState } from 'react';
import { useProducts } from '../../store/useProducts';

const useOnline = () => {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
};

/** Small pill in the admin bar: is everything safely saved online? */
export const SyncStatus = () => {
  const sync = useProducts((s) => s.sync);
  const pending = useProducts((s) => s.outbox.length);
  const online = useOnline();

  let tone = 'ok';
  let label = 'Αποθηκευμένα';
  if (sync === 'saving') {
    tone = 'busy';
    label = 'Αποθήκευση…';
  } else if (pending) {
    tone = 'error';
    label = online ? 'Δεν στάλθηκαν' : 'Εκτός σύνδεσης';
  } else if (!online) {
    tone = 'idle';
    label = 'Εκτός σύνδεσης';
  }

  return (
    <span className={`sync-pill ${tone}`} role="status" aria-live="polite" title={label}>
      {tone === 'busy' ? <span className="spinner small" aria-hidden /> : <span className="dot" aria-hidden />}
      <span className="sync-label">{label}</span>
    </span>
  );
};
