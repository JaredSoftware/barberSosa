#!/bin/sh
# Entrypoint: Solo ejecutar PM2 (el build se debe hacer fuera)
# Check if frontend build exists (volume mount might hide it)
if [ ! -f "/app/barber-backend/public/index.html" ]; then
    echo "⚠️  Frontend build not found (volume mount?). Building now..."
    cd /app/barberEcommerce
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm ci --ignore-scripts
    fi
    npm run generate
    cd /app
fi

exec "$@"
