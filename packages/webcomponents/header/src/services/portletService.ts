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
  Category,
  PortletCategory,
  PortletFromInfo,
  PortletFromRegistry,
  PortletRegistryApiResponse,
  ServiceInfoLayout,
  Soffit,
} from '../types/index.ts'
import { $services } from '../stores/index.ts'
import { getServiceLink } from '../utils/linkUtils.ts'

export default class PortletService {
  static async get(
    portalInfoApiUrl: string,
    fname?: string,
  ): Promise<Partial<ServiceInfoLayout> | undefined> {
    const services = $services.get()
    if (fname && services) {
      const service = services.find(service => service.fname === fname)
      if (service) {
        return {
          fname,
          'icon-url': service.iconUrl,
          'name': service.name,
          'launch-link': service.link,
        }
      }
    }

    try {
      const options = {
        method: 'GET',
      }

      const response = await fetch(portalInfoApiUrl, options)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const data: { portlet?: PortletFromInfo } = await response.json()

      if (data.portlet) {
        const {
          title,
          iconUrl,
          fname,
          parameters: { alternativeMaximizedLink, alternativeMaximizedLinkTarget },
        } = data.portlet

        return {
          fname,
          'icon-url': iconUrl,
          'name': title,
          'launch-link': getServiceLink(
            fname,
            alternativeMaximizedLink,
            alternativeMaximizedLinkTarget,
          ),
        }
      }
      else {
        console.error(`No data for ${portalInfoApiUrl}`)
      }
    }
    catch (err) {
      console.error(err, portalInfoApiUrl)
      return undefined
    }
    return undefined
  }

  static async getAll(
    soffit: Soffit,
    portletApiUrl: string,
  ): Promise<
    {
      portlets: PortletFromRegistry[]
      categories: Category[]
    }
    | undefined
  > {
    try {
      const { token } = soffit
      const response = await fetch(portletApiUrl, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const data: PortletRegistryApiResponse = await response.json()

      if (!data.registry.categories) {
        console.error(`No data for ${portletApiUrl}`)
        return undefined
      }

      return PortletService.extractPortletsAndCategories(data)
    }
    catch (err) {
      console.error(err, portletApiUrl)
      return undefined
    }
  }

  private static extractPortletsAndCategories(
    data: PortletRegistryApiResponse,
  ): {
    portlets: PortletFromRegistry[]
    categories: Category[]
  } {
    const portletMap = new Map<string, PortletFromRegistry>()
    const categoryMap = new Map<number, Category>()

    const walk = (category: PortletCategory) => {
      const id = Number(category.id.split('.')[1])
      categoryMap.set(
        id,
        {
          id,
          name: category.name,
          description: category.description,
        },
      )

      for (const portlet of category.portlets ?? []) {
        const existing = portletMap.get(portlet.fname)

        if (!existing) {
          portletMap.set(
            portlet.fname,
            {
              ...portlet,
              categories: [id],
            },
          )
        }
        else {
          existing.categories = Array.from(
            new Set([...existing.categories, id]),
          )
        }
      }

      for (const sub of category.subcategories ?? []) {
        walk(sub)
      }
    }

    for (const category of data.registry.categories) {
      walk(category)
    }

    return {
      portlets: Array.from(portletMap.values()),
      categories: Array.from(categoryMap.values()),
    }
  }
}
