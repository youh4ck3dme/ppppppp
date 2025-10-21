#!/bin/bash

echo "--- Building production app ---"
npm run build

echo "--- Installing Lighthouse ---"
npm install -D lighthouse

echo "--- Starting preview server ---"
npm run preview &
PREVIEW_PID=$!

# Wait for the server to be ready
sleep 15

echo "--- Running Lighthouse test on http://localhost:4173 ---"
npx lighthouse http://localhost:4173 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=lighthouse-results.json

echo "--- Shutting down preview server ---"
kill $PREVIEW_PID

echo "--- Test complete ---"
