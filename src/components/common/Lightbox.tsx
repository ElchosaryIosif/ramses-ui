import { useEffect } from 'react';
import { useUI } from '../../store/useUI';
import { useProducts } from '../../store/useProducts';
import { mediaUrl } from '../../services/api';

export const Lightbox = () => {
  const lightboxId = useUI((s) => s.lightboxId);
  const close = useUI((s) => s.closeLightbox);
  const product = useProducts((s) => s.products.find((p) => p.id === lightboxId));

  useEffect(() => {
    if (!lightboxId) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxId, close]);

  if (!lightboxId || !product?.image) return null;
  return (
    <div className="lightbox" onClick={close}>
      <button type="button" className="lightbox-close" onClick={close} aria-label="Close">
        ✕
      </button>
      <img src={mediaUrl(product.image)} alt={product.name} />
    </div>
  );
};
