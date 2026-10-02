#!/usr/bin/env bash
# Renders public/og.png (1200 × 630), the picture link previews show, from scripts/og/og.html.
# Needs Chromium. Run from anywhere: bash scripts/og/render.sh
set -euo pipefail
dir="$(cd "$(dirname "$0")" && pwd)"
chromium --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --force-device-scale-factor=1 \
  --screenshot="$dir/../../public/og.png" "file://$dir/og.html"
