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

import { $authenticated, renewSoffitAndSession } from '../stores/index.ts'

export default class UserActionService {
  static hasUserAction: boolean = false
  static timeout: ReturnType<typeof setTimeout> | null = null
  static timeoutDelay: number = 120000

  static userAction(e: Event): void {
    const authenticated = $authenticated.get()
    if (
      !authenticated
      || (
        e.type === 'visibilitychange'
        && document.visibilityState === 'hidden'
      )
    ) {
      return
    }

    renewSoffitAndSession()
    if (UserActionService.timeout)
      return

    UserActionService.hasUserAction = true
    UserActionService.timeout = setTimeout(
      () => {
        UserActionService.hasUserAction = false
      },
      UserActionService.timeoutDelay,
    )
  }
}
