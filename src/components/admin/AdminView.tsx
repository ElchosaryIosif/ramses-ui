import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../store/useAuth';
import { useProducts } from '../../store/useProducts';
import type { Product } from '../../types';
import { AdminProductList } from './AdminProductList';
import { ProductForm } from './ProductForm';
import { SettingsPanel } from './SettingsPanel';
import { SyncStatus } from './SyncStatus';
import { InstallHint } from './InstallHint';
import { OrdersPanel } from './OrdersPanel';

type Tab = 'products' | 'add' | 'orders' | 'settings';

interface Props {
  onBack: () => void;
}

const RETRY_MS = 20_000;

export const AdminView = ({ onBack }: Props) => {
  const logout = useAuth((s) => s.logout);
  const refresh = useAuth((s) => s.refresh);
  const status = useAuth((s) => s.status);
  const flush = useProducts((s) => s.flush);
  const sync = useProducts((s) => s.sync);
  const pending = useProducts((s) => s.outbox.length);
  const [tab, setTab] = useState<Tab>('products');
  const [editing, setEditing] = useState<Product | null>(null);
  const [formDirty, setFormDirty] = useState(false);

  // Session status + send anything left over from a previous visit.
  useEffect(() => {
    void refresh();
    if (useProducts.getState().outbox.length) void flush();
  }, [refresh, flush]);

  // Quietly retry unsent changes when the connection comes back.
  useEffect(() => {
    if (!pending || sync === 'saving') return;
    const retry = () => void flush();
    window.addEventListener('online', retry);
    const t = window.setInterval(retry, RETRY_MS);
    return () => {
      window.removeEventListener('online', retry);
      window.clearInterval(t);
    };
  }, [pending, sync, flush]);

  // Warn before closing the tab with unsent or unsaved work.
  useEffect(() => {
    if (!pending && !formDirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [pending, formDirty]);

  const go = useCallback(
    (next: Tab, nextEditing: Product | null = null) => {
      if (formDirty && tab === 'add' && !confirm('Έχεις αλλαγές που δεν αποθηκεύτηκαν. Να φύγω χωρίς αποθήκευση;')) {
        return;
      }
      setFormDirty(false);
      setEditing(nextEditing);
      setTab(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [formDirty, tab]
  );

  const leave = (action: () => void) => {
    if (pending && !confirm('Κάποιες αλλαγές δεν έχουν σταλεί ακόμα. Να φύγω;')) return;
    if (formDirty && !confirm('Έχεις αλλαγές που δεν αποθηκεύτηκαν. Να φύγω χωρίς αποθήκευση;')) return;
    action();
  };

  return (
    <div id="admin-view">
      <nav className="admin-nav">
        <div className="admin-nav-title">
          ADMIN PANEL
          <small>RAMSES BAZAAR</small>
        </div>
        <div className="admin-nav-actions">
          <SyncStatus />
          <button
            type="button"
            className="btn-secondary btn-icon"
            onClick={() => leave(onBack)}
            title="Πίσω στο κατάστημα"
          >
            <span aria-hidden>🏪</span>
            <span className="btn-label">Κατάστημα</span>
          </button>
          <button
            type="button"
            className="btn-secondary btn-icon"
            onClick={() =>
              leave(() => {
                logout();
                onBack();
              })
            }
            title="Αποσύνδεση"
          >
            <span aria-hidden>🚪</span>
            <span className="btn-label">Έξοδος</span>
          </button>
        </div>
      </nav>

      <div className="admin-body">
        {status && !status.secure && (
          <div className="admin-banner warn">
            <strong>Η ασφάλεια δεν έχει ολοκληρωθεί.</strong> Λείπει το SESSION_SECRET από τον server, οπότε θα
            αποσυνδέεσαι σε κάθε ενημέρωση. Δες το docs/deploy.md.
          </div>
        )}
        {status?.defaultPassword && (
          <div className="admin-banner warn">
            <span>
              <strong>Άλλαξε τον κωδικό σου.</strong> Χρησιμοποιείς ακόμα τον αρχικό κωδικό, που είναι γνωστός.
            </span>
            {tab !== 'settings' && (
              <button type="button" className="btn-banner" onClick={() => go('settings')}>
                Αλλαγή κωδικού →
              </button>
            )}
          </div>
        )}
        <PendingBanner />
        <InstallHint />

        <div className="admin-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'products'}
            className={`admin-tab${tab === 'products' ? ' active' : ''}`}
            onClick={() => go('products')}
          >
            📦 Προϊόντα
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'add'}
            className={`admin-tab${tab === 'add' ? ' active' : ''}`}
            onClick={() => go('add')}
          >
            {editing ? '✏️ Επεξεργασία' : '➕ Νέο Προϊόν'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'orders'}
            className={`admin-tab${tab === 'orders' ? ' active' : ''}`}
            onClick={() => go('orders')}
          >
            🧾 Παραγγελίες
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'settings'}
            className={`admin-tab${tab === 'settings' ? ' active' : ''}`}
            onClick={() => go('settings')}
          >
            ⚙️ Ρυθμίσεις
          </button>
        </div>

        {tab === 'products' && (
          <AdminProductList
            onEdit={(p) => go('add', p)}
            onDuplicate={(p) => go('add', { ...p, id: '', name: `${p.name} (αντίγραφο)` })}
            onAdd={() => go('add')}
          />
        )}
        {tab === 'add' && (
          <ProductForm
            key={editing?.id || editing?.name || 'new'}
            editing={editing}
            onDirtyChange={setFormDirty}
            onDone={() => {
              setFormDirty(false);
              setEditing(null);
              setTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {tab === 'orders' && <OrdersPanel />}
        {tab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
};

const PendingBanner = () => {
  const pending = useProducts((s) => s.outbox.length);
  const sync = useProducts((s) => s.sync);
  const error = useProducts((s) => s.syncError);
  const flush = useProducts((s) => s.flush);
  const discard = useProducts((s) => s.discardPending);
  if (!pending || sync !== 'error') return null;

  const changes = pending === 1 ? '1 αλλαγή' : `${pending} αλλαγές`;
  const text =
    error === 'invalid'
      ? `Μια αλλαγή δεν έγινε δεκτή από τον server (${changes} σε αναμονή).`
      : error === 'too_large'
        ? 'Η φωτογραφία είναι πολύ μεγάλη για αποστολή. Ακύρωσε και δοκίμασε μικρότερη.'
        : `Δεν υπάρχει σύνδεση. Κρατήσαμε ${changes} σε αυτή τη συσκευή — θα σταλούν αυτόματα.`;

  return (
    <div className="admin-banner error" role="alert">
      <span>{text}</span>
      <span className="banner-actions">
        {error !== 'too_large' && (
          <button type="button" className="btn-banner" onClick={() => void flush()}>
            Δοκίμασε τώρα
          </button>
        )}
        {(error === 'invalid' || error === 'too_large') && (
          <button
            type="button"
            className="btn-banner subtle"
            onClick={() => confirm('Να ακυρωθούν οι αλλαγές που δεν στάλθηκαν;') && discard()}
          >
            Ακύρωση αλλαγών
          </button>
        )}
      </span>
    </div>
  );
};
