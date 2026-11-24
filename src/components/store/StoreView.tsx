import { useEffect, useState } from 'react';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { AboutStrip } from './AboutStrip';
import { Shop } from './Shop';
import { About } from './About';
import { Visit } from './Visit';
import { Reviews } from './Reviews';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { OrderModal } from './OrderModal';
import { ProductPage } from './ProductPage';
import { HOME_META, setPageMeta } from '../../services/pageMeta';
import { useProducts } from '../../store/useProducts';
import type { Category } from '../../types';

interface Props {
  /** Set on a product page (`/p/<slug>`); otherwise the shop's home page. */
  productSlug?: string;
}

export const StoreView = ({ productSlug }: Props) => {
  const [pickedCat, setPickedCat] = useState<Category | undefined>();
  const home = productSlug === undefined;
  const hydrated = useProducts((s) => s.hydrated);

  useEffect(() => {
    if (home) setPageMeta(HOME_META);
  }, [home]);

  return (
    <div id="store-view">
      <Nav />
      <main id="main">
        {home ? (
          <>
            <Hero />
            <AboutStrip />
            <Shop initialFilter={pickedCat ?? 'all'} />
            <About onPickCategory={setPickedCat} />
            <Visit />
            <Reviews />
          </>
        ) : (
          <ProductPage slug={productSlug} />
        )}
      </main>
      {/* On a product page, related products appear once the catalogue loads; adding the footer
          only then keeps it from being pushed down while someone is looking at it. */}
      {(home || hydrated) && <Footer />}
      <CartDrawer />
      <OrderModal />
    </div>
  );
};
