/**
 * Database driver selector.
 *
 * DB_DRIVER=mysql  -> real MySQL (Phase 2; requires a running MySQL + env vars)
 * DB_DRIVER=memory -> in-memory store (default; zero setup, resets on restart)
 *
 * Both expose the identical async interface, so controllers never care which
 * one is active.
 */
const config = require('../../config');

const driver = config.db.driver === 'mysql' ? require('./mysql') : require('./memory');

module.exports = driver;
