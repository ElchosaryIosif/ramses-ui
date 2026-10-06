import type { Category, Lang, Tag } from '../types';

export const LANG_META: Record<Lang, { flag: string; label: string }> = {
  gr: { flag: '🇬🇷', label: 'ΕΛ' },
  en: { flag: '🇬🇧', label: 'EN' },
  fr: { flag: '🇫🇷', label: 'FR' },
  de: { flag: '🇩🇪', label: 'DE' },
  es: { flag: '🇪🇸', label: 'ES' },
};

export const CAT_LABELS: Record<Category, string> = {
  jewelry: 'Κοσμήματα',
  clothes: 'Ρούχα',
  home: 'Home Decor',
  incense: 'Incense',
  collectibles: 'Collectibles',
};

export const CAT_ICONS: Record<Category, string> = {
  jewelry: '💎',
  clothes: '👗',
  home: '🏠',
  incense: '🌿',
  collectibles: '🗿',
};

export const tagLabel = (t: Tag): string =>
  t === 'new' ? 'Νέο' : t === 'best' ? 'Bestseller' : t === 'sale' ? 'Sale' : '';

type Dict = Record<Lang, string>;

const dict = <T extends Record<string, Dict>>(d: T) => d;

export const T = dict({
  cta_browse: {
    gr: 'ΕΞΕΡΕΥΝΗΣΕ ΤΗ ΣΥΛΛΟΓΗ',
    en: 'BROWSE THE COLLECTION',
    fr: 'DÉCOUVRIR LA COLLECTION',
    de: 'KOLLEKTION ENTDECKEN',
    es: 'EXPLORAR LA COLECCIÓN',
  },
  collection: {
    gr: 'ΣΥΛΛΟΓΗ',
    en: 'COLLECTION',
    fr: 'COLLECTION',
    de: 'KOLLEKTION',
    es: 'COLECCIÓN',
  },
  collection_sub: {
    gr: 'Κάθε αντικείμενο έχει τη δική του ιστορία',
    en: 'Every piece has its own story',
    fr: 'Chaque pièce a sa propre histoire',
    de: 'Jedes Stück hat seine eigene Geschichte',
    es: 'Cada pieza tiene su propia historia',
  },
  all: { gr: 'Όλα', en: 'All', fr: 'Tout', de: 'Alles', es: 'Todo' },
  jewelry: { gr: '💎 Κοσμήματα', en: '💎 Jewellery', fr: '💎 Bijoux', de: '💎 Schmuck', es: '💎 Joyería' },
  clothes: { gr: '👗 Ρούχα', en: '👗 Clothes', fr: '👗 Vêtements', de: '👗 Kleidung', es: '👗 Ropa' },
  home: { gr: '🏠 Home Decor', en: '🏠 Home Decor', fr: '🏠 Décoration', de: '🏠 Wohndeko', es: '🏠 Decoración' },
  incense: { gr: '🌿 Incense', en: '🌿 Incense', fr: '🌿 Encens', de: '🌿 Räucherwerk', es: '🌿 Incienso' },
  collectibles: {
    gr: '🗿 Collectibles',
    en: '🗿 Collectibles',
    fr: '🗿 Collectibles',
    de: '🗿 Sammlerstücke',
    es: '🗿 Coleccionables',
  },
  our_story: {
    gr: 'Η ΙΣΤΟΡΙΑ ΜΑΣ',
    en: 'OUR STORY',
    fr: 'NOTRE HISTOIRE',
    de: 'UNSERE GESCHICHTE',
    es: 'NUESTRA HISTORIA',
  },
  since_heading: {
    gr: 'Από το 1996<br>στην καρδιά<br>της Καλαμάτας',
    en: 'Since 1996<br>in the heart<br>of Kalamata',
    fr: 'Depuis 1996<br>au cœur<br>de Kalamata',
    de: 'Seit 1996<br>im Herzen<br>von Kalamata',
    es: 'Desde 1996<br>en el corazón<br>de Kalamata',
  },
  about_lede: {
    gr: 'Το Ramses Bazaar ξεκίνησε με μια απλή ιδέα: να φέρνει αντικείμενα με ψυχή από όλο τον κόσμο στη Μεσσηνία.',
    en: 'Ramses Bazaar started with a simple idea: to bring soulful objects from around the world to Messinia.',
    fr: "Ramses Bazaar est né d'une idée simple : apporter des objets authentiques du monde entier en Messénie.",
    de: 'Ramses Bazaar begann mit einer einfachen Idee: Gegenstände mit Seele aus aller Welt nach Messinien zu bringen.',
    es: 'Ramses Bazaar nació con una idea simple: traer objetos con alma de todo el mundo a Mesenia.',
  },
  about_body: {
    gr: 'Κοσμήματα χειροποίητα, υφάσματα ethnic από Ινδία και Μαρόκο, crystals, incense, boho ρούχα και σπάνια collectibles — κάθε αντικείμενο επιλεγμένο με γνώση και αγάπη.',
    en: 'Handmade jewellery, ethnic fabrics from India and Morocco, crystals, incense, boho clothing and rare collectibles — every piece chosen with knowledge and love.',
    fr: "Bijoux artisanaux, tissus ethniques d'Inde et du Maroc, cristaux, encens, vêtements boho et collectibles rares — chaque pièce choisie avec soin et passion.",
    de: 'Handgemachter Schmuck, ethnische Stoffe aus Indien und Marokko, Kristalle, Räucherstäbchen, Boho-Kleidung und seltene Sammlerstücke — jedes Stück mit Kenntnis und Liebe ausgewählt.',
    es: 'Joyería artesanal, telas étnicas de India y Marruecos, cristales, incienso, ropa boho y coleccionables raros — cada pieza elegida con conocimiento y amor.',
  },
  years: { gr: 'Χρόνια', en: 'Years', fr: 'Années', de: 'Jahre', es: 'Años' },
  categories: { gr: 'Κατηγορίες', en: 'Categories', fr: 'Catégories', de: 'Kategorien', es: 'Categorías' },
  unique_pieces: {
    gr: 'Μοναδικά κομμάτια',
    en: 'Unique pieces',
    fr: 'Pièces uniques',
    de: 'Einzigartige Stücke',
    es: 'Piezas únicas',
  },
  how_to_find_us: {
    gr: 'ΠΩΣ ΝΑ ΜΑΣ ΒΡΕΙΤΕ',
    en: 'HOW TO FIND US',
    fr: 'COMMENT NOUS TROUVER',
    de: 'WIE SIE UNS FINDEN',
    es: 'CÓMO ENCONTRARNOS',
  },
  hours_label: {
    gr: 'Ωράριο Λειτουργίας',
    en: 'Opening Hours',
    fr: "Heures d'ouverture",
    de: 'Öffnungszeiten',
    es: 'Horario de apertura',
  },
  hours: {
    gr: 'Δευ / Τετ / Σαβ: 08:30–14:00<br>Τρί / Πεμ / Παρ: 08:30–14:00 & 18:00–21:00<br>Κυριακή: Κλειστά',
    en: 'Mon / Wed / Sat: 08:30–14:00<br>Tue / Thu / Fri: 08:30–14:00 & 18:00–21:00<br>Sunday: Closed',
    fr: 'Lun / Mer / Sam : 08h30–14h00<br>Mar / Jeu / Ven : 08h30–14h00 & 18h00–21h00<br>Dimanche : Fermé',
    de: 'Mo / Mi / Sa: 08:30–14:00<br>Di / Do / Fr: 08:30–14:00 & 18:00–21:00<br>Sonntag: Geschlossen',
    es: 'Lun / Mié / Sáb: 08:30–14:00<br>Mar / Jue / Vie: 08:30–14:00 & 18:00–21:00<br>Domingo: Cerrado',
  },
  policies: { gr: 'ΠΟΛΙΤΙΚΕΣ', en: 'POLICIES', fr: 'POLITIQUES', de: 'RICHTLINIEN', es: 'POLÍTICAS' },
  reviews_title: {
    gr: 'Τι λένε οι πελάτες μας',
    en: 'What our customers say',
    fr: 'Ce que disent nos clients',
    de: 'Was unsere Kunden sagen',
    es: 'Lo que dicen nuestros clientes',
  },
  cart_note: {
    gr: 'Αποστολή σε όλη την Ελλάδα · Πληρωμή με τραπεζική μεταφορά ✦',
    en: 'Shipping throughout Greece · Payment by bank transfer ✦',
    fr: 'Livraison dans toute la Grèce · Paiement par virement bancaire ✦',
    de: 'Lieferung in ganz Griechenland · Zahlung per Banküberweisung ✦',
    es: 'Envío a toda Grecia · Pago por transferencia bancaria ✦',
  },
  shipping_label: { gr: 'Αποστολή', en: 'Shipping', fr: 'Livraison', de: 'Versand', es: 'Envío' },
  total_label: { gr: 'Σύνολο', en: 'Total', fr: 'Total', de: 'Summe', es: 'Total' },
  free_unlocked: {
    gr: '<strong>Κερδίσατε δωρεάν αποστολή! 🎉</strong>',
    en: '<strong>Free shipping unlocked! 🎉</strong>',
    fr: '<strong>Livraison gratuite débloquée ! 🎉</strong>',
    de: '<strong>Kostenloser Versand freigeschaltet! 🎉</strong>',
    es: '<strong>¡Envío gratis desbloqueado! 🎉</strong>',
  },
});

export type Key = keyof typeof T;

export const t = (key: Key, lang: Lang): string => T[key][lang] ?? T[key].en ?? T[key].gr;
