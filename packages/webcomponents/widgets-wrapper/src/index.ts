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
import { Item } from './classes/Item.ts'
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
    this.widgetKeyArray.push(FAVORIS_PORTAIL)
    this.widgetKeyArray.push(FAVORIS_MEDIACENTRE)
    this.widgetKeyArray.push(DOCUMENTS_PUBLISHER)

    addEventListener('DOMContentLoaded', async () => {
      const soffit: string = await getToken(import.meta.env.VITE_USER_RIGHTS_URI)
      for (const value of this.widgetKeyArray) {
        this.buildWidget(value, soffit)
      }
    })
  }

  widgetKeyArray: Array<string> = []

  async buildWidget(key: string, soffit: string) {
    let itemsAsString: string = await this.getWidgetData(key, soffit)
    itemsAsString = this.itemsAsStringLinksProcessing(itemsAsString, key)
    itemsAsString = this.itemsAsStringIconsProcessing(itemsAsString, key)
    const name: string = await this.getWidgetName(key)
    const widgetData: WidgetData = new WidgetData(name, '', '#key', '', false, itemsAsString)
    this.widgetDataMap.set(key, widgetData)
    this.requestUpdate()
  }

  async getWidgetData(key: string, soffit: string): Promise<string> {
    switch (key) {
      case FAVORIS_PORTAIL:
        return await window.WidgetAdapter.getFavorisPortail()

      case FAVORIS_MEDIACENTRE:
        return await window.WidgetAdapter.getFavorisMediacentre(soffit)

      case DOCUMENTS_PUBLISHER:
        return await window.WidgetAdapter.getDocumentsPublisher(soffit)
      default:
        return ''
    }
  }

  itemsAsStringLinksProcessing(itemsAsString: string, key: string): string {
    switch (key) {
      case FAVORIS_PORTAIL:
      { const itemArray: Array<Item> = JSON.parse(itemsAsString)
        const favorisLinkPattern: string = import.meta.env.VITE_FAVORIS_LINK_PATTERN
        const itemArrayModified: Array<Item> = itemArray.map(v => new Item(v.name, favorisLinkPattern.replace('{fname}', v.link), v.icon))
        return JSON.stringify(itemArrayModified)
      }

      default:
        return itemsAsString
    }
  }

  itemsAsStringIconsProcessing(itemsAsString: string, key: string): string {
    switch (key) {
      case FAVORIS_PORTAIL:
      {
        const itemArray: Array<Item> = JSON.parse(itemsAsString)
        const favorisLinkPattern: string = import.meta.env.VITE_FAVORIS_ICON_PATTERN
        const itemArrayModified: Array<Item> = itemArray.map(v => v.icon !== undefined ? new Item(v.name, v.link, favorisLinkPattern.replace('{icon}', v.icon)) : new Item(v.name, v.link, v.icon))
        return JSON.stringify(itemArrayModified)
      }
      default:
        return itemsAsString
    }
  }

  async getWidgetName(key: string): Promise<string> {
    switch (key) {
      case FAVORIS_PORTAIL:
        return msg('Favoris')

      case FAVORIS_MEDIACENTRE:
      { const url = 'https://lycees.test.recia.dev/portail/api/portlet/Mediacentre.json'
        try {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
          }

          const json = await response.json()
          return (json.portlet.title)
        }
        catch (error) {
          console.error(error.message)
          return msg('Médiacentre')
        }
      }

      case DOCUMENTS_PUBLISHER:
      { const url = 'https://lycees.test.recia.dev/portail/api/portlet/DocumentsEtab.json'
        try {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
          }

          const json = await response.json()
          return (json.portlet.title)
        }
        catch (error) {
          console.error(error.message)
          return msg('Documents')
        }
      }

      default:
        console.error(`clé inconnue ${key}`)
        return ''
    }
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
