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

import type { Portlet } from '../types/PortletType.ts'

export default class PortletService {
  static async get(
    portalInfoApiUrl: string,
  ): Promise<Partial<Portlet> | undefined> {
    try {
      const response = await fetch(portalInfoApiUrl, {
        method: 'GET',
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const data: { portlet?: Portlet } = await response.json()

      if (!data.portlet) {
        console.error(`No data for ${portalInfoApiUrl}`)
        return undefined
      }

      const { title } = data.portlet

      return {
        title,
      }
    }
    catch (err) {
      console.error(err, portalInfoApiUrl)
      return undefined
    }
  }
}
