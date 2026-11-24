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
import { PoliciesPage } from './PoliciesPage';
import { HOME_META, setPageMeta } from '../../services/pageMeta';
import { useProducts } from '../../store/useProducts';
import type { Category } from '../../types';

interface Props {
  /** The home page, a product page (`/p/<slug>`) or shipping and returns (`/policies`). */
  page: 'home' | 'policies' | { product: string };
}

export const StoreView = ({ page }: Props) => {
  const [pickedCat, setPickedCat] = useState<Category | undefined>();
  const home = page === 'home';
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
        ) : page === 'policies' ? (
          <PoliciesPage />
        ) : (
          <ProductPage slug={page.product} />
        )}
      </main>
      {/* On a product page, related products appear once the catalogue loads; adding the footer
          only then keeps it from being pushed down while someone is looking at it. */}
      {(page === 'home' || page === 'policies' || hydrated) && <Footer />}
      <CartDrawer />
      <OrderModal />
    </div>
  );
};
