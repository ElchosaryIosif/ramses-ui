import { useLang } from '../../store/useLang';
import { catName, t } from '../../i18n/translations';
import type { Category } from '../../types';

const HERO_CATS: Category[] = ['jewelry', 'clothes', 'home', 'incense', 'collectibles'];

export const Hero = () => {
  const lang = useLang((s) => s.lang);
  return (
    <section className="hero">
      <p className="hero-eyebrow">{t('hero_eyebrow', lang)}</p>
      <h1 className="hero-title">
        RAMSES<span>BAZAAR</span>
      </h1>
      <p className="hero-subtitle">Boho · Ethnic · Hippie · {t('hero_since', lang)}</p>
      <div className="hero-tags">
        {HERO_CATS.map((c) => (
          <span key={c} className="hero-tag">
            {catName(c, lang)}
          </span>
        ))}
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
      <p className="hero-location">{t('hero_location', lang)}</p>
    </section>
  );
};
