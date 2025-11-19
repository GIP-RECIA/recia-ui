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
import type { PortletFromRegistry } from '../types/registryTypes.ts'
import type {
  ProfilsConfig,
  WidgetsWrapperConfig,
} from '../types/widgetTypes.ts'
import { WidgetKey } from '../types/widgetTypes.ts'
import { getServiceLink } from '../utils/linkUtils.ts'

export class ConfigService {
  static async getWidgetsWrapperConfig(
    config: Config,
    ENTPersonProfils: string[],
    services: Array<PortletFromRegistry> | undefined,
  ): Promise<WidgetsWrapperConfig> {
    const { context, populationsKeysUri, overrideHandler } = config.global

    if (!services)
      services = []

    try {
      ENTPersonProfils = ENTPersonProfils.map(profil => profil.toLocaleLowerCase())

      const response = await fetch(populationsKeysUri, {
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
        allowedKeys: [...new Set(allowedKeys)].flatMap(
          key => allowedFnames.filter(fname => new RegExp(key).test(fname)),
        ),
        requiredKeys: [...new Set(requiredKeys)].flatMap(
          key => allowedFnames.filter(fname => new RegExp(key).test(fname)),
        ),
        defaultKeys: [...new Set(defaultKeys)].flatMap(
          key => allowedFnames.filter(fname => new RegExp(key).test(fname)),
        ),
      }

      const availableWidgets = [
        ...services
          .filter(({ fname }) => filterdConfig.allowedKeys.includes(fname))
          .map((portlet) => {
            const handler = Object.entries(overrideHandler)
              .find(([regex]) => new RegExp(regex).test(portlet.fname))?.[1]
              ?? portlet.fname

            return {
              uid: portlet.fname,
              name: portlet.title,
              link: getServiceLink(
                context,
                portlet.fname,
                portlet.parameters?.alternativeMaximizedLink?.value as unknown as string | undefined,
                portlet.parameters?.alternativeMaximizedLinkTarget?.value as unknown as string | undefined,
              ),
              handler,
            }
          })
          ?? [],
        {
          uid: WidgetKey.FAVORITE,
          name: WidgetKey.FAVORITE,
          handler: WidgetKey.FAVORITE,
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
