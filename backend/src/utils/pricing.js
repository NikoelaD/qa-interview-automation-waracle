/**
 * Pricing logic, kept in one place so the cart, checkout and order endpoints
 * all calculate totals identically.
 */

const SHIPPING_FLAT = 5.0;

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate the discount for a given coupon against a subtotal.
 *
 * Supported coupon: "WARACLE25" (case-insensitive) — 25% off the subtotal.
 */
function calculateDiscount(couponCode, subtotal) {
  let discount = 0;

  if (String(couponCode || '').trim().toUpperCase() === 'WARACLE25') {
    // 25% off the subtotal.
    discount = 0.25;
  }

  // Never let a discount exceed the subtotal.
  if (discount > subtotal) discount = subtotal;

  return round2(discount);
}

/**
 * Given line items [{ price, quantity }] and an optional coupon, return the
 * full price breakdown.
 */
function calculateTotals(items, couponCode) {
  const subtotal = round2(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const discount = calculateDiscount(couponCode, subtotal);
  const shipping = subtotal > 0 ? SHIPPING_FLAT : 0;
  const total = round2(subtotal - discount + shipping);

  return { subtotal, discount, shipping, total };
}

module.exports = { calculateDiscount, calculateTotals, round2, SHIPPING_FLAT };
