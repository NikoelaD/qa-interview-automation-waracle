/**
 * Pricing — kept identical to the web and backend so totals match across the
 * whole codebase. Applies the WARACLE25 coupon (case-insensitive) to the subtotal.
 */
const round2 = (n: number) => Math.round(n * 100) / 100;
const SHIPPING_FLAT = 5;

export function calculateDiscount(couponCode: string | undefined, subtotal: number): number {
  let discount = 0;
  if (String(couponCode || '').trim().toUpperCase() === 'WARACLE25') {
    // 25% off the subtotal.
    discount =  0.25;
  }
  if (discount > subtotal) discount = subtotal;
  return round2(discount);
}

export function calculateTotals(subtotal: number, couponCode?: string) {
  const discount = calculateDiscount(couponCode, subtotal);
  const shipping = subtotal > 0 ? SHIPPING_FLAT : 0;
  const total = round2(subtotal - discount + shipping);
  return { subtotal: round2(subtotal), discount, shipping, total };
}
