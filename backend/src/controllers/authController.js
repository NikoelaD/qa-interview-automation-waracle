const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../../config');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sign(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}
function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

/** POST /api/auth/register */
async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body || {};
    if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'All fields are required.' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    if (confirmPassword !== undefined && password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' });
    if (await db.findUserByEmail(email)) return res.status(409).json({ message: 'An account with that email already exists.' });

    const user = await db.createUser({ firstName, lastName, email, password: bcrypt.hashSync(password, 10), role: 'customer' });
    return res.status(201).json({ token: sign(user), user: publicUser(user) });
  } catch (e) { next(e); }
}

/** POST /api/auth/login */
async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await db.findUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: 'Incorrect email or password.' });
    return res.json({ token: sign(user), user: publicUser(user) });
  } catch (e) { next(e); }
}

/** GET /api/auth/me */
async function me(req, res, next) {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
}

module.exports = { register, login, me };
