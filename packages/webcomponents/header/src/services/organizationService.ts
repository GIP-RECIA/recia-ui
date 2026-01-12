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

import type {
  Organization,
  OrganizationApiResponse,
  Organizations,
  Soffit,
} from '../types/index.ts'
import { attributeSeparator } from '../config.ts'
import { $debug } from '../stores/index.ts'
import { getAs } from '../utils/objectUtils.ts'

export default class OrganizationService {
  static async get(
    soffit: Soffit,
    orgApiUrl: string,
    orgIds: string[],
    currentOrgId: string,
    typeAttribute: string,
    logoAttribute: string,
    postalCodeAttribute: string,
    streetAttribute: string,
    cityAttribute: string,
    mailAttribute: string,
    phoneAttribute: string,
    websiteAttribute: string,
  ): Promise<Organizations | undefined> {
    try {
      const debug = $debug.get()
      const { token } = soffit

      const getParams = new URLSearchParams({ ids: orgIds.toString() })
      const response = await fetch(`${orgApiUrl}?${getParams}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const orgs: Record<string, OrganizationApiResponse> = await response.json()

      if (!orgs || !orgs[currentOrgId]) {
        if (debug) {
          // eslint-disable-next-line no-console
          console.info('No organization found')
        }
        return undefined
      }

      const mappedOrgs: Organization[] = Object.values(orgs).map((org) => {
        const { id, name, displayName, description, code } = org

        const postalCode = getAs<string>(org, postalCodeAttribute)
        const street = getAs<string>(org, streetAttribute)?.replaceAll(attributeSeparator, ' ').trim()
        const city = getAs<string>(org, cityAttribute)

        let adress: string | undefined
        if (postalCode && street && city)
          adress = `${street}, ${postalCode} ${city}`

        return {
          id,
          name,
          displayName,
          description,
          code,
          source: getAs<string>(org, typeAttribute),
          logo: getAs<string>(org, logoAttribute),
          adress,
          mail: getAs<string>(org, mailAttribute),
          phone: getAs<string>(org, phoneAttribute),
          website: getAs<string>(org, websiteAttribute),
        }
      })

      const currentOrg = mappedOrgs.filter(org => org.id === currentOrgId)[0]

      if (!currentOrg.displayName) {
        if (debug) {
          // eslint-disable-next-line no-console
          console.info('Missing organization information')
        }
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
