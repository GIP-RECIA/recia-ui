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
  FavoriteContent,
  FavoriteLayout,
  LayoutApiResponse,
  Soffit,
} from '../types/index.ts'

export default class FavoritesService {
  static getFromLayout(
    layout: LayoutApiResponse,
  ): string[] | undefined {
    const { authenticated, layout: { globals: { hasFavorites }, favorites } } = layout
    if (authenticated && hasFavorites && favorites)
      return FavoritesService.flattenFavorites(favorites)

    return undefined
  }

  private static flattenFavorites(
    elem: FavoriteLayout[] | FavoriteContent[] | FavoriteLayout | FavoriteContent,
  ): string[] {
    const { content } = elem as FavoriteLayout
    const { chanID } = elem as FavoriteContent

    if (Array.isArray(elem))
      return elem.flatMap(FavoritesService.flattenFavorites)

    if (content)
      return FavoritesService.flattenFavorites(content)

    if (chanID)
      return [chanID]

    return []
  }

  private static async toggle(
    soffit: Soffit,
    favoriteApiUrl: string,
    action: 'addFavorite' | 'removeFavorite',
    channelId: string | number,
  ): Promise<boolean> {
    try {
      const { token } = soffit

      if (typeof channelId === 'number')
        channelId = channelId.toString()
      const getParams = new URLSearchParams({ action, channelId })
      const response = await fetch(`${favoriteApiUrl}?${getParams}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok)
        throw new Error(response.statusText)

      return true
    }
    catch (err) {
      console.error(err)
      return false
    }
  }

  static async add(
    soffit: Soffit,
    favoriteApiUrl: string,
    channelId: string | number,
  ): Promise<boolean> {
    return await FavoritesService.toggle(soffit, favoriteApiUrl, 'addFavorite', channelId)
  }

  static async remove(
    soffit: Soffit,
    favoriteApiUrl: string,
    channelId: string | number,
  ): Promise<boolean> {
    return await FavoritesService.toggle(soffit, favoriteApiUrl, 'removeFavorite', channelId)
  }
}
