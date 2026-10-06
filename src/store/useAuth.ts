import { create } from 'zustand';
import { STORAGE_KEYS } from '../services/storage';
import { api, type AdminStatus, type SessionGrant } from '../services/api';

interface StoredSession {
  token: string;
  exp: number;
}

export type LoginResult = 'ok' | 'wrong' | 'network';

interface AuthState {
  token: string | null;
  status: AdminStatus | null;
  /** Set when a session ended on its own (expiry / password changed elsewhere). */
  expired: boolean;
  login: (password: string, remember: boolean) => Promise<LoginResult>;
  adopt: (grant: SessionGrant, remember: boolean) => void;
  refresh: () => Promise<void>;
  logout: () => void;
  expire: () => void;
}

const stores = (): Storage[] => {
  try {
    return [localStorage, sessionStorage];
  } catch {
    return [];
  }
};

const loadSession = (): StoredSession | null => {
  for (const store of stores()) {
    try {
      const raw = store.getItem(STORAGE_KEYS.session);
      if (!raw) continue;
      const s = JSON.parse(raw) as StoredSession;
      if (s.token && s.exp > Date.now()) return s;
      store.removeItem(STORAGE_KEYS.session);
    } catch {
      /* ignore */
    }
  }
  return null;
};

const clearSession = () => {
  for (const store of stores()) {
    try {
      store.removeItem(STORAGE_KEYS.session);
      store.removeItem('rb_auth'); // pre-server flag
    } catch {
      /* ignore */
    }
  }
};

const saveSession = (s: StoredSession, remember: boolean) => {
  clearSession();
  try {
    (remember ? localStorage : sessionStorage).setItem(STORAGE_KEYS.session, JSON.stringify(s));
  } catch {
    /* private mode: session lives in memory only */
  }
};

export const useAuth = create<AuthState>((set, get) => ({
  token: loadSession()?.token ?? null,
  status: null,
  expired: false,

  login: async (password, remember) => {
    const res = await api.login(password, remember);
    if (res.ok) {
      get().adopt(res.data, remember);
      return 'ok';
    }
    return res.status === 401 ? 'wrong' : 'network';
  },

  adopt: ({ token, exp, status }, remember) => {
    saveSession({ token, exp }, remember);
    set({ token, status, expired: false });
  },

  refresh: async () => {
    const { token } = get();
    if (!token) return;
    const res = await api.session(token);
    if (res.ok) set({ status: res.data.status });
    else if (res.status === 401) get().expire();
  },

  logout: () => {
    clearSession();
    set({ token: null, status: null, expired: false });
  },

  expire: () => {
    clearSession();
    set({ token: null, status: null, expired: true });
  },
}));
