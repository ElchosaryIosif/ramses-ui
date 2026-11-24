import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../store/useLang';
import { t } from '../../i18n/translations';

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.2!2d22.1134!3d37.0387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149fbd2b6b6b6b6b%3A0x0!2sStoa+Lontou%2C+Kalamata!5e0!3m2!1sel!2sgr!4v1';

/**
 * Google Maps costs ~400 KB of scripts, so it loads only when wanted: on a tap, or once the
 * visitor has scrolled and the map area is actually on screen. Until then a placeholder shows.
 */
export const MapEmbed = () => {
  const lang = useLang((s) => s.lang);
  const [load, setLoad] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (load || !el || !('IntersectionObserver' in window)) return;
    let visible = false;
    const check = () => {
      if (visible && window.scrollY > 0) setLoad(true);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        check();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    window.addEventListener('scroll', check, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', check);
    };
  }, [load]);

  return (
    <div className="visit-iframe-wrap" ref={ref}>
      {load ? (
        <iframe title="Map" src={MAP_SRC} referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <button type="button" className="map-placeholder" onClick={() => setLoad(true)}>
          <span className="map-placeholder-pin" aria-hidden="true">
            📍
          </span>
          <span>{t('show_map', lang)}</span>
        </button>
      )}
    </div>
  );
};
