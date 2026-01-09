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

import type { Category, Service, Soffit } from '../types/index.ts'
import { CategoryKey } from '../types/index.ts'
import { getServiceLink } from '../utils/linkUtils.ts'
import { truncate } from '../utils/stringUtils.ts'
import InfoService from './infoService.ts'
import PortletService from './portletService.ts'

export default class ServicesService {
  static async get(
    soffit: Soffit,
    portletApiUrl: string,
    servicesInfoApiUrl: string,
  ): Promise<
    {
      services: Service[]
      categories: Category[]
    }
    | undefined
  > {
    const [portletsData, portletsInfo] = await Promise.all([
      PortletService.getAll(soffit, portletApiUrl),
      InfoService.getAll(servicesInfoApiUrl),
    ])

    if (!portletsData)
      return undefined

    const { portlets, categories } = portletsData

    const services: Array<Service> = portlets.map((portlet) => {
      const {
        id,
        fname,
        name,
        title,
        description,
        parameters: {
          iconUrl,
          alternativeMaximizedLink,
          alternativeMaximizedLinkTarget,
        },
        categories,
      } = portlet
      const {
        categoriePrincipale,
        doesInfoExist,
        newService,
      } = portletsInfo
        ? (portletsInfo.find(el => el.fname === fname) ?? {})
        : {}
      const category = categoriePrincipale && Object.values(CategoryKey).includes(categoriePrincipale)
        ? categoriePrincipale
        : undefined

      let keywords: Array<string> = description.split('   ')
      keywords.shift()
      keywords = keywords.filter(val => val.trim().length > 0)
      if (keywords.length > 0)
        keywords = keywords[0].split(', ')
      else
        keywords = []
      keywords.push(name)

      return {
        id,
        fname,
        name: title,
        category,
        categories,
        iconUrl: iconUrl?.value,
        link: getServiceLink(
          fname,
          alternativeMaximizedLink?.value,
          alternativeMaximizedLinkTarget?.value,
        ),
        description: truncate(description),
        keywords,
        new: newService,
        favorite: false,
        more: doesInfoExist,
      }
    })

    return {
      services,
      categories,
    }
  }
}
