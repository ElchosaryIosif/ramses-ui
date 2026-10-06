import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLang } from '../../store/useLang';
import { t } from '../../i18n/translations';

const REVIEWS = [
  {
    body: '"Ήρθα τυχαία περνώντας από τη Στοά Λόντου και έμεινα μία ώρα. Αγόρασα ένα κολιέ που φοράω κάθε μέρα από τότε."',
    author: '— Ελένη Κ., Αθήνα',
  },
  {
    body: '"The most unique shop in Kalamata. We visit every summer — always something new and special. The incense collection is incredible."',
    author: '— Sarah M., London',
  },
  {
    body: '"Αγόρασα ένα βραχιόλι για δώρο και η φίλη μου το λατρεύει. Ανυπομονώ να ξαναπάω — η ατμόσφαιρα του καταστήματος είναι μοναδική."',
    author: '— Μαρία Π., Καλαμάτα',
  },
];

export const Reviews = () => {
  const ref = useScrollReveal<HTMLElement>();
  const lang = useLang((s) => s.lang);
  return (
    <section ref={ref} className="reveal reviews-section">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <div className="divider" />
          <h2 className="section-title" style={{ marginTop: '0.75rem' }}>
            {t('reviews_title', lang)}
          </h2>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="review-stars">★★★★★</div>
              <p className="review-body">{r.body}</p>
              <div className="review-author">{r.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
