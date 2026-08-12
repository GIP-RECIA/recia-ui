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

import type { Notif, Soffit } from '../types/index.ts'
import UserActionService from './userActionService.ts'

export default class NotificationService {
  static loading: boolean = false
  static timeout: ReturnType<typeof setTimeout> | null = null
  static timeoutDefault: number = 60000
  static timeoutDelay: number = NotificationService.timeoutDefault

  static async getAll(
    soffit: Soffit,
    notificationsApiUrl: string,
  ): Promise<Notif[] | undefined> {
    try {
      const { token } = soffit

      const response = await fetch(notificationsApiUrl, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok)
        throw new Error(response.statusText)

      return await response.json()
    }
    catch (err) {
      console.error(err, notificationsApiUrl)
      return undefined
    }
  }

  static refresh(update: () => Promise<void>): void {
    if (NotificationService.timeout)
      clearTimeout(NotificationService.timeout)
    NotificationService.timeout = setTimeout(
      () => {
        if (
          UserActionService.hasUserAction
          && !NotificationService.loading
        ) {
          update()
        }
        else {
          NotificationService.timeout = null
        }
      },
      NotificationService.timeoutDelay,
    )
  }

  static async action(
    soffit: Soffit,
    notificationActionApiUrl: string,
    notifIds: string[],
  ): Promise<boolean> {
    try {
      const { token } = soffit
      const params = new URLSearchParams()
      params.append('notifIds', notifIds.toString())

      const response = await fetch(`${notificationActionApiUrl}?${params}`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok)
        throw new Error(response.statusText)

      return true
    }
    catch (err) {
      console.error(err, notificationActionApiUrl)
      return false
    }
  }
}
