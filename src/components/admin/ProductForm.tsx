import { useEffect, useRef, useState } from 'react';
import type { Category, Product, Tag } from '../../types';
import { useProducts } from '../../store/useProducts';
import { useUI } from '../../store/useUI';
import { compressImage } from '../../services/image';
import { readJSON, writeJSON, STORAGE_KEYS } from '../../services/storage';
import { mediaUrl } from '../../services/api';

interface Props {
  /** null → new product; a product with an empty id → prefilled copy. */
  editing: Product | null;
  onDone: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

interface FormState {
  name: string;
  cat: Category | '';
  price: string;
  tag: Tag;
  desc: string;
  stock: boolean;
  image: string | null;
}

type Errors = Partial<Record<'name' | 'cat' | 'price', string>>;

const empty: FormState = {
  name: '',
  cat: '',
  price: '',
  tag: 'new',
  desc: '',
  stock: true,
  image: null,
};

const fromProduct = (p: Product): FormState => ({
  name: p.name,
  cat: p.cat,
  price: p.price ? p.price.toFixed(2).replace('.', ',') : '',
  tag: p.tag,
  desc: p.desc,
  stock: p.stock,
  image: p.image,
});

/** Accepts both "18,50" (Greek keyboards) and "18.50". */
const parsePrice = (raw: string): number => {
  const v = raw.trim().replace(/\s|€/g, '').replace(',', '.');
  return /^\d+(\.\d{1,2})?$/.test(v) ? Number(v) : NaN;
};

const validate = (f: FormState): Errors => {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Γράψε ένα όνομα';
  if (!f.cat) e.cat = 'Διάλεξε κατηγορία';
  if (!f.price.trim()) e.price = 'Βάλε τιμή';
  else if (Number.isNaN(parsePrice(f.price))) e.price = 'Η τιμή πρέπει να είναι αριθμός, π.χ. 18,50';
  return e;
};

const same = (a: FormState, b: FormState) => JSON.stringify(a) === JSON.stringify(b);

export const ProductForm = ({ editing, onDone, onDirtyChange }: Props) => {
  const upsert = useProducts((s) => s.upsert);
  const toast = useUI((s) => s.showToast);
  const isEdit = Boolean(editing?.id);

  const [initialDraft] = useState<FormState | null>(() => {
    if (editing) return null;
    const draft = readJSON<FormState | null>(STORAGE_KEYS.draft, null);
    return draft && !same({ ...empty, ...draft }, empty) ? { ...empty, ...draft } : null;
  });
  const [baseline, setBaseline] = useState<FormState>(() => (editing ? fromProduct(editing) : empty));
  const [form, setForm] = useState<FormState>(() => initialDraft ?? baseline);
  const [draftRestored, setDraftRestored] = useState(initialDraft !== null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState<false | 'photo' | 'save' | 'save-next'>(false);
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  const dirty = !same(form, baseline);
  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);

  // New products survive app switches / reloads as a local draft.
  useEffect(() => {
    if (isEdit || editing) return;
    const t = window.setTimeout(() => writeJSON(STORAGE_KEYS.draft, form), 400);
    return () => window.clearTimeout(t);
  }, [form, isEdit, editing]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast('Αυτό δεν είναι φωτογραφία', 'error');
    if (file.size > 25 * 1024 * 1024) return toast('Η φωτογραφία είναι πολύ μεγάλη (max 25MB)', 'error');
    setBusy('photo');
    try {
      set('image', await compressImage(file));
    } catch {
      toast('Δεν μπόρεσα να διαβάσω τη φωτογραφία — δοκίμασε άλλη', 'error');
    } finally {
      setBusy(false);
    }
  };

  const clearDraft = () => {
    writeJSON(STORAGE_KEYS.draft, null);
    setDraftRestored(false);
  };

  const save = async (next: boolean) => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setBusy(next ? 'save-next' : 'save');
    const savedOnline = await upsert({
      id: isEdit ? editing!.id : undefined,
      name: form.name.trim(),
      cat: form.cat as Category,
      price: parsePrice(form.price),
      tag: form.tag,
      desc: form.desc.trim(),
      stock: form.stock,
      image: form.image,
    });
    setBusy(false);
    if (!isEdit) clearDraft();

    if (savedOnline) toast(isEdit ? '✓ Οι αλλαγές αποθηκεύτηκαν' : `✓ «${form.name.trim()}» είναι online!`);
    else toast('Κρατήθηκε στη συσκευή — θα σταλεί μόλις υπάρξει σύνδεση', 'error');

    if (next) {
      const keep = { ...empty, cat: form.cat, tag: form.tag };
      setBaseline(keep);
      setForm(keep);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onDone();
  };

  return (
    <form
      className="product-form"
      onSubmit={(e) => {
        e.preventDefault();
        void save(false);
      }}
    >
      {draftRestored && (
        <div className="admin-banner info">
          <span>Συνεχίζεις από εκεί που είχες μείνει.</span>
          <button
            type="button"
            className="btn-banner subtle"
            onClick={() => {
              setForm(empty);
              clearDraft();
            }}
          >
            Καθαρισμός
          </button>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group full">
          <span className="form-label">Φωτογραφία</span>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
          <input ref={galleryRef} type="file" accept="image/*" hidden onChange={onFile} />
          {form.image ? (
            <div className="photo-preview">
              <img src={mediaUrl(form.image)} alt="Προεπισκόπηση" />
              <div className="photo-actions">
                <button type="button" className="btn-secondary" onClick={() => galleryRef.current?.click()}>
                  🔄 Αλλαγή
                </button>
                <button type="button" className="btn-secondary danger" onClick={() => set('image', null)}>
                  ✕ Αφαίρεση
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`photo-picker${busy === 'photo' ? ' busy' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file)
                  void onFile({
                    target: { files: [file], value: '' },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              {busy === 'photo' ? (
                <>
                  <span className="spinner" />
                  <span className="photo-hint">Ετοιμάζω τη φωτογραφία…</span>
                </>
              ) : (
                <>
                  <div className="photo-buttons">
                    <button type="button" className="photo-btn" onClick={() => cameraRef.current?.click()}>
                      <span className="photo-btn-icon">📷</span>
                      Τράβηξε φωτογραφία
                    </button>
                    <button type="button" className="photo-btn" onClick={() => galleryRef.current?.click()}>
                      <span className="photo-btn-icon">🖼</span>
                      Από τη συλλογή
                    </button>
                  </div>
                  <span className="photo-hint">Μικραίνει αυτόματα · ιδανικά τετράγωνη, σε φωτεινό φόντο</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="form-group full">
          <label className="form-label" htmlFor="pf-name">
            Όνομα *
          </label>
          <input
            id="pf-name"
            className={`form-input${errors.name ? ' invalid' : ''}`}
            placeholder="π.χ. Βραχιόλι Ethnic Stones"
            value={form.name}
            maxLength={160}
            onChange={(e) => set('name', e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="pf-cat">
            Κατηγορία *
          </label>
          <select
            id="pf-cat"
            className={`form-select${errors.cat ? ' invalid' : ''}`}
            value={form.cat}
            onChange={(e) => set('cat', e.target.value as Category | '')}
          >
            <option value="">Επιλογή…</option>
            <option value="jewelry">💎 Κοσμήματα</option>
            <option value="clothes">👗 Ρούχα</option>
            <option value="home">🏠 Home Decor</option>
            <option value="incense">🌿 Incense</option>
            <option value="collectibles">🗿 Collectibles</option>
          </select>
          {errors.cat && <span className="field-error">{errors.cat}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="pf-price">
            Τιμή *
          </label>
          <div className="input-affix">
            <input
              id="pf-price"
              type="text"
              inputMode="decimal"
              className={`form-input${errors.price ? ' invalid' : ''}`}
              placeholder="0,00"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
            />
            <span className="affix">€</span>
          </div>
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="form-group full">
          <span className="form-label">Ετικέτα</span>
          <div className="chip-row" role="radiogroup">
            {(
              [
                ['', 'Καμία'],
                ['new', '✦ Νέο'],
                ['best', '⭐ Bestseller'],
                ['sale', '🔥 Sale'],
              ] as [Tag, string][]
            ).map(([value, label]) => (
              <button
                key={value || 'none'}
                type="button"
                role="radio"
                aria-checked={form.tag === value}
                className={`chip${form.tag === value ? ' active' : ''}`}
                onClick={() => set('tag', value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group full">
          <span className="form-label">Διαθεσιμότητα</span>
          <label className="stock-toggle">
            <div
              role="switch"
              aria-checked={form.stock}
              tabIndex={0}
              className={`toggle-switch${form.stock ? ' on' : ''}`}
              onClick={() => set('stock', !form.stock)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  set('stock', !form.stock);
                }
              }}
            />
            <span>{form.stock ? 'Σε απόθεμα — φαίνεται στους πελάτες' : 'Εξαντλήθηκε'}</span>
          </label>
        </div>

        <div className="form-group full">
          <label className="form-label" htmlFor="pf-desc">
            Περιγραφή
          </label>
          <textarea
            id="pf-desc"
            className="form-textarea"
            placeholder="Υλικό, χρώμα, μέγεθος, από πού προέρχεται…"
            value={form.desc}
            maxLength={2000}
            onChange={(e) => set('desc', e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions sticky">
        <button type="submit" className="btn-primary" disabled={!!busy}>
          {busy === 'save' ? <span className="spinner dark" /> : '💾'} {isEdit ? 'Αποθήκευση αλλαγών' : 'Αποθήκευση'}
        </button>
        {!isEdit && (
          <button type="button" className="btn-secondary" disabled={!!busy} onClick={() => void save(true)}>
            {busy === 'save-next' ? <span className="spinner small" /> : '＋'} Αποθήκευση & επόμενο
          </button>
        )}
        {isEdit && (
          <button
            type="button"
            className="btn-secondary"
            disabled={!!busy}
            onClick={() => (!dirty || confirm('Να ακυρωθούν οι αλλαγές;')) && onDone()}
          >
            Ακύρωση
          </button>
        )}
      </div>
    </form>
  );
};
