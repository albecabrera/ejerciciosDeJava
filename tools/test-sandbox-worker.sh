#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
QUEUE="$(mktemp -d)"
WORKER_PID=""

cleanup() {
  [[ -z "$WORKER_PID" ]] || kill "$WORKER_PID" 2>/dev/null || true
  rm -rf "$QUEUE"
}
trap cleanup EXIT

JAVA_WORKER_QUEUE="$QUEUE" java "$ROOT/sandbox/Worker.java" >/dev/null 2>&1 &
WORKER_PID=$!

REQUEST='{"source":"System.out.println(\"worker-test-ok\");","fileName":"WorkerTest.java","mode":"snippet","run":true}'
RESULT="$(printf '%s' "$REQUEST" | JAVAC_BIN=/missing/javac JAVA_SANDBOX_MODE=worker JAVA_SANDBOX_QUEUE="$QUEUE" php "$ROOT/api/compile.php")"

printf '%s' "$RESULT" | grep -q '"ok":true'
printf '%s' "$RESULT" | grep -q '"sandbox":"worker-no-network"'
printf '%s' "$RESULT" | grep -q 'worker-test-ok'

INVALID='{"source":"int total = ;","fileName":"Broken.java","mode":"snippet","run":true}'
DIAGNOSTIC="$(printf '%s' "$INVALID" | JAVAC_BIN=/missing/javac JAVA_SANDBOX_MODE=worker JAVA_SANDBOX_QUEUE="$QUEUE" php "$ROOT/api/compile.php")"
printf '%s' "$DIAGNOSTIC" | grep -q '"ok":false'
printf '%s' "$DIAGNOSTIC" | grep -q '"phase":"compile"'
printf '%s' "$DIAGNOSTIC" | grep -q '"severity":"error"'

printf '%s\n' "$RESULT"
