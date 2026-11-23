import { useUI } from '../../store/useUI';
import { useLang } from '../../store/useLang';
import { t } from '../../i18n/translations';
import { setConsent, type Consent } from '../../services/analytics';

/** GDPR cookie choice. Analytics loads only after "Accept". */
export const ConsentBanner = () => {
  const open = useUI((s) => s.consentOpen);
  const close = useUI((s) => s.closeConsent);
  const lang = useLang((s) => s.lang);
  if (!open) return null;

  const choose = (c: Consent) => {
    setConsent(c);
    close();
  };

  return (
    <div className="consent-banner" role="dialog" aria-live="polite" aria-label="Cookies">
      <p className="consent-text">{t('consent_text', lang)}</p>
      <div className="consent-actions">
        <button type="button" className="consent-btn" onClick={() => choose('denied')}>
          {t('consent_decline', lang)}
        </button>
        <button type="button" className="consent-btn primary" onClick={() => choose('granted')}>
          {t('consent_accept', lang)}
        </button>
      </div>
    </div>
  );
};
