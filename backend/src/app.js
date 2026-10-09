const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const config = require('../config');
const openapiSpec = require('./docs/openapi');
const { notFound, errorHandler } = require('./middleware/error');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'waracle-store-api' }));

// Interactive API docs (Swagger UI) + raw OpenAPI JSON.
app.get('/api/docs.json', (req, res) => res.json(openapiSpec));
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiSpec, {
    customSiteTitle: 'Waracle Store API — Docs',
    swaggerOptions: { persistAuthorization: true },
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
