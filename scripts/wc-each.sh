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

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <command>"
  echo "ex: $0 run lit-localize extract"
  exit 1
fi

command_parts=("$@")

excludes=()
for name in $(yarn workspaces list --json | jq -r 'select(.location | startswith("packages/webcomponents/") | not) | .name'); do
  excludes+=(--exclude "$name")
done

yarn workspaces foreach -A --topological-dev "${excludes[@]}" "${command_parts[@]}"
