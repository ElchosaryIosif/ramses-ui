import { Suspense, lazy, useEffect } from 'react';
import { navigate, useRoute } from './services/router';
import { useAuth } from './store/useAuth';
import { useProducts } from './store/useProducts';
import { useSettings } from './store/useSettings';
import { StoreView } from './components/store/StoreView';
import { Toast } from './components/common/Toast';
import { Lightbox } from './components/common/Lightbox';
import { BackToTop } from './components/common/BackToTop';
import { ConsentBanner } from './components/common/ConsentBanner';

// Shoppers never need the admin panel's code, so it is downloaded only when #admin is opened.
const AdminView = lazy(() => import('./components/admin/AdminView').then((m) => ({ default: m.AdminView })));
const PasswordGate = lazy(() => import('./components/admin/PasswordGate').then((m) => ({ default: m.PasswordGate })));

const leaveAdmin = () => navigate('/');

export const App = () => {
  const route = useRoute();
  const authed = useAuth((s) => s.token !== null);
  const hydrateProducts = useProducts((s) => s.hydrate);
  const hydrateSettings = useSettings((s) => s.hydrate);

  useEffect(() => {
    void hydrateProducts();
    void hydrateSettings();
  }, [hydrateProducts, hydrateSettings]);

  const admin = route.name === 'admin';
  return (
    <>
      {admin ? (
        <Suspense fallback={<div className="admin-loading" aria-busy="true" />}>
          {authed ? <AdminView onBack={leaveAdmin} /> : <PasswordGate onBack={leaveAdmin} />}
        </Suspense>
      ) : (
        <StoreView productSlug={route.name === 'product' ? route.slug : undefined} />
      )}
      <Toast />
      <Lightbox />
      {!admin && <BackToTop />}
      {!admin && <ConsentBanner />}
    </>
  );
};
