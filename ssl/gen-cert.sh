#!/bin/bash
# Genera certificado autofirmado para barbersosa.com (nginx + Google OAuth)
# Ejecutar desde la raíz del proyecto: ./ssl/gen-cert.sh

set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DIR"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$DIR/key.pem" \
  -out "$DIR/cert.pem" \
  -config "$DIR/openssl.cnf" \
  -extensions v3_req

chmod 644 "$DIR/cert.pem"
chmod 600 "$DIR/key.pem"
echo "OK: $DIR/cert.pem y $DIR/key.pem generados (válidos 365 días)."
