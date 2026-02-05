#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Create a temp file to capture Vite output
VITE_LOG=$(mktemp)

# Start the dev server, tee output to temp file and stdout
npm run dev 2>&1 | tee "$VITE_LOG" &
DEV_PID=$!

# Wait for Vite to output the local URL and extract the port
echo "Waiting for dev server..."
PORT=""
while [ -z "$PORT" ]; do
  sleep 0.5
  PORT=$(grep -oE 'Local:\s+http://localhost:([0-9]+)' "$VITE_LOG" 2>/dev/null | grep -oE '[0-9]+' | head -1 || true)
done

# Open Chrome with the detected port
open -a "Google Chrome" "http://localhost:$PORT"

echo "Dev server running on port $PORT (PID $DEV_PID). Press Ctrl+C to stop."

# Cleanup temp file and forward Ctrl+C to the dev server
trap "rm -f '$VITE_LOG'; kill $DEV_PID 2>/dev/null; exit" INT TERM
wait $DEV_PID
