import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useSettings } from '../../store/useSettings';
import { useLang } from '../../store/useLang';
import { POLICIES, t } from '../../i18n/translations';

export const Visit = () => {
  const ref = useScrollReveal<HTMLElement>();
  const settings = useSettings((s) => s.settings);
  const lang = useLang((s) => s.lang);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section ref={ref} className="reveal">
      <div className="visit-grid">
        <div>
          <p className="section-eyebrow">{t('how_to_find_us', lang)}</p>
          <div className="divider" style={{ margin: '0 0 1rem' }} />
          <div className="visit-iframe-wrap">
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.2!2d22.1134!3d37.0387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149fbd2b6b6b6b6b%3A0x0!2sStoa+Lontou%2C+Kalamata!5e0!3m2!1sel!2sgr!4v1"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="visit-info">
            <div className="visit-info-row">
              <span className="icon">📍</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Στοά+Λόντου+1,+Καλαμάτα+24100"
                target="_blank"
                rel="noreferrer"
              >
                {settings.address}
              </a>
            </div>
            <div className="visit-info-row">
              <span className="icon">✉️</span>
              <a href={`mailto:${settings.email || 'ramsesbazaargr@hotmail.com'}`}>
                {settings.email || 'ramsesbazaargr@hotmail.com'}
              </a>
            </div>
            <div className="visit-info-row">
              <span className="icon">📞</span>
              <a href={`tel:+${settings.whatsapp}`}>{settings.phone}</a>
            </div>
            <div style={{ marginTop: 4 }}>
              <div className="visit-info-row" style={{ marginBottom: 6 }}>
                <span className="icon">🕐</span>
                <span style={{ color: 'var(--sand2)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                  {t('hours_label', lang)}
                </span>
              </div>
              <div className="visit-hours" dangerouslySetInnerHTML={{ __html: t('hours', lang) }} />
            </div>
          </div>
        </div>
        <div>
          <p className="section-eyebrow">{t('policies', lang)}</p>
          <div className="divider" style={{ margin: '0 0 1rem' }} />
          <div className="policy-list">
            {POLICIES[lang].map((p, i) => {
              const open = openIdx === i;
              return (
                <div className="policy-item" key={i}>
                  <button
                    type="button"
                    className={`policy-toggle${open ? ' open' : ''}`}
                    onClick={() => setOpenIdx(open ? null : i)}
                  >
                    <span>{p.title}</span>
                    <span className="policy-arrow">▾</span>
                  </button>
                  {open && (
                    <div className="policy-body">
                      {p.body.map((line, j) => (
                        <p key={j} dangerouslySetInnerHTML={{ __html: line }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
