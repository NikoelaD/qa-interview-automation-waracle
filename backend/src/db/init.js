// Initialise + seed the database directly (useful for MySQL setup).
const db = require('./index');
(async () => {
  const r = await db.init();
  // eslint-disable-next-line no-console
  console.log(`[${db.driver}] initialised. Seeded ${r.products} products.`);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
