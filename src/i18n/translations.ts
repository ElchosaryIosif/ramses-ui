import type { Category, Lang, Tag } from '../types';
import { FREE_SHIPPING_AT, SHIPPING_COST } from '../services/shipping';

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
    gr: 'Κοσμήματα χειροποίητα, υφάσματα ethnic από τη Μέση Ανατολή, την Αίγυπτο και το Μαρόκο, crystals, incense, boho ρούχα και σπάνια collectibles — κάθε αντικείμενο επιλεγμένο με γνώση και αγάπη.',
    en: 'Handmade jewellery, ethnic fabrics from the Middle East, Egypt and Morocco, crystals, incense, boho clothing and rare collectibles — every piece chosen with knowledge and love.',
    fr: "Bijoux artisanaux, tissus ethniques du Moyen-Orient, d'Égypte et du Maroc, cristaux, encens, vêtements boho et collectibles rares — chaque pièce choisie avec soin et passion.",
    de: 'Handgemachter Schmuck, ethnische Stoffe aus dem Nahen Osten, Ägypten und Marokko, Kristalle, Räucherstäbchen, Boho-Kleidung und seltene Sammlerstücke — jedes Stück mit Kenntnis und Liebe ausgewählt.',
    es: 'Joyería artesanal, telas étnicas de Oriente Medio, Egipto y Marruecos, cristales, incienso, ropa boho y coleccionables raros — cada pieza elegida con conocimiento y amor.',
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
  // Category names without icon (product cards, hero tags)
  cat_jewelry: { gr: 'Κοσμήματα', en: 'Jewellery', fr: 'Bijoux', de: 'Schmuck', es: 'Joyería' },
  cat_clothes: { gr: 'Ρούχα', en: 'Clothes', fr: 'Vêtements', de: 'Kleidung', es: 'Ropa' },
  cat_home: { gr: 'Home Decor', en: 'Home Decor', fr: 'Décoration', de: 'Wohndeko', es: 'Decoración' },
  cat_incense: { gr: 'Incense', en: 'Incense', fr: 'Encens', de: 'Räucherwerk', es: 'Incienso' },
  cat_collectibles: {
    gr: 'Collectibles',
    en: 'Collectibles',
    fr: 'Collectibles',
    de: 'Sammlerstücke',
    es: 'Coleccionables',
  },
  tag_new: { gr: 'Νέο', en: 'New', fr: 'Nouveau', de: 'Neu', es: 'Nuevo' },
  tag_best: { gr: 'Bestseller', en: 'Bestseller', fr: 'Best-seller', de: 'Bestseller', es: 'Más vendido' },
  tag_sale: { gr: 'Sale', en: 'Sale', fr: 'Promo', de: 'Sale', es: 'Oferta' },

  nav_city: { gr: 'ΚΑΛΑΜΆΤΑ', en: 'KALAMATA', fr: 'KALAMATA', de: 'KALAMATA', es: 'KALAMATA' },

  // Hero / about strip
  hero_eyebrow: {
    gr: '✦ Gift Store · Καλαμάτα · Μεσσηνία ✦',
    en: '✦ Gift Store · Kalamata · Messinia ✦',
    fr: '✦ Boutique de cadeaux · Kalamata · Messénie ✦',
    de: '✦ Geschenkladen · Kalamata · Messinien ✦',
    es: '✦ Tienda de regalos · Kalamata · Mesenia ✦',
  },
  hero_since: { gr: 'από το 1996', en: 'since 1996', fr: 'depuis 1996', de: 'seit 1996', es: 'desde 1996' },
  hero_location: {
    gr: '📍 Στοά Λόντου · Καλαμάτα · Greece 24100',
    en: '📍 Stoa Lontou · Kalamata · Greece 24100',
    fr: '📍 Stoa Lontou · Kalamata · Grèce 24100',
    de: '📍 Stoa Lontou · Kalamata · Griechenland 24100',
    es: '📍 Stoa Lontou · Kalamata · Grecia 24100',
  },
  strip_quote: {
    gr: '"Από το 1996 φέρνουμε αντικείμενα με ψυχή από όλο τον κόσμο στην Καλαμάτα — ethnic, boho, hippie και πάντα κάτι μοναδικό."',
    en: '"Since 1996 we have been bringing soulful objects from all over the world to Kalamata — ethnic, boho, hippie and always something unique."',
    fr: '"Depuis 1996, nous apportons à Kalamata des objets pleins d\'âme du monde entier — ethnique, bohème, hippie et toujours quelque chose d\'unique."',
    de: '"Seit 1996 bringen wir Gegenstände mit Seele aus aller Welt nach Kalamata — ethnisch, boho, hippie und immer etwas Einzigartiges."',
    es: '"Desde 1996 traemos a Kalamata objetos con alma de todo el mundo — étnicos, boho, hippies y siempre algo único."',
  },
  strip_since: {
    gr: '✦ Χειροποίητα · Ethnic · Μοναδικά ✦',
    en: '✦ Handmade · Ethnic · Unique ✦',
    fr: '✦ Artisanal · Ethnique · Unique ✦',
    de: '✦ Handgemacht · Ethnisch · Einzigartig ✦',
    es: '✦ Artesanal · Étnico · Único ✦',
  },

  // Shop
  shop_empty_title: {
    gr: 'Η συλλογή ετοιμάζεται…',
    en: 'The collection is on its way…',
    fr: 'La collection arrive bientôt…',
    de: 'Die Kollektion ist in Vorbereitung…',
    es: 'La colección está en camino…',
  },
  shop_empty_body: {
    gr: 'Σύντομα θα βρείτε εδώ μοναδικά<br>boho & ethnic αντικείμενα από όλο τον κόσμο.',
    en: 'Soon you will find unique<br>boho & ethnic pieces from all over the world here.',
    fr: 'Bientôt, vous trouverez ici des pièces uniques<br>bohèmes et ethniques du monde entier.',
    de: 'Bald finden Sie hier einzigartige<br>Boho- & Ethno-Stücke aus aller Welt.',
    es: 'Pronto encontrarás aquí piezas únicas<br>boho y étnicas de todo el mundo.',
  },
  shop_none_title: {
    gr: 'Δεν βρέθηκαν προϊόντα',
    en: 'No products found',
    fr: 'Aucun produit trouvé',
    de: 'Keine Produkte gefunden',
    es: 'No se encontraron productos',
  },
  shop_none_body: {
    gr: 'Δοκίμασε άλλη κατηγορία.',
    en: 'Try another category.',
    fr: 'Essayez une autre catégorie.',
    de: 'Versuchen Sie eine andere Kategorie.',
    es: 'Prueba otra categoría.',
  },

  // Product card
  add_to_cart: { gr: '+ Καλάθι', en: '+ Add to cart', fr: '+ Panier', de: '+ Warenkorb', es: '+ Carrito' },
  added: { gr: '✓ Προστέθηκε', en: '✓ Added', fr: '✓ Ajouté', de: '✓ Hinzugefügt', es: '✓ Añadido' },
  sold_out: { gr: 'Εξαντλήθηκε', en: 'Sold out', fr: 'Épuisé', de: 'Ausverkauft', es: 'Agotado' },
  out_of_stock: {
    gr: 'Εκτός αποθέματος',
    en: 'Out of stock',
    fr: 'Rupture de stock',
    de: 'Nicht vorrätig',
    es: 'Sin existencias',
  },

  // Cart drawer
  cart_title: { gr: 'ΤΟ ΚΑΛΑΘΙ ΣΑΣ', en: 'YOUR CART', fr: 'VOTRE PANIER', de: 'IHR WARENKORB', es: 'TU CARRITO' },
  cart_empty: {
    gr: 'Το καλάθι σας είναι άδειο.<br>Ανακαλύψτε κάτι μοναδικό ✦',
    en: 'Your cart is empty.<br>Discover something unique ✦',
    fr: "Votre panier est vide.<br>Découvrez quelque chose d'unique ✦",
    de: 'Ihr Warenkorb ist leer.<br>Entdecken Sie etwas Einzigartiges ✦',
    es: 'Tu carrito está vacío.<br>Descubre algo único ✦',
  },
  cart_remove: { gr: 'Αφαίρεση', en: 'Remove', fr: 'Retirer', de: 'Entfernen', es: 'Quitar' },
  free_progress: {
    gr: 'Προσθέστε <strong>{amount}</strong> για δωρεάν αποστολή',
    en: 'Add <strong>{amount}</strong> more for free shipping',
    fr: 'Ajoutez <strong>{amount}</strong> pour la livraison gratuite',
    de: 'Noch <strong>{amount}</strong> bis zum kostenlosen Versand',
    es: 'Añade <strong>{amount}</strong> más para envío gratis',
  },
  free: { gr: 'ΔΩΡΕΑΝ 🎉', en: 'FREE 🎉', fr: 'GRATUIT 🎉', de: 'KOSTENLOS 🎉', es: 'GRATIS 🎉' },
  place_order: {
    gr: '✦ Αποστολή Παραγγελίας',
    en: '✦ Place Order',
    fr: '✦ Passer la commande',
    de: '✦ Bestellung aufgeben',
    es: '✦ Realizar pedido',
  },

  // Order modal
  order_title: {
    gr: 'ΟΛΟΚΛΗΡΩΣΗ ΠΑΡΑΓΓΕΛΙΑΣ',
    en: 'COMPLETE YOUR ORDER',
    fr: 'FINALISER LA COMMANDE',
    de: 'BESTELLUNG ABSCHLIESSEN',
    es: 'COMPLETAR PEDIDO',
  },
  f_name: {
    gr: 'Ονοματεπώνυμο *',
    en: 'Full name *',
    fr: 'Nom complet *',
    de: 'Vollständiger Name *',
    es: 'Nombre completo *',
  },
  f_name_ph: {
    gr: 'Γιώργος Παπαδόπουλος',
    en: 'John Smith',
    fr: 'Marie Dupont',
    de: 'Max Mustermann',
    es: 'María García',
  },
  f_phone: { gr: 'Τηλέφωνο *', en: 'Phone *', fr: 'Téléphone *', de: 'Telefon *', es: 'Teléfono *' },
  f_address: {
    gr: 'Διεύθυνση αποστολής *',
    en: 'Shipping address *',
    fr: 'Adresse de livraison *',
    de: 'Lieferadresse *',
    es: 'Dirección de envío *',
  },
  f_address_ph: {
    gr: 'Οδός Αρ., Πόλη, ΤΚ',
    en: 'Street No., City, Postcode',
    fr: 'N° et rue, Ville, Code postal',
    de: 'Straße Nr., Stadt, PLZ',
    es: 'Calle Nº, Ciudad, CP',
  },
  f_notes: {
    gr: 'Σχόλια / Παρατηρήσεις',
    en: 'Comments / Notes',
    fr: 'Commentaires / Remarques',
    de: 'Kommentare / Anmerkungen',
    es: 'Comentarios / Notas',
  },
  f_notes_ph: {
    gr: 'Ειδικές οδηγίες, χρώμα, μέγεθος…',
    en: 'Special instructions, colour, size…',
    fr: 'Instructions particulières, couleur, taille…',
    de: 'Besondere Hinweise, Farbe, Größe…',
    es: 'Instrucciones especiales, color, talla…',
  },
  err_required: {
    gr: '⚠ Συμπλήρωσε όλα τα υποχρεωτικά πεδία.',
    en: '⚠ Please fill in all required fields.',
    fr: '⚠ Veuillez remplir tous les champs obligatoires.',
    de: '⚠ Bitte füllen Sie alle Pflichtfelder aus.',
    es: '⚠ Completa todos los campos obligatorios.',
  },
  err_email: {
    gr: '⚠ Βάλε έγκυρο email.',
    en: '⚠ Please enter a valid email.',
    fr: '⚠ Veuillez saisir un e-mail valide.',
    de: '⚠ Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    es: '⚠ Introduce un email válido.',
  },
  err_unavailable: {
    gr: '⚠ Κάποιο προϊόν του καλαθιού δεν είναι πλέον διαθέσιμο. Αφαίρεσέ το και δοκίμασε ξανά.',
    en: '⚠ An item in your cart is no longer available. Remove it and try again.',
    fr: "⚠ Un article de votre panier n'est plus disponible. Retirez-le et réessayez.",
    de: '⚠ Ein Artikel in Ihrem Warenkorb ist nicht mehr verfügbar. Entfernen Sie ihn und versuchen Sie es erneut.',
    es: '⚠ Un producto de tu carrito ya no está disponible. Quítalo e inténtalo de nuevo.',
  },
  err_offline: {
    gr: '⚠ Δεν υπάρχει σύνδεση. Έλεγξε το internet και ξαναδοκίμασε.',
    en: '⚠ No connection. Check your internet and try again.',
    fr: '⚠ Pas de connexion. Vérifiez votre connexion internet et réessayez.',
    de: '⚠ Keine Verbindung. Prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
    es: '⚠ Sin conexión. Comprueba tu internet e inténtalo de nuevo.',
  },
  err_failed: {
    gr: '⚠ Η παραγγελία δεν στάλθηκε. Δοκίμασε ξανά ή επικοινώνησε μαζί μας τηλεφωνικά.',
    en: '⚠ The order was not sent. Try again or contact us by phone.',
    fr: "⚠ La commande n'a pas été envoyée. Réessayez ou contactez-nous par téléphone.",
    de: '⚠ Die Bestellung wurde nicht gesendet. Versuchen Sie es erneut oder rufen Sie uns an.',
    es: '⚠ El pedido no se envió. Inténtalo de nuevo o llámanos por teléfono.',
  },
  sending: { gr: 'Αποστολή…', en: 'Sending…', fr: 'Envoi…', de: 'Wird gesendet…', es: 'Enviando…' },
  submit_order: {
    gr: 'Αποστολή Παραγγελίας →',
    en: 'Place Order →',
    fr: 'Passer la commande →',
    de: 'Bestellung aufgeben →',
    es: 'Realizar pedido →',
  },
  order_sent: {
    gr: 'Η ΠΑΡΑΓΓΕΛΙΑ ΣΤΑΛΘΗΚΕ!',
    en: 'ORDER SENT!',
    fr: 'COMMANDE ENVOYÉE !',
    de: 'BESTELLUNG GESENDET!',
    es: '¡PEDIDO ENVIADO!',
  },
  order_sent_body: {
    gr: 'Λάβαμε την παραγγελία σας και θα επικοινωνήσουμε σύντομα για επιβεβαίωση.',
    en: 'We have received your order and will contact you shortly to confirm it.',
    fr: 'Nous avons bien reçu votre commande et vous contacterons bientôt pour la confirmer.',
    de: 'Wir haben Ihre Bestellung erhalten und melden uns in Kürze zur Bestätigung.',
    es: 'Hemos recibido tu pedido y te contactaremos pronto para confirmarlo.',
  },
  bank_transfer: {
    gr: 'ΤΡΑΠΕΖΙΚΗ ΜΕΤΑΦΟΡΑ',
    en: 'BANK TRANSFER',
    fr: 'VIREMENT BANCAIRE',
    de: 'BANKÜBERWEISUNG',
    es: 'TRANSFERENCIA BANCARIA',
  },
  bank: { gr: 'Τράπεζα', en: 'Bank', fr: 'Banque', de: 'Bank', es: 'Banco' },
  bank_contact: {
    gr: 'Επικοινωνήστε μαζί μας',
    en: 'Contact us',
    fr: 'Contactez-nous',
    de: 'Kontaktieren Sie uns',
    es: 'Contáctanos',
  },
  beneficiary: { gr: 'Δικαιούχος', en: 'Beneficiary', fr: 'Bénéficiaire', de: 'Empfänger', es: 'Beneficiario' },
  amount: { gr: 'Ποσό', en: 'Amount', fr: 'Montant', de: 'Betrag', es: 'Importe' },
  incl_shipping: {
    gr: ' (συμπ. {amount} αποστολή)',
    en: ' (incl. {amount} shipping)',
    fr: ' (dont {amount} de livraison)',
    de: ' (inkl. {amount} Versand)',
    es: ' (incl. {amount} de envío)',
  },
  free_shipping_paren: {
    gr: ' (δωρεάν αποστολή 🎉)',
    en: ' (free shipping 🎉)',
    fr: ' (livraison gratuite 🎉)',
    de: ' (kostenloser Versand 🎉)',
    es: ' (envío gratis 🎉)',
  },
  details: { gr: 'Αναλυτικά:', en: 'Details:', fr: 'Détails :', de: 'Details:', es: 'Detalle:' },
  send_receipt_to: {
    gr: 'Στείλτε αντίγραφο μεταφοράς στο',
    en: 'Send proof of transfer to',
    fr: 'Envoyez la preuve de virement à',
    de: 'Senden Sie den Überweisungsbeleg an',
    es: 'Envía el comprobante de transferencia a',
  },
  send_receipt_after: {
    gr: 'μετά την πληρωμή για άμεση επεξεργασία.',
    en: 'after payment for prompt processing.',
    fr: 'après le paiement pour un traitement rapide.',
    de: 'nach der Zahlung für eine schnelle Bearbeitung.',
    es: 'después del pago para un procesamiento rápido.',
  },
  close: { gr: '← Κλείσιμο', en: '← Close', fr: '← Fermer', de: '← Schließen', es: '← Cerrar' },
});

