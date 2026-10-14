import { useSettings } from '../../store/useSettings';

export const Footer = () => {
  const settings = useSettings((s) => s.settings);
  return (
    <footer className="site-footer">
      <img className="footer-logo-img" src="/logo.jpg" alt="Ramses Bazaar" />
      <div className="footer-logo">RAMSES BAZAAR</div>
      <div className="footer-addr">{settings.address} · Greece 24100</div>
      <div className="footer-links">
        <a href="https://www.instagram.com/ramsesbazaar" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="https://www.facebook.com/RamsesBazaar" target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href={`tel:+${settings.whatsapp}`}>📞 {settings.phone}</a>
      </div>
      <div className="footer-copy">© 2026 Ramses Bazaar · Designed with ✦</div>
      <a href="#admin" className="footer-admin-link">
        admin
      </a>
    </footer>
  );
};
