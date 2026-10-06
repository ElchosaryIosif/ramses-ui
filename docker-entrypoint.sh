#!/bin/sh
set -e

# ── runtime-config.js from env ──
# API_BASE is the API's origin, e.g. https://api.ramsesbazaar.com. Empty means
# the browser calls /api on the shop's own origin.
cat > /usr/share/nginx/html/runtime-config.js <<JS
window.__RUNTIME_CONFIG__ = {
  API_BASE: "${API_BASE:-}"
};
JS
echo "runtime-config.js → API_BASE=${API_BASE:-<not set, same origin>}"

# Railway (and most PaaS) tell the container which port to listen on.
sed -i "s/__PORT__/${PORT:-80}/" /etc/nginx/conf.d/default.conf

exec "$@"
