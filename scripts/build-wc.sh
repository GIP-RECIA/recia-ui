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

excludes=()
for name in $(yarn workspaces list --json | jq -r 'select(.location | startswith("packages/webcomponents/") | not) | .name'); do
  excludes+=(--exclude "$name")
done

yarn workspaces foreach -A --topological-dev "${excludes[@]}" run build

ROOT_DIR=$(pwd)
SOURCE_DIR="$ROOT_DIR/packages/webcomponents"
TARGET_DIR="$ROOT_DIR/packages/ui-webcomponents"
PREFIX="r-"

mkdir -p "$TARGET_DIR/dist" "$TARGET_DIR/docs"
rm -rf "$TARGET_DIR/dist"/* "$TARGET_DIR/docs"/*

for dir in "$SOURCE_DIR"/*/; do
  if [ -f "${dir}package.json" ]; then
    cp "$dir"/dist/*.js* "$TARGET_DIR/dist" 2>/dev/null
    cp "$dir"/README.md "$TARGET_DIR/docs/$PREFIX$(basename "$dir").md" 2>/dev/null
  fi
done
