#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Link Vercel project if not already linked (needed for fresh worktrees)
if [ ! -f .vercel/project.json ]; then
  echo "Vercel not linked. Linking project..."
  vercel link --yes 2>&1
fi

# Pull latest env vars from Vercel
echo "Pulling environment variables from Vercel..."
vercel env pull .env.local --environment development --yes 2>&1

# Start Vite dev server with Vercel env vars loaded
# API calls proxy to the live Vercel deployment
echo "Starting dev server..."
npm run dev 2>&1 &
DEV_PID=$!

# Wait for Vite to be ready
echo "Waiting for dev server..."
until curl -s http://localhost:8080 > /dev/null 2>&1; do
  sleep 1
done

open -a "Google Chrome" "http://localhost:8080"

echo "Dev server running on http://localhost:8080 (PID $DEV_PID). Press Ctrl+C to stop."
echo "API calls proxy to Vercel. Env vars pulled from Vercel."

trap "kill $DEV_PID 2>/dev/null; exit" INT TERM
wait $DEV_PID
