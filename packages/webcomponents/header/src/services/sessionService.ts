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

import type { Session, SessionApiResponse } from '../types/index.ts'

export default class SessionService {
  static async get(
    sessionApiUrl: string,
  ): Promise<Session | undefined> {
    try {
      const response = await fetch(sessionApiUrl, {
        method: 'GET',
        credentials: 'same-origin',
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const data: { person: SessionApiResponse } = await response.json()

      if (!data.person) {
        console.error(`No data for ${sessionApiUrl}`)
        return undefined
      }

      const { sessionKey, timeoutMS } = data.person

      return {
        key: sessionKey,
        timeout: timeoutMS,
        isConnected: sessionKey !== null,
      }
    }
    catch (err) {
      console.error(err, sessionApiUrl)
      return undefined
    }
  }
}
