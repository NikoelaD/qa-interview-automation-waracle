# Waracle Store — Backend (Phase 1 + Phase 2)

Express REST API documented with Swagger UI (Phase 1) on top of a swappable data
layer with a real MySQL implementation (Phase 2) and a zero-setup in-memory driver.

## Run
```bash
npm install
cp .env.example .env     # optional — defaults work
npm run dev              # http://localhost:4000
```
- Swagger UI: `http://localhost:4000/api/docs`
- OpenAPI JSON: `http://localhost:4000/api/docs.json`
- Demo login: `john.doe@example.com` / `Password123`

## Database (Phase 2)
- `DB_DRIVER=memory` (default): in-memory, resets on restart, no setup.
- `DB_DRIVER=mysql`: real MySQL. Set `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`,
  then `npm run db:init` (or just start the API — it creates + seeds on boot).
  Schema: `schema.sql` (`users`, `products`, `orders`).

## Endpoints (all under `/api`)
- `GET  /health`
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me` 🔒
- `GET  /products`, `GET /products/:id`, `PUT /products/:id` 🔒, `GET /products/:id/suggestions`
- `POST /cart/summary`, `DELETE /cart/items/:productId`
- `POST /orders` 🔒, `GET /orders` 🔒, `GET /orders/:id` 🔒

🔒 = requires `Authorization: Bearer <token>`
