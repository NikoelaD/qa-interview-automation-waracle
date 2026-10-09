const db = require('../db');

function applyFilters(items, q) {
  const { category, gender, minPrice, maxPrice, search, sort } = q;
  if (category && category !== 'All') items = items.filter((p) => p.category === category);
  if (gender && gender !== 'All') items = items.filter((p) => p.gender === gender);
  if (minPrice !== undefined) items = items.filter((p) => p.price >= Number(minPrice));
  if (maxPrice !== undefined) items = items.filter((p) => p.price <= Number(maxPrice));
  if (search) {
    const s = String(search).toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  switch (sort) {
    case 'price_asc': items.sort((a, b) => a.price - b.price); break;
    case 'price_desc': items.sort((a, b) => b.price - a.price); break;
    default: items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return items;
}

/** GET /api/products */
async function list(req, res, next) {
  try {
    let items = applyFilters(await db.listProducts(), req.query);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || items.length || 1);
    const start = (page - 1) * limit;
    res.json({ total: items.length, page, limit, products: items.slice(start, start + limit) });
  } catch (e) { next(e); }
}

/** GET /api/products/:id */
async function getOne(req, res, next) {
  try {
    const product = await db.getProduct(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  } catch (e) { next(e); }
}

/** GET /api/products/:id/suggestions */
async function suggestions(req, res, next) {
  try {
    const product = await db.getProduct(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    const all = await db.listProducts();
    const score = (p) => (p.category === product.category ? 2 : 0) + (p.gender === product.gender ? 1 : 0);
    const related = all.filter((p) => p.id !== product.id).sort((a, b) => score(b) - score(a)).slice(0, 4);
    res.json({ products: related });
  } catch (e) { next(e); }
}

const UPDATABLE_FIELDS = ['name', 'description', 'category', 'gender', 'image', 'price', 'sizes', 'stock'];

/** PUT /api/products/:id  (auth required) */
async function update(req, res, next) {
  try {
    const product = await db.getProduct(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    const body = req.body || {};
    const updates = {};
    for (const field of UPDATABLE_FIELDS) {
      if (body[field] === undefined) continue;
      if (field === 'price') {
        const price = Number(body.price);
        if (Number.isNaN(price) || price < 0) return res.status(400).json({ message: 'price must be a non-negative number.' });
        updates.price = Math.round(price * 100) / 100;
      } else if (field === 'stock') {
        const stock = Number(body.stock);
        if (!Number.isInteger(stock) || stock < 0) return res.status(400).json({ message: 'stock must be a non-negative integer.' });
        updates.stock = stock;
      } else if (field === 'sizes') {
        if (!Array.isArray(body.sizes)) return res.status(400).json({ message: 'sizes must be an array of strings.' });
        updates.sizes = body.sizes.map(String);
      } else if (field === 'gender') {
        if (!['Men', 'Women', 'Unisex'].includes(body.gender)) return res.status(400).json({ message: 'gender must be Men, Women or Unisex.' });
        updates.gender = body.gender;
      } else {
        if (typeof body[field] !== 'string' || body[field].trim() === '') return res.status(400).json({ message: `${field} must be a non-empty string.` });
        updates[field] = body[field];
      }
    }
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: 'No updatable fields supplied.' });
    const updated = await db.updateProduct(req.params.id, updates);
    res.json({ product: updated });
  } catch (e) { next(e); }
}

module.exports = { list, getOne, suggestions, update };
