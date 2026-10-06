import { useLang } from '../../store/useLang';
import { t } from '../../i18n/translations';

export const Hero = () => {
  const lang = useLang((s) => s.lang);
  return (
    <section className="hero">
      <p className="hero-eyebrow">✦ Gift Store · Καλαμάτα · Μεσσηνία ✦</p>
      <h1 className="hero-title">
        RAMSES<span>BAZAAR</span>
      </h1>
      <p className="hero-subtitle">Boho · Ethnic · Hippie · από το 1996</p>
      <div className="hero-tags">
        <span className="hero-tag">Κοσμήματα</span>
        <span className="hero-tag">Ρούχα</span>
        <span className="hero-tag">Home Decor</span>
        <span className="hero-tag">Incense</span>
        <span className="hero-tag">Collectibles</span>
      </div>
      <a
        href="#shop"
        className="hero-cta"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        {t('cta_browse', lang)}
      </a>
      <p className="hero-location">📍 Στοά Λόντου · Καλαμάτα · Greece 24100</p>
    </section>
  );
};
