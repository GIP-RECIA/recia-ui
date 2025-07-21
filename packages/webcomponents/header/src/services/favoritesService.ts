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

export default class FavoritesService {
  static getFromLayout(
    layout: any,
  ): Array<any> | undefined {
    const { authenticated, layout: { globals: { hasFavorites }, favorites } } = layout
    if (authenticated && hasFavorites && favorites)
      return FavoritesService.flatten(favorites)

    return undefined
  }

  static flatten(favorites: any): Array<any> {
    if (Array.isArray(favorites))
      return favorites.flatMap(FavoritesService.flatten)

    if (favorites.content)
      return FavoritesService.flatten(favorites.content)

    if (favorites.fname)
      return [favorites]

    return []
  }
}
