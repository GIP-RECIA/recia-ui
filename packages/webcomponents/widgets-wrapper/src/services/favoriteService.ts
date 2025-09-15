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

export default class FavoriteService {
  static async getUserFavoriteWidgets(
    url: string,
  ): Promise<{ prefs: Array<string>, noStoredPrefs: boolean } | undefined> {
    try {
      const response = await fetch(url, {
        method: 'GET',
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const json = await response.json()

      return {
        prefs: json.displayedKeys !== undefined ? json.displayedKeys : [],
        noStoredPrefs: json.displayedKeys === undefined,
      }
    }
    catch (error: any) {
      console.error(error.message)
      return undefined
    }
  }

  static async setUserFavoriteWidgets(
    url: string,
    keys: Array<string>,
  ): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify({ displayedKeys: keys }),
      })

      if (!response.ok)
        throw new Error(`Response status: ${response.status}`)
    }
    catch (error: any) {
      console.error(error.message)
    }
  }
}
