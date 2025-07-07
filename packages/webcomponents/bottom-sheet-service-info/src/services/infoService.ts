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

import type { Info } from '../types/InfoType.ts'
import { ServiceInfoLayout } from '../types/ServiceInfoLayoutType.ts'

export default class infoService {
  static async get(serviceInfoApiUrl: string): Promise<Partial<ServiceInfoLayout> | null> {
    try {
      const options = {
        method: 'GET',
      }

      const response = await fetch(serviceInfoApiUrl, options)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const data: Info = await response.json()

      if (data) {
        const { description, video_link, tutorials, resource_link } = data

        return {
          description,
          'video': video_link,
          tutorials,
          'tutorials-link': resource_link ? { href: resource_link } : undefined,
        }
      }
      else {
        console.error(`No data for ${serviceInfoApiUrl}`)
      }
    }
    catch (err) {
      console.error(err, serviceInfoApiUrl)
      return null
    }
    return null
  }
}
