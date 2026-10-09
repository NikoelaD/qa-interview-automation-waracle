# Waracle Store — Mobile (Phase 3)

An Expo / React Native app that mirrors the web UI: same brand palette, tagline,
five values and the same 9-product catalogue. Screens: Home (hero + values +
featured), Products (with category filter), Product detail (size + add to cart),
Cart (coupon + live totals) and Sign in.

## Run
```bash
npm install
npm start            # Expo dev server — open in Expo Go, or press i / a for a simulator
```

## Link to the backend (optional)
By default the app uses a bundled sample catalogue so it runs standalone. To read
from the real API instead:
```bash
EXPO_PUBLIC_API_URL=http://localhost:4000 npm start
```
If the backend is unreachable it falls back to the sample catalogue automatically.

## Note
Product imagery is shown as clean branded tiles (clay + Waracle mark) to keep the
app lightweight and dependency-free; the layout, branding and data match the web app.
