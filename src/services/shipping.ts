export const SHIPPING_COST = 3.5;
export const FREE_SHIPPING_AT = 50.0;

export const getShippingCost = (subtotal: number): number => (subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_COST);
