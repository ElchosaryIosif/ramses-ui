import { create } from 'zustand';
import type { Settings } from '../types';
import { readJSON, writeJSON, STORAGE_KEYS } from '../services/storage';
import { api } from '../services/api';
import { useAuth } from './useAuth';

const DEFAULT_SETTINGS: Settings = {
  whatsapp: '302721096103',
  phone: '27210 96103',
  address: 'Στοά Λόντου 1, Καλαμάτα 24100',
};

interface SettingsState {
  settings: Settings;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  save: (next: Partial<Settings>) => Promise<boolean>;
}

const merge = (base: Settings, patch: Partial<Settings>): Settings => {
  const next = { ...base, ...patch };
  // Older builds cached the admin password here; never keep it client-side.
  delete (next as { password?: string }).password;
  return next;
};

export const useSettings = create<SettingsState>((set, get) => ({
  settings: merge(DEFAULT_SETTINGS, readJSON<Partial<Settings>>(STORAGE_KEYS.settings, {})),
  hydrated: false,
  hydrate: async () => {
    const res = await api.settings();
    if (res.ok) {
      const next = merge(get().settings, res.data);
      writeJSON(STORAGE_KEYS.settings, next);
      set({ settings: next });
    } else {
      writeJSON(STORAGE_KEYS.settings, get().settings);
    }
    set({ hydrated: true });
  },
  save: async (patch) => {
    const token = useAuth.getState().token;
    if (!token) return false;
    const res = await api.saveSettings(token, patch);
    if (!res.ok) {
      if (res.status === 401) useAuth.getState().expire();
      return false;
    }
    const next = merge(get().settings, res.data);
    writeJSON(STORAGE_KEYS.settings, next);
    set({ settings: next });
    return true;
  },
}));
