import { useEffect } from 'react';

/** Fades product cards in as they scroll into view (they start hidden: `.product-card.reveal`). */
export const useRevealCards = (deps: unknown[]) => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.product-card.reveal:not(.visible)').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
