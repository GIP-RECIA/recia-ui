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

import type { Response } from '@uportal/open-id-connect'
import type { Soffit } from '../types/index.ts'
import oidc from '@uportal/open-id-connect'
import UserActionService from './userActionService.ts'

export default class SoffitService {
  static loading: boolean = false
  static timeout: ReturnType<typeof setTimeout> | null = null
  static timeoutDefault: number = 60000
  static timeoutDelay: number = SoffitService.timeoutDefault

  static async get(
    userInfoApiUrl: string,
  ): Promise<Soffit | undefined> {
    SoffitService.loading = true
    try {
      const response: Response = await oidc({ userInfoApiUrl })
      const { encoded, decoded } = response

      const timeout = (decoded.exp - decoded.iat - 5) * 1000
      SoffitService.timeoutDelay = timeout > 0
        ? timeout
        : SoffitService.timeoutDefault
      SoffitService.loading = false

      return {
        ...decoded,
        token: `Bearer ${encoded}`,
        authenticated: !decoded.sub.startsWith('guest'),
      }
    }
    catch (err) {
      SoffitService.loading = false
      console.error(err, userInfoApiUrl)
      return undefined
    }
  }

  static renew(update: () => Promise<void>): void {
    if (SoffitService.timeout)
      clearTimeout(SoffitService.timeout)
    SoffitService.timeout = setTimeout(
      () => {
        if (
          UserActionService.hasUserAction
          && !SoffitService.loading
        ) {
          update()
        }
        else {
          SoffitService.timeout = null
        }
      },
      SoffitService.timeoutDelay,
    )
  }
}
