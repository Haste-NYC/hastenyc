#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Start the dev server in the background
npm run dev &
DEV_PID=$!

# Wait for the server to be ready
echo "Waiting for dev server on port 5173..."
while ! curl -s http://localhost:5173 > /dev/null 2>&1; do
  sleep 0.5
done

# Open a new tab in the existing Chrome window
open -a "Google Chrome" http://localhost:5173

echo "Dev server running (PID $DEV_PID). Press Ctrl+C to stop."

# Forward Ctrl+C to the dev server
trap "kill $DEV_PID 2>/dev/null; exit" INT TERM
wait $DEV_PID
