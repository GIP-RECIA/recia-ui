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

import type { Service, Soffit } from '../types/index.ts'
import { $settings } from '../stores/index.ts'
import { Category } from '../types/index.ts'
import { getServiceLink } from '../utils/linkUtils.ts'
import { truncate } from '../utils/stringUtils.ts'
import InfoService from './infoService.ts'
import PortletService from './portletService.ts'

export default class ServicesService {
  static async get(
    soffit: Soffit,
    portletApiUrl: string,
    servicesInfoApiUrl: string,
  ): Promise<Array<Service> | undefined> {
    const [portlets, portletsInfo] = await Promise.all([
      PortletService.getAll(soffit, portletApiUrl),
      InfoService.getAll(servicesInfoApiUrl),
    ])

    if (!portlets || !portletsInfo)
      return undefined

    const { contextApiUrl } = $settings.get()
    const services: Array<Service> = portlets.map((portlet) => {
      const {
        id,
        fname,
        title,
        description,
        parameters: {
          iconUrl,
          alternativeMaximizedLink,
          alternativeMaximizedLinkTarget,
        },
      } = portlet
      const {
        categoriePrincipale,
        doesInfoExist,
      } = portletsInfo.find(el => el.fname === fname) ?? {}
      const category = categoriePrincipale && Object.values(Category).includes(categoriePrincipale)
        ? categoriePrincipale
        : undefined

      let keywords: Array<string> | undefined = description.split('   ')
      keywords.shift()
      keywords = keywords.filter(val => val.trim().length > 0)
      if (keywords.length > 0)
        keywords = keywords[0].split(', ')
      else
        keywords = undefined

      return {
        id,
        fname,
        name: title,
        category,
        iconUrl: iconUrl?.value,
        link: getServiceLink(
          fname,
          alternativeMaximizedLink?.value,
          alternativeMaximizedLinkTarget?.value,
        ),
        description: truncate(description),
        keywords,
        favorite: false,
        more: doesInfoExist,
      }
    })

    return services
  }
}
