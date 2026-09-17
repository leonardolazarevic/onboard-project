#!/bin/sh
set -eu

# Publish the pod env to the browser so the image stays environment-agnostic
# and the API token is never baked into the static bundle.
escape() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

cat > /usr/share/nginx/html/env.js <<EOF
window.__ENV__ = {
  API_URL: "$(escape "${API_URL:-/messages}")",
  API_TOKEN: "$(escape "${API_TOKEN:-}")"
};
EOF

exec nginx -g "daemon off;"