export type Key = keyof typeof T;

export const t = (key: Key, lang: Lang): string => T[key][lang] ?? T[key].en ?? T[key].gr;

/** t() with `{name}` placeholders filled from `vars`. */
export const tf = (key: Key, lang: Lang, vars: Record<string, string>): string =>
  t(key, lang).replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);

export const catName = (c: Category, lang: Lang): string => t(`cat_${c}`, lang);

export const tagName = (tag: Tag, lang: Lang): string => (tag ? t(`tag_${tag}`, lang) : '');

const eur = (n: number) => `€${n.toFixed(2)}`;

export interface Policy {
  title: string;
  body: string[];
}

export const POLICIES: Record<Lang, Policy[]> = {
  gr: [
    {
      title: '🚚 Αποστολή & Παράδοση',
      body: [
        'Αποστέλλουμε με <strong>ACS Courier</strong> σε όλη την Ελλάδα.',
        `• Κόστος αποστολής: <strong>${eur(SHIPPING_COST)}</strong>`,
        `• <strong>Δωρεάν αποστολή</strong> για παραγγελίες άνω των ${eur(FREE_SHIPPING_AT)}`,
        '• Παράδοση: <strong>2–4 εργάσιμες ημέρες</strong>',
        '• Η παραγγελία επεξεργάζεται μετά την επιβεβαίωση πληρωμής',
      ],
    },
    {
      title: '↩ Επιστροφές & Αλλαγές',
      body: [
        'Σύμφωνα με την ευρωπαϊκή νομοθεσία, έχετε δικαίωμα επιστροφής εντός <strong>14 ημερολογιακών ημερών</strong> από την παραλαβή.',
        '• Τα προϊόντα πρέπει να είναι αχρησιμοποίητα και στην αρχική τους συσκευασία',
        '• Τα έξοδα επιστροφής βαρύνουν τον αγοραστή',
        '• Επικοινωνήστε μαζί μας πριν οποιαδήποτε επιστροφή',
      ],
    },
    {
      title: '💳 Πληρωμή',
      body: [
        'Αποδεχόμαστε αποκλειστικά <strong>τραπεζική μεταφορά</strong> (κατάθεση).',
        'Μετά την ολοκλήρωση της παραγγελίας θα λάβετε τα τραπεζικά στοιχεία.',
        '• Παρακαλούμε στείλτε αντίγραφο κατάθεσης για άμεση εξυπηρέτηση',
      ],
    },
  ],
  en: [
    {
      title: '🚚 Shipping & Delivery',
      body: [
        'We ship with <strong>ACS Courier</strong> throughout Greece.',
        `• Shipping cost: <strong>${eur(SHIPPING_COST)}</strong>`,
        `• <strong>Free shipping</strong> on orders over ${eur(FREE_SHIPPING_AT)}`,
        '• Delivery: <strong>2–4 business days</strong>',
        '• Orders are processed once payment is confirmed',
      ],
    },
    {
      title: '↩ Returns & Exchanges',
      body: [
        'Under EU law, you may return items within <strong>14 calendar days</strong> of receipt.',
        '• Items must be unused and in their original packaging',
        '• Return shipping costs are paid by the buyer',
        '• Please contact us before sending any return',
      ],
    },
    {
      title: '💳 Payment',
      body: [
        'We accept <strong>bank transfer</strong> (deposit) only.',
        'You will receive our bank details once your order is complete.',
        '• Please send proof of payment for faster service',
      ],
    },
  ],
  fr: [
    {
      title: '🚚 Livraison',
      body: [
        'Nous expédions avec <strong>ACS Courier</strong> dans toute la Grèce.',
        `• Frais de livraison : <strong>${eur(SHIPPING_COST)}</strong>`,
        `• <strong>Livraison gratuite</strong> dès ${eur(FREE_SHIPPING_AT)} d'achat`,
        '• Délai : <strong>2 à 4 jours ouvrés</strong>',
        '• La commande est traitée après confirmation du paiement',
      ],
    },
    {
      title: '↩ Retours & Échanges',
      body: [
        'Conformément à la législation européenne, vous disposez de <strong>14 jours calendaires</strong> à compter de la réception pour retourner un article.',
        "• Les articles doivent être inutilisés et dans leur emballage d'origine",
        "• Les frais de retour sont à la charge de l'acheteur",
        '• Contactez-nous avant tout retour',
      ],
    },
    {
      title: '💳 Paiement',
      body: [
        'Nous acceptons uniquement le <strong>virement bancaire</strong> (dépôt).',
        'Vous recevrez nos coordonnées bancaires une fois la commande validée.',
        '• Merci de nous envoyer une preuve de paiement pour un traitement rapide',
      ],
    },
  ],
  de: [
    {
      title: '🚚 Versand & Lieferung',
      body: [
        'Wir versenden mit <strong>ACS Courier</strong> in ganz Griechenland.',
        `• Versandkosten: <strong>${eur(SHIPPING_COST)}</strong>`,
        `• <strong>Kostenloser Versand</strong> ab ${eur(FREE_SHIPPING_AT)} Bestellwert`,
        '• Lieferzeit: <strong>2–4 Werktage</strong>',
        '• Die Bestellung wird nach Zahlungseingang bearbeitet',
      ],
    },
    {
      title: '↩ Rückgabe & Umtausch',
      body: [
        'Gemäß EU-Recht haben Sie ein Rückgaberecht von <strong>14 Kalendertagen</strong> ab Erhalt.',
        '• Die Artikel müssen unbenutzt und in der Originalverpackung sein',
        '• Die Rücksendekosten trägt der Käufer',
        '• Bitte kontaktieren Sie uns vor jeder Rücksendung',
      ],
    },
    {
      title: '💳 Zahlung',
      body: [
        'Wir akzeptieren ausschließlich <strong>Banküberweisung</strong> (Einzahlung).',
        'Nach Abschluss der Bestellung erhalten Sie unsere Bankdaten.',
        '• Bitte senden Sie uns einen Zahlungsbeleg für eine schnelle Bearbeitung',
      ],
    },
  ],
  es: [
    {
      title: '🚚 Envío y Entrega',
      body: [
        'Enviamos con <strong>ACS Courier</strong> a toda Grecia.',
        `• Coste de envío: <strong>${eur(SHIPPING_COST)}</strong>`,
        `• <strong>Envío gratis</strong> en pedidos superiores a ${eur(FREE_SHIPPING_AT)}`,
        '• Entrega: <strong>2–4 días laborables</strong>',
        '• El pedido se procesa tras confirmar el pago',
      ],
    },
    {
      title: '↩ Devoluciones y Cambios',
      body: [
        'Según la legislación europea, tienes derecho a devolver el producto en un plazo de <strong>14 días naturales</strong> desde la recepción.',
        '• Los productos deben estar sin usar y en su embalaje original',
        '• Los gastos de devolución corren a cargo del comprador',
        '• Contáctanos antes de realizar cualquier devolución',
      ],
    },
    {
      title: '💳 Pago',
      body: [
        'Aceptamos únicamente <strong>transferencia bancaria</strong> (depósito).',
        'Recibirás nuestros datos bancarios al completar el pedido.',
        '• Envíanos el comprobante de pago para una gestión más rápida',
      ],
    },
  ],
};
