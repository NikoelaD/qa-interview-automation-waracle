const app = require('./app');
const config = require('../config');
const db = require('./db');

// Initialise the data layer (creates + seeds tables for MySQL, or seeds the
// in-memory store) before accepting requests.
(async () => {
  const seeded = await db.init();
  app.listen(config.port, () => {
    /* eslint-disable no-console */
    console.log(`\nWaracle Store API running on http://localhost:${config.port}`);
    console.log(`Swagger UI docs:  http://localhost:${config.port}/api/docs`);
    console.log(`Database driver:  ${db.driver}`);
    console.log(`Seeded ${seeded.products} products. Demo login: john.doe@example.com / Password123\n`);
    /* eslint-enable no-console */
  });
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start API:', err.message);
  process.exit(1);
});
