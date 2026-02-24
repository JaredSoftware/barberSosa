#!/bin/sh
# Asegura node_modules en el volumen; luego ejecuta el comando
if [ ! -d node_modules/nuxt ]; then
  echo "Instalando dependencias en el contenedor..."
  npm ci --ignore-scripts
fi
exec "$@"
