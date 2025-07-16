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

export default class pathHelper {
  static getUrl(path: string, baseUrl = '', debug = false): string {
    if (path.startsWith('http'))
      return path

    baseUrl = baseUrl !== ''
      ? baseUrl
      : import.meta.env.VITE_PORTAL_BASE_URL ?? ''
    if (baseUrl !== '' && !baseUrl.startsWith('http'))
      baseUrl = `${debug ? 'http' : 'https'}://${baseUrl}`

    return baseUrl + path
  }

  static isCurrentPage(link: string): boolean {
    const { pathname, origin, href } = window.location

    if (link.startsWith('#') || link === '')
      return new URL(href).pathname === pathname

    return new URL(link, origin).pathname === pathname
  }
}
