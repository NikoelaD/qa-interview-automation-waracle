/**
 * 404 handler for unmatched routes.
 */
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

/**
 * Central error handler. Any error passed to next(err) lands here so responses
 * stay consistent and stack traces never leak to clients.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  // eslint-disable-next-line no-console
  if (status >= 500) console.error(err);
  res.status(status).json({ message: err.message || 'Internal server error.' });
}

module.exports = { notFound, errorHandler };
