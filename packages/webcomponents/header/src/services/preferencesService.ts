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

export default class PreferencesService {
  static async get(
    preferencesApiUrl: string,
  ): Promise<Record<string, any> | undefined> {
    try {
      const response = await fetch(preferencesApiUrl, {
        method: 'GET',
      })

      if (!response.ok)
        throw new Error(response.statusText)

      return await response.json()
    }
    catch (error) {
      console.error(error, preferencesApiUrl)
      return undefined
    }
  }

  static async put(
    preferencesApiUrl: string,
    body: Record<string, any>,
  ): Promise<void | undefined> {
    try {
      const response = await fetch(preferencesApiUrl, {
        method: 'PUT',
        body: JSON.stringify(body),
      })

      if (!response.ok)
        throw new Error(response.statusText)
    }
    catch (error) {
      console.error(error, preferencesApiUrl)
      return undefined
    }
  }
}
