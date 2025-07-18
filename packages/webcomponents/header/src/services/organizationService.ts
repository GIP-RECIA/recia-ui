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

import type { Organization, OrganizationApiResponse } from '../types/OrganizationType.ts'
import type { Soffit } from '../types/SoffitType.ts'

export default class OrganizationService {
  static async get(
    soffit: Soffit,
    orgApiUrl: string,
    orgId: string,
  ): Promise<Organization | undefined> {
    try {
      const { token } = soffit

      const getParams = new URLSearchParams({ ids: orgId })
      const response = await fetch(`${orgApiUrl}?${getParams}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const org: Record<string, OrganizationApiResponse> = await response.json()

      if (!org[orgId]) {
        console.info('No organization found')
        return undefined
      }

      const { displayName, otherAttributes } = org[orgId]
      const orgInfos: Organization = {
        displayName,
        logo: otherAttributes.ESCOStructureLogo[0] as string,
      }

      if (!orgInfos.displayName) {
        console.info('Missing organization information')
        return undefined
      }
      else {
        return orgInfos
      }
    }
    catch (err) {
      console.error(err, orgApiUrl)
      return undefined
    }
  }
}
