#!/bin/sh
set -e

# Paths can be overridden to run this against a local copy (testing); the image uses the defaults.
HTML_DIR=${NGINX_HTML_DIR:-/usr/share/nginx/html}
CONF=${NGINX_CONF:-/etc/nginx/conf.d/default.conf}
NGINX_TEST=${NGINX_TEST:-nginx -t -q}

# ── API address ──
# API_BASE is the API's origin, e.g. https://api.ramsesbazaar.com. Empty means the browser calls
# /api on the shop's own origin. Anything that isn't a plain http(s) origin is ignored.
API_BASE=$(printf '%s' "${API_BASE:-}" | sed 's#/*$##')
case "$API_BASE" in
  http://*|https://*) case "$API_BASE" in *[!A-Za-z0-9.:/_-]*) API_BASE="" ;; esac ;;
  *) API_BASE="" ;;
esac

# GA_ID is the Google Analytics 4 measurement ID (G-XXXXXXX). Empty or malformed
# turns analytics, and the cookie banner, off.
case "${GA_ID:-}" in
  G-*) GA_ID_SAFE=$(printf '%s' "$GA_ID" | tr -cd 'A-Z0-9-') ;;
  *)   GA_ID_SAFE="" ;;
esac

CONFIG="window.__RUNTIME_CONFIG__ = { API_BASE: \"$API_BASE\", GA_ID: \"$GA_ID_SAFE\" };"
printf '%s\n' "$CONFIG" > "$HTML_DIR/runtime-config.js"
echo "runtime-config → API_BASE=${API_BASE:-<not set, same origin>} GA_ID=${GA_ID_SAFE:-<not set, analytics off>}"

# ── index.html ──
# Rendered from the copy in the image, so a restart doesn't apply this twice:
#  - the runtime config goes inline, saving a render-blocking request;
#  - the browser is told to connect to the API and fetch the catalogue while the app loads.
TEMPLATE="$HTML_DIR/../index.template.html"
[ -f "$TEMPLATE" ] || cp "$HTML_DIR/index.html" "$TEMPLATE"
if [ -n "$API_BASE" ]; then
  HINTS="<link rel=\"preconnect\" href=\"$API_BASE\" crossorigin /><link rel=\"preload\" href=\"$API_BASE/api/products\" as=\"fetch\" crossorigin /><link rel=\"preload\" href=\"$API_BASE/api/settings\" as=\"fetch\" crossorigin />"
else
  HINTS="<link rel=\"preload\" href=\"/api/products\" as=\"fetch\" crossorigin /><link rel=\"preload\" href=\"/api/settings\" as=\"fetch\" crossorigin />"
fi
# Plain-text replacement (no regex), so nothing in the values is treated specially.
CONFIG="$CONFIG" HINTS="$HINTS" awk '
  function replace(s, find, with,   i) {
    i = index(s, find)
    return i ? substr(s, 1, i - 1) with substr(s, i + length(find)) : s
  }
  {
    line = replace($0, "<script src=\"/runtime-config.js\"></script>", "<script>" ENVIRON["CONFIG"] "</script>")
    print replace(line, "<!--api-hints-->", ENVIRON["HINTS"])
  }
' "$TEMPLATE" > "$HTML_DIR/index.html"

# ── nginx ──
# Railway (and most PaaS) tell the container which port to listen on.
# nginx asks the API for the sitemap and each product page's <head> tags. With no API (or one
# nginx can't resolve at start-up), those requests go nowhere and the static fallbacks are used.
NOWHERE=http://127.0.0.1:9
[ -f "$CONF.template" ] || cp "$CONF" "$CONF.template"
render() {
  sed -e "s/__PORT__/${PORT:-80}/" -e "s#__API_UPSTREAM__#$1#g" "$CONF.template" > "$CONF"
}
render "${API_BASE:-$NOWHERE}"
if [ -n "$API_BASE" ] && ! $NGINX_TEST 2>/dev/null; then
  echo "nginx: could not use $API_BASE for the sitemap and product tags; using the static fallbacks"
  render "$NOWHERE"
fi

exec "$@"
