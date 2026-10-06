import { useState } from 'react';
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
import type { Category } from '../../types';

export const StoreView = () => {
  const [pickedCat, setPickedCat] = useState<Category | undefined>();
  return (
    <div id="store-view">
      <Nav />
      <Hero />
      <AboutStrip />
      <Shop initialFilter={pickedCat ?? 'all'} />
      <About onPickCategory={setPickedCat} />
      <Visit />
      <Reviews />
      <Footer />
      <CartDrawer />
      <OrderModal />
    </div>
  );
};
