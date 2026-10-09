/**
 * In-memory data layer. Implements the same interface as the MySQL driver so
 * the API runs out of the box with no database. Used when DB_DRIVER=memory
 * (the default). Data resets on restart.
 */
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { products: seedProducts, demoUser } = require('./seedData');

const store = { products: [], users: [], orders: [] };

module.exports = {
  driver: 'memory',

  async init() {
    store.products = seedProducts.map((p) => ({ ...p }));
    store.users = [{ ...demoUser, id: demoUser.id, password: bcrypt.hashSync(demoUser.password, 10), createdAt: new Date().toISOString() }];
    store.orders = [];
    return { products: store.products.length };
  },

  async listProducts() {
    return store.products.map((p) => ({ ...p }));
  },
  async getProduct(id) {
    const p = store.products.find((x) => x.id === id);
    return p ? { ...p } : null;
  },
  async updateProduct(id, updates) {
    const p = store.products.find((x) => x.id === id);
    if (!p) return null;
    Object.assign(p, updates);
    return { ...p };
  },

  async findUserByEmail(email) {
    return store.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
  },
  async findUserById(id) {
    return store.users.find((u) => u.id === id) || null;
  },
  async createUser(u) {
    const user = { id: uuid(), ...u, role: u.role || 'customer', createdAt: new Date().toISOString() };
    store.users.push(user);
    return user;
  },

  async createOrder(o) {
    const order = { id: uuid(), ...o, createdAt: new Date().toISOString() };
    store.orders.push(order);
    return order;
  },
  async listOrders(userId) {
    return store.orders.filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async getOrder(idOrNumber) {
    return store.orders.find((o) => o.id === idOrNumber || o.orderNumber === idOrNumber) || null;
  },
};
