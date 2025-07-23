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

import type { Soffit } from '../types/index.ts'

export default class ChangeEtabService {
  static async setEtab(
    soffit: Soffit,
    switchOrgApiUrl: string,
  ): Promise<string | undefined> {
    try {
      const { token } = soffit

      const response = await fetch(switchOrgApiUrl, {
        method: 'PUT',
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const data: { message: string, redirectUrl: string } = await response.json()

      if (!data.redirectUrl) {
        console.error(`No redirection URL for ${switchOrgApiUrl}`)
        return undefined
      }

      return data.redirectUrl
    }
    catch (err) {
      console.error(err, switchOrgApiUrl)
      return undefined
    }
  }
}
