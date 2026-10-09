const db = require('../db');
const { calculateTotals } = require('../utils/pricing');

async function resolveLines(lines, res) {
  const resolved = [];
  for (const line of lines) {
    const product = await db.getProduct(line.productId);
    if (!product) { res.status(400).json({ message: `Unknown product: ${line.productId}` }); return null; }
    const quantity = Math.max(1, Number(line.quantity) || 1);
    resolved.push({ productId: product.id, name: product.name, price: product.price, size: line.size, quantity, lineTotal: Math.round(product.price * quantity * 100) / 100 });
  }
  return resolved;
}

/** POST /api/cart/summary */
async function summary(req, res, next) {
  try {
    const { items = [], couponCode } = req.body || {};
    if (!Array.isArray(items)) return res.status(400).json({ message: 'items must be an array.' });
    const resolved = await resolveLines(items, res);
    if (!resolved) return;
    const totals = calculateTotals(resolved, couponCode);
    const couponApplied = !!couponCode && totals.discount > 0;
    res.json({ items: resolved, couponCode: couponApplied ? couponCode : null, couponApplied, ...totals });
  } catch (e) { next(e); }
}

/** DELETE /api/cart/items/:productId */
async function removeItem(req, res, next) {
  try {
    const { productId } = req.params;
    const { items = [], couponCode, size } = req.body || {};
    if (!Array.isArray(items)) return res.status(400).json({ message: 'items must be an array.' });
    const remaining = items.filter((line) => {
      if (line.productId !== productId) return true;
      if (size !== undefined) return line.size !== size;
      return false;
    });
    if (remaining.length === items.length) return res.status(404).json({ message: 'Item not found in cart.' });
    const resolved = await resolveLines(remaining, res);
    if (!resolved) return;
    const totals = calculateTotals(resolved, couponCode);
    const couponApplied = !!couponCode && totals.discount > 0;
    res.json({ items: resolved, removed: productId, couponCode: couponApplied ? couponCode : null, couponApplied, ...totals });
  } catch (e) { next(e); }
}

module.exports = { summary, removeItem };
