#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8000}"
URL="http://${HOST}:${PORT}/"
LOG_FILE="${TMPDIR:-/tmp}/java-werkstatt-${PORT}.log"
PID_FILE="${TMPDIR:-/tmp}/java-werkstatt-${PORT}.pid"

if curl -fsS "${URL}index.html" 2>/dev/null | grep -q "Java Werkstatt"; then
  echo "Java Werkstatt ya está activa en ${URL}"
else
  INITIAL_PORT="${PORT}"
  while command -v lsof >/dev/null 2>&1 && lsof -tiTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; do
    PORT=$((PORT + 1))
    if (( PORT > INITIAL_PORT + 20 )); then
      echo "Error: no encontré un puerto libre entre ${INITIAL_PORT} y ${PORT}." >&2
      exit 1
    fi
  done
  URL="http://${HOST}:${PORT}/"
  LOG_FILE="${TMPDIR:-/tmp}/java-werkstatt-${PORT}.log"
  PID_FILE="${TMPDIR:-/tmp}/java-werkstatt-${PORT}.pid"

  if ! command -v php >/dev/null 2>&1; then
    echo "Error: PHP no está instalado o no está disponible en PATH." >&2
    exit 1
  fi

  echo "Iniciando Java Werkstatt en ${URL}..."
  nohup php -S "${HOST}:${PORT}" -t "${ROOT_DIR}" >"${LOG_FILE}" 2>&1 &
  SERVER_PID=$!
  printf '%s\n' "${SERVER_PID}" >"${PID_FILE}"

  for _ in {1..30}; do
    if curl -fsS "${URL}index.html" >/dev/null 2>&1; then
      break
    fi
    if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
      echo "Error: no se pudo iniciar el servidor. Revisá ${LOG_FILE}" >&2
      exit 1
    fi
    sleep 0.1
  done

  if ! curl -fsS "${URL}index.html" >/dev/null 2>&1; then
    echo "Error: el servidor no respondió. Revisá ${LOG_FILE}" >&2
    exit 1
  fi
fi

if command -v open >/dev/null 2>&1; then
  open "${URL}"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "${URL}" >/dev/null 2>&1 &
else
  echo "Abrí manualmente: ${URL}"
  exit 0
fi

echo "App abierta: ${URL}"
echo "Log del servidor: ${LOG_FILE}"
