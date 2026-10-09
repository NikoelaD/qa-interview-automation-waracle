/**
 * OpenAPI 3.0 specification for the Waracle Store API.
 *
 * This is hand-authored (rather than generated from JSDoc) so the contract is
 * explicit and stable. It is served as interactive Swagger UI at /api/docs and
 * as raw JSON at /api/docs.json.
 */

const components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Paste the token returned by /auth/login or /auth/register.',
    },
  },
  schemas: {
    Error: {
      type: 'object',
      properties: { message: { type: 'string', example: 'Incorrect email or password.' } },
    },
    User: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'b1f2…' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john.doe@example.com' },
        role: { type: 'string', example: 'customer' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
    AuthResponse: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…' },
        user: { $ref: '#/components/schemas/User' },
      },
    },
    Product: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'p-mens-tee' },
        name: { type: 'string', example: "Men's Logo T-Shirt" },
        description: { type: 'string' },
        category: { type: 'string', example: 'T-Shirts' },
        gender: { type: 'string', enum: ['Men', 'Women', 'Unisex'] },
        image: { type: 'string', example: 'tshirt-black' },
        price: { type: 'number', format: 'float', example: 24.99 },
        sizes: { type: 'array', items: { type: 'string' }, example: ['S', 'M', 'L'] },
        stock: { type: 'integer', example: 120 },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
    PriceSummary: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { type: 'object' } },
        couponCode: { type: 'string', nullable: true, example: 'Waracle25' },
        couponApplied: { type: 'boolean', example: true },
        subtotal: { type: 'number', example: 100 },
        discount: {
          type: 'number',
          example: 25,
          description: 'Discount applied to the subtotal when a valid coupon is used.',
        },
        shipping: { type: 'number', example: 5 },
        total: { type: 'number', example: 80 },
      },
    },
    Order: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        orderNumber: { type: 'string', example: 'WS-2024-000124' },
        userId: { type: 'string' },
        products: { type: 'array', items: { type: 'object' } },
        customer: { type: 'object' },
        shipping: { type: 'object' },
        couponCode: { type: 'string', nullable: true },
        subtotal: { type: 'number' },
        discount: { type: 'number' },
        shipping_cost: { type: 'number' },
        total: { type: 'number' },
        status: { type: 'string', example: 'confirmed' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  },
};

