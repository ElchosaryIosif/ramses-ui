import { useEffect, useState } from 'react';

export type Route = 'store' | 'admin';

const fromHash = (hash: string): Route => (hash === '#admin' ? 'admin' : 'store');

export const useHashRoute = (): [Route, (next: Route) => void] => {
  const [route, setRoute] = useState<Route>(() => fromHash(window.location.hash));

  useEffect(() => {
    const handler = () => setRoute(fromHash(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (next: Route): void => {
    window.location.hash = next === 'admin' ? '#admin' : '';
  };

  return [route, navigate];
};
