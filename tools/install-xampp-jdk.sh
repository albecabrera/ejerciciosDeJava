#!/usr/bin/env sh
set -eu

CONTAINER="${1:-xampp-php}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker no está disponible." >&2
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "No encontré el contenedor $CONTAINER en ejecución." >&2
  exit 1
fi

docker exec "$CONTAINER" sh -lc '
  set -eu
  if command -v javac >/dev/null 2>&1; then
    javac -version
    exit 0
  fi
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends default-jdk-headless
    javac -version
    exit 0
  fi
  echo "Este contenedor no usa apt-get. Instalá un JDK y configurá JAVAC_BIN." >&2
  exit 2
'