const okError = (description) => ({
  description,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
});

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Waracle Store API',
    version: '1.0.0',
    description:
      'Waracle Store e-commerce app.\n\n' +
      '**Demo login:** `john.doe@example.com` / `Password123`',
  },
  servers: [{ url: '/api', description: 'Current server' }],
  tags: [
    { name: 'Auth', description: 'Registration, login and profile' },
    { name: 'Products', description: 'Catalogue, filtering, sorting, suggestions' },
    { name: 'Cart', description: 'Authoritative price calculation' },
    { name: 'Orders', description: 'Order placement and retrieval (JWT required)' },
    { name: 'System', description: 'Health' },
  ],
  components,
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service is up',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' }, service: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },

    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Create a new account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'password'],
                properties: {
                  firstName: { type: 'string', example: 'Ada' },
                  lastName: { type: 'string', example: 'Lovelace' },
                  email: { type: 'string', example: 'ada@example.com' },
                  password: { type: 'string', minLength: 8, example: 'Password123' },
                  confirmPassword: { type: 'string', example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Account created; returns a JWT',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: okError('Validation failed (missing fields, weak password, mismatch)'),
          409: okError('Email already registered'),
        },
      },
    },

    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate and receive a JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'john.doe@example.com' },
                  password: { type: 'string', example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Authenticated; returns a JWT',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: okError('Email or password missing'),
          401: okError('Incorrect email or password'),
        },
      },
    },

    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get the current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } },
              },
            },
          },
          401: okError('Missing or invalid token'),
          404: okError('User not found'),
        },
      },
    },

    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products with filtering and sorting',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, example: 'T-Shirts' },
          { name: 'gender', in: 'query', schema: { type: 'string', enum: ['Men', 'Women', 'Unisex'] } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc', 'newest'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Matching products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer', example: 9 },
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 9 },
                    products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a single product',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'p-headset' }],
        responses: {
          200: {
            description: 'The product',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { product: { $ref: '#/components/schemas/Product' } } },
              },
            },
          },
          404: okError('Product not found'),
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Update a product',
        description:
          'Update one or more product fields. Only whitelisted fields are applied; ' +
          '`id` and `createdAt` cannot be changed. Requires authentication.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'p-mens-tee' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: "Men's Logo T-Shirt (Updated)" },
                  description: { type: 'string' },
                  category: { type: 'string', example: 'T-Shirts' },
                  gender: { type: 'string', enum: ['Men', 'Women', 'Unisex'] },
                  image: { type: 'string', example: 'tshirt-black' },
                  price: { type: 'number', example: 27.99 },
                  sizes: { type: 'array', items: { type: 'string' }, example: ['S', 'M', 'L', 'XL'] },
                  stock: { type: 'integer', example: 200 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated product',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { product: { $ref: '#/components/schemas/Product' } } },
              },
            },
          },
          400: okError('No updatable fields, or an invalid field value'),
          401: okError('Missing or invalid token'),
          404: okError('Product not found'),
        },
      },
    },

    '/products/{id}/suggestions': {
      get: {
        tags: ['Products'],
        summary: 'Get related products',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'p-mens-tee' }],
        responses: {
          200: {
            description: 'Up to four related products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { products: { type: 'array', items: { $ref: '#/components/schemas/Product' } } },
                },
              },
            },
          },
          404: okError('Product not found'),
        },
      },
    },

    '/cart/summary': {
      post: {
        tags: ['Cart'],
        summary: 'Calculate an authoritative price breakdown',
        description:
          'Send line items and an optional coupon to receive subtotal, discount, shipping and total. ' +
          'The WARACLE25 coupon applies 25% off the subtotal.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string', example: 'p-mens-tee' },
                        quantity: { type: 'integer', example: 2 },
                      },
                    },
                  },
                  couponCode: { type: 'string', example: 'Waracle25' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Price breakdown',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PriceSummary' } } },
          },
          400: okError('items missing/invalid or unknown product'),
        },
      },
    },

    '/cart/items/{productId}': {
      delete: {
        tags: ['Cart'],
        summary: 'Remove an item from the cart',
        description:
          'Removes the matching line from the supplied cart and returns the recalculated breakdown. ' +
          'Pass an optional `size` to remove only the line for that size.',
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' }, example: 'p-mens-tee' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string', example: 'p-mens-tee' },
                        quantity: { type: 'integer', example: 1 },
                        size: { type: 'string', example: 'M' },
                      },
                    },
                  },
                  couponCode: { type: 'string', example: 'Waracle25' },
                  size: { type: 'string', example: 'M', description: 'Optional: remove only this size' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Recalculated cart after removal',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PriceSummary' } } },
          },
          400: okError('items missing/invalid or unknown product'),
          404: okError('Item not found in cart'),
        },
      },
    },

    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Place an order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items', 'customer', 'shipping'],
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string', example: 'p-mens-tee' },
                        quantity: { type: 'integer', example: 1 },
                        size: { type: 'string', example: 'M' },
                      },
                    },
                  },
                  couponCode: { type: 'string', example: 'Waracle25' },
                  customer: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', example: 'John Doe' },
                      email: { type: 'string', example: 'john.doe@example.com' },
                      phone: { type: 'string', example: '07000 000000' },
                    },
                  },
                  shipping: {
                    type: 'object',
                    properties: {
                      address: { type: 'string', example: '10 Digital Drive' },
                      city: { type: 'string', example: 'Edinburgh' },
                      postcode: { type: 'string', example: 'EH1 1AA' },
                      country: { type: 'string', example: 'United Kingdom' },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Order placed',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { order: { $ref: '#/components/schemas/Order' } } },
              },
            },
          },
          400: okError('Empty cart, missing customer or shipping details'),
          401: okError('Missing or invalid token'),
        },
      },
      get: {
        tags: ['Orders'],
        summary: "List the current user's orders",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Orders',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { orders: { type: 'array', items: { $ref: '#/components/schemas/Order' } } },
                },
              },
            },
          },
          401: okError('Missing or invalid token'),
        },
      },
    },

    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get a single order by id or order number',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'WS-2024-000124' }],
        responses: {
          200: {
            description: 'The order',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { order: { $ref: '#/components/schemas/Order' } } },
              },
            },
          },
          401: okError('Missing or invalid token'),
          403: okError('Order belongs to another user'),
          404: okError('Order not found'),
        },
      },
    },
  },
};

module.exports = spec;
