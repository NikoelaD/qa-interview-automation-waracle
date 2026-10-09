#!/usr/bin/env bash

echo "🚀 Starting Waracle Store (All services)..."

# Catch script exit or interruption signals and terminate the entire process group
cleanup() {
  trap - EXIT INT TERM
  echo ""
  echo "🛑 Shutting down Waracle Store..."
  kill 0 2>/dev/null
}
trap cleanup EXIT INT TERM

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing workspaces..."
  npm install
fi

echo "🟢 Starting Backend (Port 4000)..."
npm run start:backend &

echo "🔵 Starting Web UI (Standalone Mock or linked)..."
# Setting VITE_API_URL links the web UI to the backend instead of the mock
VITE_API_URL=http://localhost:4000 npm run dev:web &

echo "📱 Starting Mobile (Expo)..."
# Setting EXPO_PUBLIC_API_URL links the app to the backend
EXPO_PUBLIC_API_URL=http://localhost:4000 npm run start:mobile