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

import type { FilteredOrganization, Organization, OrganizationApiResponse } from '../types/OrganizationType.ts'
import type { Soffit } from '../types/SoffitType.ts'
import { get } from 'lodash-es'

export default class OrganizationService {
  static async get(
    soffit: Soffit,
    orgApiUrl: string,
    orgIds: Array<string>,
    currentOrgId: string,
    logoAttribute: string,
  ): Promise<FilteredOrganization | undefined> {
    try {
      const { token } = soffit

      const getParams = new URLSearchParams({ ids: orgIds.toString() })
      const response = await fetch(`${orgApiUrl}?${getParams}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const orgs: Record<string, OrganizationApiResponse> = await response.json()

      if (!orgs || !orgs[currentOrgId]) {
        console.info('No organization found')
        return undefined
      }

      const mappedOrgs: Array<Organization> = Object.values(orgs).map((org) => {
        const { id, name, displayName, description, otherAttributes } = org

        return {
          id,
          name,
          displayName,
          description,
          logo: get(otherAttributes, logoAttribute) as unknown as string,
        }
      })

      const currentOrg = mappedOrgs.filter(org => org.id === currentOrgId)[0]

      if (!currentOrg.displayName) {
        console.info('Missing organization information')
        return undefined
      }
      else {
        return {
          other: mappedOrgs.filter(org => org.id !== currentOrgId),
          current: currentOrg,
        }
      }
    }
    catch (err) {
      console.error(err, orgApiUrl)
      return undefined
    }
  }
}
