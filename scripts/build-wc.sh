#!/bin/bash

# Copyright (C) 2025 GIP-RECIA, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -euo pipefail

ROOT_DIR=$(pwd)
SOURCE_DIR="$ROOT_DIR/packages/webcomponents"
TARGET_DIR="$ROOT_DIR/packages/ui-webcomponents"
PREFIX="r-"

error=false

echo "🚀 Démarrage du build des webcomponents..."

mkdir -p "$TARGET_DIR/dist" "$TARGET_DIR/docs"
rm -rf "$TARGET_DIR/dist"/* "$TARGET_DIR/docs"/*

for dir in "$SOURCE_DIR"/*/; do
  if [ -f "${dir}package.json" ]; then
    echo ""
    echo "📦 Build de $(basename "$dir")"

    pushd "$dir" > /dev/null
    if yarn build; then
      cp dist/*.js* "$TARGET_DIR/dist" 2>/dev/null
      cp README.md "$TARGET_DIR/docs/$PREFIX$(basename "$dir").md" 2>/dev/null
    else
      error=true
    fi
    popd > /dev/null
  fi
done

echo ""
if $error; then
  echo "❌️ Echec du build pour un ou plusieurs packages"
  exit 1
else
  echo "✅ Build terminé avec succès"
fi
