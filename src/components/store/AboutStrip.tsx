import { useLang } from '../../store/useLang';
import { t } from '../../i18n/translations';

export const AboutStrip = () => {
  const lang = useLang((s) => s.lang);
  return (
    <div className="about-strip">
      <div className="divider" />
      <blockquote>{t('strip_quote', lang)}</blockquote>
      <p className="about-since">{t('strip_since', lang)}</p>
    </div>
  );
};
