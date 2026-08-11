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
import UserActionService from './userActionService.ts'

export default class SessionService {
  static loading: boolean = false
  static timeout: ReturnType<typeof setTimeout> | null = null
  static timeoutDefault: number = 60000
  static timeoutDelay: number = SessionService.timeoutDefault

  static async get(
    sessionApiUrl: string,
  ): Promise<Session | undefined> {
    SessionService.loading = true
    try {
      const response = await fetch(sessionApiUrl, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const data: { person: SessionApiResponse } = await response.json()

      if (!data.person) {
        console.error(`No data for ${sessionApiUrl}`)
        return undefined
      }

      const { sessionKey, timeoutMS } = data.person

      const timeout = timeoutMS - 5000
      SessionService.timeoutDelay = timeout > 0
        ? timeout
        : SessionService.timeoutDefault
      SessionService.loading = false

      return {
        key: sessionKey,
        timeout: timeoutMS,
        isConnected: sessionKey !== null,
      }
    }
    catch (err) {
      SessionService.loading = false
      console.error(err, sessionApiUrl)
      return undefined
    }
  }

  static renew(update: () => Promise<void>): void {
    if (SessionService.timeout)
      clearTimeout(SessionService.timeout)
    SessionService.timeout = setTimeout(
      () => {
        if (
          UserActionService.hasUserAction
          && !SessionService.loading
        ) {
          update()
        }
        else {
          SessionService.timeout = null
        }
      },
      SessionService.timeoutDelay,
    )
  }
}
