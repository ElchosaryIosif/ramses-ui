import { useEffect } from 'react';
import { useHashRoute } from './hooks/useHashRoute';
import { useAuth } from './store/useAuth';
import { useProducts } from './store/useProducts';
import { useSettings } from './store/useSettings';
import { StoreView } from './components/store/StoreView';
import { AdminView } from './components/admin/AdminView';
import { PasswordGate } from './components/admin/PasswordGate';
import { Toast } from './components/common/Toast';
import { Lightbox } from './components/common/Lightbox';
import { BackToTop } from './components/common/BackToTop';

export const App = () => {
  const [route, navigate] = useHashRoute();
  const authed = useAuth((s) => s.token !== null);
  const hydrateProducts = useProducts((s) => s.hydrate);
  const hydrateSettings = useSettings((s) => s.hydrate);

  useEffect(() => {
    void hydrateProducts();
    void hydrateSettings();
  }, [hydrateProducts, hydrateSettings]);

  return (
    <>
      {route === 'admin' ? (
        authed ? (
          <AdminView onBack={() => navigate('store')} />
        ) : (
          <PasswordGate onBack={() => navigate('store')} />
        )
      ) : (
        <StoreView />
      )}
      <Toast />
      <Lightbox />
      {route !== 'admin' && <BackToTop />}
    </>
  );
};
