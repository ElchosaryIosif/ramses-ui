import { useEffect, useRef, useState } from 'react';
import { useCart, cartTotals } from '../../store/useCart';
import { useUI } from '../../store/useUI';
import { useLang } from '../../store/useLang';
import { LANG_META, t } from '../../i18n/translations';
import type { Lang } from '../../types';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'gr', label: 'Ελληνικά' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
];

export const Nav = () => {
  const items = useCart((s) => s.items);
  const openCart = useUI((s) => s.openCart);
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { count } = cartTotals(items);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const meta = LANG_META[lang];

  return (
    <nav id="store-nav">
      <a
        className="nav-logo"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <img src="/logo.jpg" alt="Ramses Bazaar" />
        <span className="nav-logo-text">
          RAMSES BAZAAR
          <small>{t('nav_city', lang)} · EST. 1996</small>
        </span>
      </a>
      <div className="nav-actions">
        <div className="lang-wrap" ref={wrapRef}>
          <button type="button" className="btn-lang" onClick={() => setMenuOpen((v) => !v)} title="Switch language">
            <span>{meta.flag}</span> <span>{meta.label}</span> ▾
          </button>
          {menuOpen && (
            <div className="lang-menu">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`lang-opt${lang === l.code ? ' active' : ''}`}
                  onClick={() => {
                    setLang(l.code);
                    setMenuOpen(false);
                  }}
                >
                  {LANG_META[l.code].flag} {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="btn-cart" onClick={openCart}>
          🛒 <span>{count}</span>
        </button>
      </div>
    </nav>
  );
};
