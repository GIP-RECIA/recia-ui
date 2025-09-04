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

import { get, isEqual } from 'lodash-es'

function difference<T extends object>(
  newValue: Partial<T> | undefined,
  oldValue: Partial<T> | undefined,
): Map<keyof T, T[keyof T]> {
  const differences = new Map<keyof T, T[keyof T]>()
  if (newValue && oldValue === undefined)
    return new Map<keyof T, T[keyof T]>(Object.entries(newValue) as [keyof T, T[keyof T]][])

  const mapOldValue = new Map<keyof T, T[keyof T]>(Object.entries(oldValue ?? {}) as [keyof T, T[keyof T]][])

  for (const [key, value] of Object.entries(newValue ?? {}) as [keyof T, T[keyof T]][]) {
    const oldValue = mapOldValue.get(key)
    if (oldValue === undefined || !isEqual(oldValue, value))
      differences.set(key, value)
  }

  return differences
}

function getAs<T>(object: unknown, path: string): T | undefined
function getAs<T>(object: unknown, path: string, defaultValue: T): T

function getAs<T>(
  object: unknown,
  path: string,
  defaultValue?: T,
): T | undefined {
  return get(object, path, defaultValue)
}

export {
  difference,
  getAs,
}
