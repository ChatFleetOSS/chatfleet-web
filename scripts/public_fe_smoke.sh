#!/usr/bin/env bash
set -euo pipefail
BASE=${BASE_URL:-http://localhost:8000/api}
slug=${RAG_SLUG:-odt-public}

# public list should contain slug
if ! curl -fsS "$BASE/public/rag/list" | grep -q "$slug"; then
  echo "[fail] public list missing $slug" >&2
  exit 1
fi

# public chat should respond
resp=$(curl -fsS -X POST "$BASE/public/chat" \
  -H 'Content-Type: application/json' \
  -d "{\"rag_slug\":\"$slug\",\"messages\":[{\"role\":\"user\",\"content\":\"ping\"}]}")
if [[ -z "$resp" ]]; then
  echo "[fail] empty chat response" >&2
  exit 1
fi
echo "[ok] public FE smoke: list+chat"
