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
  MediacentreApiResponse,
  MediacentreConfigApiResponse,
} from '../types/mediacentreTypes.ts'
import type { Widget, WidgetItem } from '../types/widgetTypes.ts'
import { WidgetKey } from '../types/widgetTypes.ts'
import { toBase64 } from '../utils/encodeUtils.ts'
import GroupService from './groupService.ts'
import PreferencesService from './preferencesService.ts'

async function getFavorites(
  url: string,
  favorites: string[],
  soffit: string,
  groupArray: string[],
  timeout: number,
): Promise<MediacentreApiResponse> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(timeout),
      headers: {
        'Authorization': `Bearer ${soffit}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isMemberOf: groupArray, favorites }),
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

async function getConfig(
  url: string,
  soffit: string,
  timeout: number,
): Promise<MediacentreConfigApiResponse> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(timeout),
      headers:
      {
        'Authorization': `Bearer ${soffit}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uais: [] }),
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

function getItems(
  config: Config,
  data: MediacentreApiResponse,
  mediacentreFavorites: any,
): WidgetItem[] {
  return data
    .sort((a, b) => mediacentreFavorites.indexOf(a.idRessource) - mediacentreFavorites.indexOf(b.idRessource))
    .map((item) => {
      const displayName: string = item.nomRessource
      const hasSpecialChar: boolean = displayName.match(/[^A-Z1-9]+/i) != null
      const displayNameForRedirection: string = hasSpecialChar
        ? toBase64(displayName)
        : displayName
      const href = config.mediacentre.redirectLinkPattern
        .replace('{fname}', item.idRessource)
        .replace('{name}', displayNameForRedirection)
        .replace('{b64}', hasSpecialChar.toString())

      return {
        id: item.idRessource,
        name: item.nomRessource,
        icon: '/images/portlet_icons/Mediacentre.svg',
        link: {
          href,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        dispatchEvents: [
          {
            type: 'click-portlet-card',
            detail: {
              fname: WidgetKey.MEDIACENTRE,
              SERVICE: item.typePresentation.code,
            },
          },
        ],
      }
    })
}

async function getMediacentreWidget(
  config: Config,
  soffit: string,
): Promise<Partial<Widget>> {
  const [groups, mConfig, prefs] = await Promise.all([
    GroupService.get(
      config.mediacentre.userRigthsApiUri,
      soffit,
      config.global.timeout,
    ),
    getConfig(
      config.mediacentre.apiConfigUri,
      soffit,
      config.global.timeout,
    ),
    PreferencesService.get(
      `${config.mediacentre.userFavorisApiUri}${WidgetKey.MEDIACENTRE}`,
      config.global.timeout,
    ),
  ])

  const regExpArray = mConfig.configListMap.groups.map(
    ({ value }) => new RegExp(value),
  )
  const filteredGroups = groups.groups
    .map(group => group.name)
    .filter(name => regExpArray.some(regex => regex.test(name)))

  const { mediacentreFavorites } = prefs

  const response = await getFavorites(
    config.mediacentre.apiFavorisUri,
    mediacentreFavorites,
    soffit,
    filteredGroups,
    config.global.timeout,
  )

  return {
    items: getItems(config, response, mediacentreFavorites),
  }
}

export {
  getMediacentreWidget,
}
