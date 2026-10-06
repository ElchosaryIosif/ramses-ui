import { useEffect, useState, useSyncExternalStore } from 'react';
import { installPrompt, isIOS, isStandalone } from '../../services/installPrompt';
import { readJSON, writeJSON } from '../../services/storage';

const DISMISSED_KEY = 'rb_install_dismissed';

/**
 * Nudges her to add the admin panel to her home screen, so logging in is one
 * tap instead of typing a URL. Shown inline in the admin banners, once, and
 * never again once dismissed or once the app is actually installed.
 */
export const InstallHint = () => {
  const available = useSyncExternalStore(installPrompt.subscribe, () => installPrompt.available);
  const [dismissed, setDismissed] = useState(() => readJSON(DISMISSED_KEY, false));
  const [standalone, setStandalone] = useState(isStandalone);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onInstalled = () => setStandalone(true);
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  const dismiss = () => {
    writeJSON(DISMISSED_KEY, true);
    setDismissed(true);
  };

  if (dismissed || standalone) return null;
  if (!available && !isIOS()) return null; // unsupported browser — stay quiet

  const install = async () => {
    setBusy(true);
    const outcome = await installPrompt.prompt();
    setBusy(false);
    if (outcome === 'accepted') dismiss();
  };

  return (
    <div className="admin-banner info install-hint">
      {available ? (
        <>
          <span>
            📲 <strong>Πρόσθεσέ το στην αρχική οθόνη</strong> — άνοιγμα με ένα πάτημα, σαν κανονική εφαρμογή.
          </span>
          <span className="banner-actions">
            <button type="button" className="btn-banner" disabled={busy} onClick={() => void install()}>
              {busy ? '…' : 'Εγκατάσταση'}
            </button>
            <button type="button" className="btn-banner subtle" onClick={dismiss}>
              Όχι τώρα
            </button>
          </span>
        </>
      ) : (
        <>
          <span>
            📲 <strong>Πρόσθεσέ το στην αρχική οθόνη:</strong> πάτα το{' '}
            <span className="ios-share-icon" aria-label="Κουμπί κοινής χρήσης">
              ⬆️
            </span>{' '}
            κάτω στο Safari, μετά «Προσθήκη στην Αρχική οθόνη».
          </span>
          <button type="button" className="btn-banner subtle" onClick={dismiss}>
            Το 'πιασα
          </button>
        </>
      )}
    </div>
  );
};
