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

import type { PortletFromRegistry } from '../types/registryTypes.ts'
import type {
  ProfilsConfig,
  WidgetsWrapperConfig,
} from '../types/widgetTypes.ts'
import { WidgetKey } from '../types/widgetTypes.ts'
import { getServiceLink } from '../utils/linkUtils.ts'

export class ConfigService {
  static async getWidgetsWrapperConfig(
    url: string,
    ENTPersonProfils: string[],
    services: Array<PortletFromRegistry> | undefined,
  ): Promise<WidgetsWrapperConfig> {
    if (!services)
      services = []

    try {
      ENTPersonProfils = ENTPersonProfils.map(profil => profil.toLocaleLowerCase())

      const response = await fetch(url, {
        method: 'GET',
      })

      if (!response.ok)
        throw new Error('Unable to get population config')

      const populationConfigs: ProfilsConfig[] = await response.json()

      const { allowedKeys, requiredKeys, defaultKeys } = populationConfigs
        .filter(conf =>
          conf.ENTPersonProfils.some(profil =>
            ENTPersonProfils.includes(profil.toLocaleLowerCase()),
          ),
        )
        .reduce(
          (acc, { allowedKeys, requiredKeys, defaultKeys }) => {
            acc.allowedKeys.push(...allowedKeys)
            acc.requiredKeys.push(...requiredKeys)
            acc.defaultKeys.push(...defaultKeys)

            return acc
          },
          {
            allowedKeys: new Array<string>(),
            requiredKeys: new Array<string>(),
            defaultKeys: new Array<string>(),
          },
        )

      const allowedFnames = [
        WidgetKey.FAVORITE,
        ...services.map(service => service.fname),
      ]

      const filterdConfig = {
        allowedKeys: [...new Set(allowedKeys)].filter(key => allowedFnames.includes(key)),
        requiredKeys: [...new Set(requiredKeys)].filter(key => allowedFnames.includes(key)),
        defaultKeys: [...new Set(defaultKeys)].filter(key => allowedFnames.includes(key)),
      }

      const availableWidgets = [
        ...services
          .filter(({ fname }) => filterdConfig.allowedKeys.includes(fname))
          .map((portlet) => {
            return {
              uid: portlet.fname,
              name: portlet.title,
              link: getServiceLink(
                window.WidgetAdapter.config.global.context,
                portlet.fname,
                portlet.parameters?.alternativeMaximizedLink?.value as unknown as string | undefined,
                portlet.parameters?.alternativeMaximizedLinkTarget?.value as unknown as string | undefined,
              ),
            }
          })
          ?? [],
        {
          uid: WidgetKey.FAVORITE,
          name: WidgetKey.FAVORITE,
        },
      ]

      return {
        ...filterdConfig,
        availableWidgets,
      }
    }
    catch (error: any) {
      console.error(error.message)
      throw error
    }
  }
}
