/**
 * Phase 2 — MySQL data layer.
 *
 * A real MySQL-backed implementation using a mysql2 connection pool. Tables:
 * users, products, orders (see schema.sql). Used when DB_DRIVER=mysql.
 *
 * JSON-shaped columns (sizes, products, customer, shipping) are stored as JSON
 * and parsed back into JS objects here so the rest of the app is driver-
 * agnostic.
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const config = require('../../config');
const { products: seedProducts, demoUser } = require('./seedData');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }
  return pool;
}

function rowToProduct(r) {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    gender: r.gender,
    image: r.image,
    price: Number(r.price),
    sizes: typeof r.sizes === 'string' ? JSON.parse(r.sizes) : r.sizes,
    stock: r.stock,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

function rowToOrder(r) {
  const parse = (v) => (typeof v === 'string' ? JSON.parse(v) : v);
  return {
    id: r.id,
    orderNumber: r.order_number,
    userId: r.user_id,
    products: parse(r.products),
    customer: parse(r.customer),
    shipping: parse(r.shipping),
    couponCode: r.coupon_code,
    subtotal: Number(r.subtotal),
    discount: Number(r.discount),
    shipping_cost: Number(r.shipping_cost),
    total: Number(r.total),
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

function rowToUser(r) {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    password: r.password,
    role: r.role,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

module.exports = {
  driver: 'mysql',

  /** Create tables (idempotent) and seed products + demo user if empty. */
  async init() {
    const fs = require('fs');
    const path = require('path');
    const ddl = fs.readFileSync(path.join(__dirname, '..', '..', 'schema.sql'), 'utf8');
    const conn = await getPool().getConnection();
    try {
      // Run each statement in the schema file.
      for (const stmt of ddl.split(/;\s*[\r\n]/).map((s) => s.trim()).filter(Boolean)) {
        if (/^use\s/i.test(stmt) || /^create database/i.test(stmt)) continue; // DB chosen via config
        await conn.query(stmt);
      }
      const [[{ c }]] = await conn.query('SELECT COUNT(*) AS c FROM products');
      if (c === 0) {
        for (const p of seedProducts) {
          await conn.query(
            'INSERT INTO products (id,name,description,category,gender,image,price,sizes,stock,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [p.id, p.name, p.description, p.category, p.gender, p.image, p.price, JSON.stringify(p.sizes), p.stock, new Date(p.createdAt)]
          );
        }
      }
      const [[{ uc }]] = await conn.query('SELECT COUNT(*) AS uc FROM users');
      if (uc === 0) {
        await conn.query(
          'INSERT INTO users (id,first_name,last_name,email,password,role) VALUES (?,?,?,?,?,?)',
          [demoUser.id, demoUser.firstName, demoUser.lastName, demoUser.email, bcrypt.hashSync(demoUser.password, 10), demoUser.role]
        );
      }
    } finally {
      conn.release();
    }
    return { products: seedProducts.length };
  },

  async listProducts() {
    const [rows] = await getPool().query('SELECT * FROM products');
    return rows.map(rowToProduct);
  },
  async getProduct(id) {
    const [rows] = await getPool().query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] ? rowToProduct(rows[0]) : null;
  },
  async updateProduct(id, updates) {
    const fields = [];
    const values = [];
    for (const [k, v] of Object.entries(updates)) {
      const col = k === 'sizes' ? 'sizes' : k;
      fields.push(`${col} = ?`);
      values.push(k === 'sizes' ? JSON.stringify(v) : v);
    }
    if (!fields.length) return this.getProduct(id);
    values.push(id);
    await getPool().query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getProduct(id);
  },

  async findUserByEmail(email) {
    const [rows] = await getPool().query('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    return rows[0] ? rowToUser(rows[0]) : null;
  },
  async findUserById(id) {
    const [rows] = await getPool().query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] ? rowToUser(rows[0]) : null;
  },
  async createUser(u) {
    const id = uuid();
    await getPool().query(
      'INSERT INTO users (id,first_name,last_name,email,password,role) VALUES (?,?,?,?,?,?)',
      [id, u.firstName, u.lastName, u.email, u.password, u.role || 'customer']
    );
    return this.findUserById(id);
  },

  async createOrder(o) {
    const id = uuid();
    await getPool().query(
      'INSERT INTO orders (id,order_number,user_id,products,customer,shipping,coupon_code,subtotal,discount,shipping_cost,total,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [id, o.orderNumber, o.userId, JSON.stringify(o.products), JSON.stringify(o.customer), JSON.stringify(o.shipping), o.couponCode, o.subtotal, o.discount, o.shipping_cost, o.total, o.status]
    );
    return this.getOrder(id);
  },
  async listOrders(userId) {
    const [rows] = await getPool().query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows.map(rowToOrder);
  },
  async getOrder(idOrNumber) {
    const [rows] = await getPool().query('SELECT * FROM orders WHERE id = ? OR order_number = ?', [idOrNumber, idOrNumber]);
    return rows[0] ? rowToOrder(rows[0]) : null;
  },
};
