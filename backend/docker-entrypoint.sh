#!/bin/sh
set -e
echo "Starting SafePay backend..."
exec node src/index.js
