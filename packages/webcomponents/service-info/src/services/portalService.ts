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

import type { ReciaServiceInfoLayout } from '../components/layout/index.ts'
import type { Portlet } from '../types/PortletType.ts'
import pathHelper from '../helpers/pathHelper.ts'

export default class portalService {
  static async get(
    portalInfoApiUrl: string,
    domain: string,
    portalPath: string,
  ): Promise<Partial<ReciaServiceInfoLayout> | null> {
    try {
      const options = {
        method: 'GET',
      }

      const response = await fetch(portalInfoApiUrl, options)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const data: { portlet?: Portlet } = await response.json()

      if (data.portlet) {
        const {
          title,
          iconUrl,
          fname,
          parameters: { alternativeMaximizedLink, alternativeMaximizedLinkTarget },
        } = data.portlet

        return {
          'icon-url': iconUrl,
          'name': title,
          'launch-link': {
            href: alternativeMaximizedLink ?? pathHelper.getUrl(`${portalPath}/p/${fname}`, domain),
            target: alternativeMaximizedLinkTarget ?? '_self',
            rel: alternativeMaximizedLink ? 'noopener noreferrer' : undefined,
          },
        }
      }
      else {
        console.error(`No data for ${portalInfoApiUrl}`)
      }
    }
    catch (err) {
      console.error(err, portalInfoApiUrl)
      return null
    }
    return null
  }
}
