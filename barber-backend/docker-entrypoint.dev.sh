#!/bin/sh
# Asegura node_modules en el volumen; luego ejecuta el comando
if [ ! -d node_modules/@nestjs/core ]; then
  echo "Instalando dependencias en el contenedor..."
  npm ci
fi
exec "$@"
