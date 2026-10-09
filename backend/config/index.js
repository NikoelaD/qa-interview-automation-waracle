/**
 * Central configuration. Reads from environment variables with sensible
 * development defaults so the app runs out of the box (in-memory DB).
 */
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'waracle-dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  db: {
    driver: (process.env.DB_DRIVER || 'memory').toLowerCase(), // 'memory' | 'mysql'
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'waracle_store',
  },
};
