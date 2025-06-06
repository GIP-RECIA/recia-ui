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

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <nom-du-projet>"
  exit 1
fi

PROJECT_NAME="$1"
ROOT_DIR=$(pwd)
SOURCE_DIR="$ROOT_DIR/etc/webcomponent/project-skeleton"
DEST_BASE="$ROOT_DIR/packages/webcomponents"
DEST_DIR="$DEST_BASE/$PROJECT_NAME"

to_pascal_case() {
  echo "$1" | sed -E 's/(^|-)([a-z])/\U\2/g'
}

if [ -e "$DEST_DIR" ]; then
    echo "❌ Le dossier existe déjà."
    echo "   $DEST_DIR"
    exit 1
fi

cp -r "$SOURCE_DIR" "$DEST_DIR"

find "$DEST_DIR" -type f -exec sed -i \
    -e "s/project-skeleton/$PROJECT_NAME/g" \
    -e "s/ProjectSkeleton/$(to_pascal_case "$PROJECT_NAME")/g" {} +

cd $DEST_DIR
yarn
yarn run lit-localize extract
yarn run lit-localize build

echo "✅ Projet crée avec succès."
echo "   $DEST_DIR"
