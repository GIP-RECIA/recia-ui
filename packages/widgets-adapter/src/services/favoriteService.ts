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

import type { Config } from '../types/configTypes.ts'
import type {
  FavoriteContent,
  FavoriteLayout,
  LayoutApiResponse,
} from '../types/layoutTypes.ts'
import type { PortletFromRegistry } from '../types/registryTypes.ts'
import type { Widget, WidgetItem } from '../types/widgetTypes.ts'
import { getServiceLink } from '../utils/linkUtils.ts'

async function getLayout(
  url: string,
  timeout: number,
): Promise<LayoutApiResponse> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(timeout),
    })

    if (!response.ok)
      throw new Error(response.statusText)

    return await response.json()
  }
  catch (error) {
    console.error(error, url)
    throw error
  }
}

function getFavoriteFromLayout(
  layout: LayoutApiResponse,
): Array<string> | undefined {
  const { authenticated, layout: { globals: { hasFavorites }, favorites } } = layout
  if (authenticated && hasFavorites && favorites)
    return flattenFavorites(favorites)

  return undefined
}

function flattenFavorites(
  elem: Array<FavoriteLayout> | Array<FavoriteContent> | FavoriteLayout | FavoriteContent,
): Array<string> {
  const { content } = elem as FavoriteLayout
  const { chanID } = elem as FavoriteContent

  if (Array.isArray(elem))
    return elem.flatMap(flattenFavorites)

  if (content)
    return flattenFavorites(content)

  if (chanID)
    return [chanID]

  return []
}

function getItems(
  config: Config,
  services: PortletFromRegistry[],
  favoriteIds: number[],
): WidgetItem[] {
  return favoriteIds
    .map(id => services.find(service => service.id === id))
    .filter(service => service !== undefined)
    .map((portlet) => {
      return {
        id: portlet.fname,
        name: portlet.title,
        icon: portlet.parameters.iconUrl ? portlet.parameters.iconUrl.value : '',
        link: getServiceLink(
          config.global.context,
          portlet.fname,
          portlet?.parameters?.alternativeMaximizedLink?.value,
          portlet?.parameters?.alternativeMaximizedLinkTarget?.value,
        ),
        dispatchEvents: [
          {
            type: 'click-portlet-card',
            detail: {
              fname: portlet.fname,
            },
          },
        ],
      }
    })
}

async function getFavoriteWidget(
  config: Config,
  services: PortletFromRegistry[] | undefined,
): Promise<Partial<Widget>> {
  if (!services)
    return {}

  const layout = await getLayout(
    config.favoris.favorisUri,
    config.global.timeout,
  )
  const items = getItems(
    config,
    services,
    [...new Set(getFavoriteFromLayout(layout)?.map(Number))],
  )

  return {
    items,
  }
}

export {
  getFavoriteWidget,
}
