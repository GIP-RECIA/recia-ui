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
  MediacentreApiResponse,
  MediacentreConfigApiResponse,
  ServiceAndServiceResource,
  Soffit,
} from '../types/index.ts'
import { toBase64 } from '../utils/encodeUtils.ts'
import GroupsService from './groupsService.ts'
import PreferencesService from './preferencesService.ts'

export default class MediacentreService {
  private static async getConfig(
    soffit: Soffit,
    configUrl: string,
  ): Promise<MediacentreConfigApiResponse | undefined> {
    try {
      const { token } = soffit

      const response = await fetch(configUrl, {
        method: 'POST',
        headers:
        {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uais: [] }),
      })

      if (!response.ok)
        throw new Error(response.statusText)

      return await response.json()
    }
    catch (error) {
      console.error(error, configUrl)
      return undefined
    }
  }

  static async getFavorites(
    soffit: Soffit,
    groupsApiUrl: string,
    mediacentreConfigUrl: string,
    mediacentreFavoriteApiUrl: string,
    mediacentrePortalFavoriteApiUrlGet: string,
    mediacentreRedirectUrlPattern: string,
  ): Promise<ServiceAndServiceResource[] | undefined> {
    const [groups, config, prefs] = await Promise.all([
      GroupsService.get(soffit, groupsApiUrl),
      this.getConfig(soffit, mediacentreConfigUrl),
      PreferencesService.get(mediacentrePortalFavoriteApiUrlGet),
    ])
    if (!groups || !config || !prefs)
      return undefined

    const regExpArray = config.configListMap.groups.map(
      ({ value }) => new RegExp(value),
    )
    const filteredGroups = groups.groups
      .map(group => group.name)
      .filter(name => regExpArray.some(regex => regex.test(name)))

    const { mediacentreFavorites } = prefs

    try {
      const { token } = soffit

      const response = await fetch(mediacentreFavoriteApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isMemberOf: filteredGroups,
          favorites: mediacentreFavorites,
        }),
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const data: MediacentreApiResponse = await response.json()

      return data
        .sort((a, b) => mediacentreFavorites.indexOf(a.idRessource) - mediacentreFavorites.indexOf(b.idRessource))
        .map((ressource) => {
          const displayName: string = ressource.nomRessource
          const hasSpecialChar: boolean = displayName.match(/[^A-Z1-9]+/i) != null
          const displayNameForRedirection: string = hasSpecialChar
            ? toBase64(displayName)
            : displayName
          const href = mediacentreRedirectUrlPattern
            .replace('{fname}', ressource.idRessource)
            .replace('{name}', displayNameForRedirection)
            .replace('{b64}', hasSpecialChar.toString())

          return {
            id: ressource.idRessource,
            fname: 'Mediacentre',
            name: ressource.nomRessource,
            iconUrl: '/images/portlet_icons/Mediacentre.svg',
            link: {
              href,
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            dnmaName: ressource.typePresentation.code,
          }
        })
    }
    catch (error) {
      console.error(error, mediacentreFavoriteApiUrl)
      return undefined
    }
  }

  static async putFavorites(
    mediacentrePortalFavoriteApiUrlPut: string,
    items: ServiceAndServiceResource[],
  ): Promise<void> {
    PreferencesService.put(
      mediacentrePortalFavoriteApiUrlPut,
      {
        mediacentreFavorites: items.map(item => item.id),
      },
    )
  }
}
