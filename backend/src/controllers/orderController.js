const db = require('../db');
const { calculateTotals } = require('../utils/pricing');

let orderCounter = 123; // first order will be WS-2024-000124

const orderNumber = (n) => `WS-2024-${String(n).padStart(6, '0')}`;

/** POST /api/orders  (auth required) */
async function create(req, res, next) {
  try {
    const { items = [], couponCode, customer, shipping } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Your order must contain at least one item.' });
    if (!customer || !customer.name || !customer.email) return res.status(400).json({ message: 'Customer name and email are required.' });
    if (!shipping || !shipping.address || !shipping.city || !shipping.postcode) return res.status(400).json({ message: 'A complete shipping address is required.' });

    const resolved = [];
    for (const line of items) {
      const product = await db.getProduct(line.productId);
      if (!product) return res.status(400).json({ message: `Unknown product: ${line.productId}` });
      resolved.push({ productId: product.id, name: product.name, price: product.price, size: line.size || null, quantity: Math.max(1, Number(line.quantity) || 1) });
    }

    const totals = calculateTotals(resolved, couponCode);
    const order = await db.createOrder({
      orderNumber: orderNumber(++orderCounter),
      userId: req.user.id,
      products: resolved,
      customer,
      shipping,
      couponCode: couponCode && totals.discount > 0 ? couponCode : null,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping_cost: totals.shipping,
      total: totals.total,
      status: 'confirmed',
    });
    res.status(201).json({ order });
  } catch (e) { next(e); }
}

/** GET /api/orders  (auth required) */
async function listMine(req, res, next) {
  try {
    res.json({ orders: await db.listOrders(req.user.id) });
  } catch (e) { next(e); }
}

/** GET /api/orders/:id  (auth required) */
async function getOne(req, res, next) {
  try {
    const order = await db.getOrder(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.userId !== req.user.id) return res.status(403).json({ message: 'You do not have access to this order.' });
    res.json({ order });
  } catch (e) { next(e); }
}

module.exports = { create, listMine, getOne };
