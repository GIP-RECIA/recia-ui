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

import type { TemplateResult } from 'lit'
import { localized, msg, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import { WidgetData } from './classes/WidgetData.ts'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { DOCUMENTS_PUBLISHER, FAVORIS_MEDIACENTRE, FAVORIS_PORTAIL } from './utils/constants.ts'
import { setLocale } from './utils/localizationUtils.ts'
import { getToken } from './utils/soffitUtils.ts'
import 'widget/dist/r-widget.js'

const tagName = componentName(name)

declare global {
  interface Window {
    WidgetAdapter: any
  }
}

@localized()
@customElement(tagName)
export class ReciaWidgetsWrapper extends LitElement {
  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)

    addEventListener('DOMContentLoaded', async () => {
      this.widgetKeyArray = this.widgetKeysString.split(';')
      const soffit: string = await getToken(import.meta.env.VITE_USER_RIGHTS_URI)
      for (const value of this.widgetKeyArray) {
        this.buildWidget(value, soffit)
      }
    })
  }

  @property({ type: String, attribute: 'widget-keys' })
  widgetKeysString = ''

  widgetKeyArray: Array<string> = []

  async buildWidget(key: string, soffit: string) {
    const itemsAsString: string = await this.getWidgetData(key, soffit)
    const widgetData: WidgetData = JSON.parse(itemsAsString)
    this.widgetDataMap.set(key, widgetData)
    this.requestUpdate()
  }

  async getWidgetData(key: string, soffit: string): Promise<string> {
    return await window.WidgetAdapter.getJsonForWidget(key, soffit)
  }

  @state()
  widgetDataMap: Map<string, WidgetData> = new Map()

  getWidgetRender(key: string): TemplateResult {
    if (this.widgetDataMap.has(key)) {
      const widgetData: WidgetData = this.widgetDataMap.get(key)!
      return html`
      <r-widget
        role="listitem"
        name="${widgetData.name}"
        link="${widgetData.link}"
        target="${widgetData.target}"
        rel="${widgetData.rel}"
        empty-text="${widgetData.emptyText}"
        items=${widgetData.items}
        >
      </r-widget>
    `
    }
    // valeur par défaut temporaire
    return html`
          <r-widget
            role="listitem"
            name="Favoris"
            link="#1"
            items='[
              {
                "name": "Carte mentale",
                "link": "#A"
              },
              {
                "name": "Capytale",
                "link": "#B"
              },
              {
                "name": "Espaces Nextcloud",
                "link": "#C"
              },
              {
                "name": "Platforme vidéo",
                "link": "#D"
              }
            ]'
          >
          </r-widget>`
  }

  render(): TemplateResult {
    return html`
      <div class="widget">
        <header>
          <h2 class="sr-only">Accès rapides</h2>
        </header>
        <ul class="widget-tiles">
          ${repeat(
            this.widgetKeyArray,
            (widgetKey: string) => widgetKey,
            (widgetKey: string) => html`
            ${this.getWidgetRender(widgetKey)}
            `,
          )}
        </ul>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaWidgetsWrapper
  }
}
