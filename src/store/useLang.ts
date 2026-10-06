import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Lang } from '../types';

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLang = create<LangState>()(
  persist(
    (set) => ({
      lang: 'gr',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'rb_lang_v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
