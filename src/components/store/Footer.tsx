import { useSettings } from '../../store/useSettings';

export const Footer = () => {
  const settings = useSettings((s) => s.settings);
  return (
    <footer className="site-footer">
      <img className="footer-logo-img" src="/logo.jpg" alt="Ramses Bazaar" />
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
      </div>
      <div className="footer-copy">© 2026 Ramses Bazaar</div>
    </footer>
  );
};
