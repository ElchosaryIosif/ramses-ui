import { useSettings } from '../../store/useSettings';
import { Logo } from '../common/Logo';
import { linkClick } from '../../services/router';
import { useLang } from '../../store/useLang';
import { t } from '../../i18n/translations';
import { useUI } from '../../store/useUI';
import { analyticsAvailable } from '../../services/analytics';

export const Footer = () => {
  const settings = useSettings((s) => s.settings);
  const openConsent = useUI((s) => s.openConsent);
  const lang = useLang((s) => s.lang);
  return (
    <footer className="site-footer">
      <Logo className="footer-logo-img" size={120} lazy />
      <div className="footer-logo">RAMSES BAZAAR</div>
      <a
        className="footer-addr"
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.address}, Greece`)}`}
        target="_blank"
        rel="noreferrer"
      >
        📍 {settings.address} · Greece
      </a>
      <div className="footer-links">
        <a href="https://www.instagram.com/ramsesbazaar" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="https://www.facebook.com/RamsesBazaar" target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href={`tel:+${settings.whatsapp}`}>📞 {settings.phone}</a>
        <a href="/policies" onClick={linkClick('/policies')}>
          {t('policies_title', lang)}
        </a>
        {analyticsAvailable() && (
          <button type="button" className="footer-cookie-btn" onClick={openConsent}>
            Cookies
          </button>
        )}
      </div>
      <div className="footer-copy">© 2026 Ramses Bazaar</div>
    </footer>
  );
};
