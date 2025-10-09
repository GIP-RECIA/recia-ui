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

import type { Config } from './types/configTypes.ts'
import type { PortletFromRegistry } from './types/registryTypes.ts'
import type { Widget, WidgetsWrapperConfig } from './types/widgetTypes.ts'
import { version } from '../package.json'
import { ConfigService } from './services/configService.ts'
import { getDocumentsWidget } from './services/documentsService.ts'
import { getEsidocWidget } from './services/esidocService.ts'
import { getFavoriteWidget } from './services/favoriteService.ts'
import { getMediacentreWidget } from './services/mediacentreService.ts'
import PortletService from './services/portletService.ts'
import { WidgetKey } from './types/widgetTypes.ts'
import 'regenerator-runtime/runtime.js'

class WidgetAdapter {
  config: Config

  services?: Array<PortletFromRegistry>

  widgetWrapperConfig?: WidgetsWrapperConfig

  widgetHandlers: Record<string, (soffit: string) => Promise<Partial<Widget>>> = {
    [WidgetKey.FAVORITE]: _ => getFavoriteWidget(this.config, this.services),
    [WidgetKey.MEDIACENTRE]: soffit => getMediacentreWidget(this.config, soffit),
    [WidgetKey.DOCUMENTS]: soffit => getDocumentsWidget(this.config, soffit),
    [WidgetKey.ESIDOC]: soffit => getEsidocWidget(this.config, soffit),
  }

  constructor(config: Config) {
    this.config = config
    this.init()
  }

  async init(): Promise<void> {
    this.services = await PortletService.getAll(this.config.global.portletRegistryUri)
    if (this.services)
      document.dispatchEvent(new CustomEvent('init-widget'))
  }

  getVersion(): string {
    return version
  }

  async getConfig(
    ENTPersonProfils: Array<string>,
  ): Promise<WidgetsWrapperConfig> {
    if (!this.widgetWrapperConfig) {
      this.widgetWrapperConfig = await ConfigService.getWidgetsWrapperConfig(
        this.config.global.populationsKeysUri,
        ENTPersonProfils.map(profil => profil.toLocaleLowerCase()),
        this.services,
      )
    }

    return this.widgetWrapperConfig
  }

  async getWidget(key: string, soffit: string): Promise<Widget> {
    const baseData = this.widgetWrapperConfig!.availableWidgets.find(({ uid }) => uid === key)!
    const complementaryData = await this.widgetHandlers[key](soffit)
    const widgetData: Widget = {
      ...baseData,
      ...complementaryData,
    }

    return widgetData
  }
}

(async function (): Promise<void> {
  const url = new URL(import.meta.url).searchParams.get('configUri')
  if (!url) {
    console.error('"configUri" is not defined')
    return
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
    })

    if (!response.ok)
      throw new Error(response.statusText)

    window.WidgetAdapter = new WidgetAdapter(await response.json())
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (_: any) {
    console.error('Unable to get config')
  }
})()

declare global {
  interface Window {
    WidgetAdapter: WidgetAdapter
  }
}
