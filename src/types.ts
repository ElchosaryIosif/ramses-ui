export type Category = 'jewelry' | 'clothes' | 'home' | 'incense' | 'collectibles';

export type Tag = '' | 'new' | 'best' | 'sale';

export type Lang = 'gr' | 'en' | 'fr' | 'de' | 'es';

export interface Product {
  id: string;
  name: string;
  cat: Category;
  price: number;
  tag: Tag;
  desc: string;
  stock: boolean;
  image: string | null;
  createdAt: number;
  /** Product page address after /p/, computed by the API. */
  slug?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Settings {
  whatsapp: string;
  phone: string;
  address: string;
  iban?: string;
  bank?: string;
  accountName?: string;
  email?: string;
}
