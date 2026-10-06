#!/bin/sh
#
# Usage:
#   scripts/docker.sh build  [env-file]   – build the Docker image
#   scripts/docker.sh push   [env-file]   – push the Docker image
#   scripts/docker.sh release [env-file]  – build + push
#
# env-file defaults to ".env.prod"

set -e

IMAGE_NAME="ghcr.io/elchosaryiosif/ramses-ui"
ACTION="${1:?Usage: docker.sh <build|push|release> [env-file]}"
ENV_FILE="${2:-.env.prod}"

# ── Parse API_BASE from the env file ───────────────────────────────
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  . "./$ENV_FILE"
  echo "Loaded env from $ENV_FILE"
else
  echo "Warning: $ENV_FILE not found – using defaults"
fi

TAG="${TAG:-latest}"
FULL_IMAGE="${IMAGE_NAME}:${TAG}"

do_build() {
  echo "Building $FULL_IMAGE …"
  docker build -t "$FULL_IMAGE" .
  echo "Built $FULL_IMAGE"
}

do_push() {
  echo "Pushing $FULL_IMAGE …"
  docker push "$FULL_IMAGE"
  echo "Pushed $FULL_IMAGE"
}

case "$ACTION" in
  build)
    do_build
    ;;
  push)
    do_push
    ;;
  release)
    do_build
    do_push
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Usage: docker.sh <build|push|release> [env-file]"
    exit 1
    ;;
esac
