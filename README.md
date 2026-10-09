# Waracle Store — Monorepo

One codebase, three linked components plus UI. Every part runs **independently**, and they **link together** through a shared REST API and a common product catalogue.

```
WaracleStore/
├── backend/   REST API + Swagger docs   |  MySQL data layer
├── web/       React + Vite web UI (runs standalone, or against the backend)
└── mobile/    Expo / React Native app (same brand + catalogue as web)
```

## Architecture

- **API (backend/):** an Express REST API documented with Swagger UI.
  Exposes auth, products, cart pricing and orders. Interactive docs at
  `http://localhost:4000/api/docs`.
- **MySQL (backend/):** a MySQL data layer (`users`, `products`,
  `orders`). Selected with `DB_DRIVER=mysql`. A zero-setup in-memory driver is the default so the API also runs with no database at all.
- **Mobile (mobile/):** an Expo React Native app mirroring the web UI
  (same palette, tagline, values and 9-product catalogue). Reads from the backend when `EXPO_PUBLIC_API_URL` is set, otherwise uses a bundled sample catalogue.
- **Web (web/):** runs fully standalone with an in-browser mock API, or against the real backend when `VITE_API_URL` is set.

The **same 9 products** and the **same pricing rules** are used by the API, the web app and the mobile app, so totals and catalogue match everywhere.

## Prerequisites

* Node.js: v22.0.0 or higher (Tested on v26.7.0)
* npm: v8.6.0 or higher (Tested on v11.19.0)
* Git: Required for version control
* Web Browser: Chrome (latest version) recommended for the web UI
* Expo Go: Required for mobile testing, not required otherwise

Docker (Optional): Required only if running the real MySQL database instance natively

## Launching the Application

Installation and execution are handled by root-level launch scripts. You do not need to manually install NPM packages or run individual dev servers. 

**1. Launch the Full Stack**
To install all dependencies across workspaces and concurrently start the Backend, Web UI, and Mobile app, run:

```bash
./launch-all.sh
```

**2. Launch Web Only**
To install dependencies and start only the React + Vite web UI:

```bash
./launch-web.sh
```

Note: The web app runs on http://localhost:5173 using a standalone mock API by default. To use the real backend, ensure you have set VITE_API_URL=http://localhost:4000 in web/.env.local prior to launching.

**3. Launch Mobile Only**
To install dependencies and start only the Expo React Native app:

```bash
./launch-mobile.sh
```

## Database Configuration
By default, the backend uses a zero-setup in-memory driver. If you want to use the real MySQL data layer:

Start a MySQL instance. For a quick Docker setup, you can use:

```bash
docker run --name waracle-mysql -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=waracle_store -p 3306:3306 -d mysql:8
```
In backend/.env, set `DB_DRIVER=mysql` alongside your `DB_*` connection variables.

Run `./launch-all.sh` (or start the backend via your preferred method). The API automatically creates and seeds the tables on boot.