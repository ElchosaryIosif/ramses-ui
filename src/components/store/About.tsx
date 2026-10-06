import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLang } from '../../store/useLang';
import { t } from '../../i18n/translations';
import type { Category } from '../../types';

interface Props {
  onPickCategory: (cat: Category) => void;
}

const CARDS: { cat: Category; icon: string; tKey: Category }[] = [
  { cat: 'jewelry', icon: '💎', tKey: 'jewelry' },
  { cat: 'clothes', icon: '👗', tKey: 'clothes' },
  { cat: 'incense', icon: '🌿', tKey: 'incense' },
  { cat: 'home', icon: '🏠', tKey: 'home' },
];

export const About = ({ onPickCategory }: Props) => {
  const ref = useScrollReveal<HTMLElement>();
  const lang = useLang((s) => s.lang);

  return (
    <section
      ref={ref}
      className="reveal"
      style={{
        background: 'var(--dark3)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="about-grid">
        <div>
          <p className="section-eyebrow">{t('our_story', lang)}</p>
          <div className="divider" style={{ margin: '0 0 1.25rem' }} />
          <h2 dangerouslySetInnerHTML={{ __html: t('since_heading', lang) }} />
          <p className="about-lede">{t('about_lede', lang)}</p>
          <p className="about-body">{t('about_body', lang)}</p>
          <div className="about-stats">
            <div>
              <div className="about-stat-num">28</div>
              <div className="about-stat-label">{t('years', lang)}</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div className="about-stat-num">5</div>
              <div className="about-stat-label">{t('categories', lang)}</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div className="about-stat-num">∞</div>
              <div className="about-stat-label">{t('unique_pieces', lang)}</div>
            </div>
          </div>
        </div>
        <div className="cat-cards">
          {CARDS.map((c) => (
            <button
              key={c.cat}
              type="button"
              className="cat-card"
              onClick={() => {
                onPickCategory(c.cat);
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="cat-card-icon">{c.icon}</span>
              <span className="cat-card-label">{t(c.tKey, lang).replace(/^\S+\s/, '')}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
