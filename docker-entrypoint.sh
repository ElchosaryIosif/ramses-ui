#!/bin/sh
set -e

# ── runtime-config.js from env ──
# API_BASE is the API's origin, e.g. https://api.ramsesbazaar.com. Empty means
# the browser calls /api on the shop's own origin.
# GA_ID is the Google Analytics 4 measurement ID (G-XXXXXXX). Empty or malformed
# turns analytics, and the cookie banner, off.
case "${GA_ID:-}" in
  G-*) GA_ID_SAFE=$(printf '%s' "$GA_ID" | tr -cd 'A-Z0-9-') ;;
  *)   GA_ID_SAFE="" ;;
esac
cat > /usr/share/nginx/html/runtime-config.js <<JS
window.__RUNTIME_CONFIG__ = {
  API_BASE: "${API_BASE:-}",
  GA_ID: "${GA_ID_SAFE}"
};
JS
echo "runtime-config.js → API_BASE=${API_BASE:-<not set, same origin>} GA_ID=${GA_ID_SAFE:-<not set, analytics off>}"

# Railway (and most PaaS) tell the container which port to listen on.
sed -i "s/__PORT__/${PORT:-80}/" /etc/nginx/conf.d/default.conf

exec "$@"
