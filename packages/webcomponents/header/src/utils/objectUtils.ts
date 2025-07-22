/**
 * Copyright (C) 2025 GIP-RECIA, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function difference<T extends object>(
  newValue: Partial<T> | undefined,
  oldValue: Partial<T> | undefined,
): Map<keyof T, T[keyof T]> {
  const differences = new Map<keyof T, T[keyof T]>()

  const mapNewValue = new Map<keyof T, T[keyof T]>(Object.entries(newValue ?? {}) as [keyof T, T[keyof T]][])
  const mapOldValue = new Map<keyof T, T[keyof T]>(Object.entries(oldValue ?? {}) as [keyof T, T[keyof T]][])

  mapNewValue.forEach((value, key) => {
    if (!mapOldValue.get(key))
      differences.set(key, value)
    else if (mapOldValue.get(key) !== value)
      differences.set(key, value)
  })

  return differences
}

export {
  difference,
}
