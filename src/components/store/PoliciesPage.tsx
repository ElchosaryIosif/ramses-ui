import { useEffect } from 'react';
import { useLang } from '../../store/useLang';
import { useSettings } from '../../store/useSettings';
import { POLICIES, t } from '../../i18n/translations';
import { linkClick } from '../../services/router';
import { setPageMeta } from '../../services/pageMeta';

/**
 * /policies: shipping, returns and payment on one page, plus how to reach the shop. Google
 * Merchant Center links to it as the shop's return policy.
 */
export const PoliciesPage = () => {
  const lang = useLang((s) => s.lang);
  const settings = useSettings((s) => s.settings);

  useEffect(() => {
    setPageMeta({
      title: `${t('policies_title', lang)} | Ramses Bazaar`,
      description: t('policies_meta', lang),
      path: '/policies',
    });
  }, [lang]);

  return (
    <section className="product-page policies-page">
      <nav className="breadcrumb" aria-label={t('breadcrumb', lang)}>
        <a href="/" onClick={linkClick('/')}>
          {t('breadcrumb_home', lang)}
        </a>
        <span aria-hidden="true">›</span>
        <span>{t('policies_title', lang)}</span>
      </nav>
      <h1 className="product-detail-name">{t('policies_title', lang)}</h1>
      {POLICIES[lang].map((p) => (
        <article className="policy-section" key={p.title}>
          <h2 className="policy-section-title">{p.title}</h2>
          {p.body.map((line, j) => (
            <p key={j} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </article>
      ))}
      <article className="policy-section">
        <h2 className="policy-section-title">✉️ {t('contact_title', lang)}</h2>
        <p>Ramses Bazaar · {settings.address} · Greece</p>
        <p>
          <a href={`mailto:${settings.email || 'ramsesbazaargr@hotmail.com'}`}>
            {settings.email || 'ramsesbazaargr@hotmail.com'}
          </a>
          {settings.phone && (
            <>
              {' · '}
              <a href={`tel:+${settings.whatsapp}`}>{settings.phone}</a>
            </>
          )}
        </p>
      </article>
      <a className="product-back" href="/" onClick={linkClick('/')}>
        ← {t('back_to_shop', lang)}
      </a>
    </section>
  );
};
