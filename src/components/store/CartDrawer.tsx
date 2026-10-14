import { useCart, cartTotals } from '../../store/useCart';
import { useUI } from '../../store/useUI';
import { useSettings } from '../../store/useSettings';
import { useLang } from '../../store/useLang';
import { CAT_ICONS, t, tf } from '../../i18n/translations';
import { FREE_SHIPPING_AT } from '../../services/shipping';
import { mediaUrl } from '../../services/api';

export const CartDrawer = () => {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const changeQty = useCart((s) => s.changeQty);
  const open = useUI((s) => s.cartOpen);
  const closeCart = useUI((s) => s.closeCart);
  const openOrder = useUI((s) => s.openOrder);
  const settings = useSettings((s) => s.settings);
  const lang = useLang((s) => s.lang);

  const { subtotal, shipping, total } = cartTotals(items);

  const shippingMsg =
    subtotal >= FREE_SHIPPING_AT
      ? t('free_unlocked', lang)
      : tf('free_progress', lang, { amount: `€${(FREE_SHIPPING_AT - subtotal).toFixed(2)}` });

  const fillPct = subtotal >= FREE_SHIPPING_AT ? 100 : Math.round((subtotal / FREE_SHIPPING_AT) * 100);

  return (
    <>
      <div className={`cart-overlay${open ? ' open' : ''}`} onClick={closeCart} />
      <div className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">{t('cart_title', lang)}</span>
          <button type="button" className="btn-close" onClick={closeCart} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="cart-items-list">
          {items.length === 0 ? (
            <div className="cart-empty-msg" dangerouslySetInnerHTML={{ __html: t('cart_empty', lang) }} />
          ) : (
            items.map((c) => (
              <div className="cart-item" key={c.id}>
                <div className="cart-item-thumb">
                  {c.image ? <img src={mediaUrl(c.image)} alt={c.name} /> : CAT_ICONS[c.cat]}
                </div>
                <div className="cart-item-info">
                  <div className="ci-name">{c.name}</div>
                  <div className="ci-price">
                    €{c.price.toFixed(2)} × {c.qty} = €{(c.price * c.qty).toFixed(2)}
                  </div>
                  <div className="ci-qty">
                    <button type="button" className="qty-btn" onClick={() => changeQty(c.id, -1)}>
                      −
                    </button>
                    <span className="qty-num">{c.qty}</span>
                    <button type="button" className="qty-btn" onClick={() => changeQty(c.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => remove(c.id)}
                  title={t('cart_remove', lang)}
                  aria-label={t('cart_remove', lang)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="shipping-bar-wrap">
              <div className="shipping-bar-msg" dangerouslySetInnerHTML={{ __html: shippingMsg }} />
              <div className="shipping-bar-track">
                <div className="shipping-bar-fill" style={{ width: `${fillPct}%` }} />
              </div>
            </div>
            <div className="shipping-row">
              <span className="shipping-label">{t('shipping_label', lang)}</span>
              <span className="shipping-val">{shipping === 0 ? t('free', lang) : `€${shipping.toFixed(2)}`}</span>
            </div>
            <div className="cart-total-row">
              <span className="ct-label">{t('total_label', lang)}</span>
              <span className="ct-val">€{total.toFixed(2)}</span>
            </div>
            <button type="button" className="btn-order" onClick={openOrder}>
              {t('place_order', lang)}
            </button>
            <a href={`tel:+${settings.whatsapp}`} className="btn-phone">
              📞 <span>{settings.phone}</span>
            </a>
            <p className="cart-note">{t('cart_note', lang)}</p>
          </div>
        )}
      </div>
    </>
  );
};
