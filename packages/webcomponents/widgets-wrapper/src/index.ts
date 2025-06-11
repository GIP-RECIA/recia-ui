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
import type { WidgetData } from './classes/WidgetData.ts'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { isArray } from 'lodash-es'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
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
      if (import.meta.env.DEV) {
        await this.resetUserFavoriteWidgets()
      }

      // get all widgets keys known/accepted by the adapter
      this.allExistingKeys = window.WidgetAdapter.getKeys()

      let userFavoriteWidgetKeys: Array<string> = await this.getUserFavoriteWidgets()

      const userHasFavorties = userFavoriteWidgetKeys !== undefined && isArray(userFavoriteWidgetKeys) && userFavoriteWidgetKeys.length > 0

      const maxWidgets: number = import.meta.env.VITE_WIDGET_COUNT

      if (userHasFavorties) {
        const favInitialLenght: number = userFavoriteWidgetKeys.length
        userFavoriteWidgetKeys = userFavoriteWidgetKeys.filter(x => this.allExistingKeys.includes(x))

        // if user has more favorites than display max reduce favorites to max
        if (userFavoriteWidgetKeys.length > maxWidgets) {
          userFavoriteWidgetKeys = userFavoriteWidgetKeys.slice(0, maxWidgets)
        }

        // if user favorites has been edited by filter and/or slice, update it
        if (userFavoriteWidgetKeys.length !== favInitialLenght) {
          this.setUserFavoriteWidgets(userFavoriteWidgetKeys)
        }

        this.widgetToDisplayKeyArray = userFavoriteWidgetKeys.filter(x => this.allExistingKeys.includes(x))
      }
      else {
        // check that keys given in property are in the know keys, then remove keys exceding maximum
        this.widgetToDisplayKeyArray = this.widgetKeysString.split(';').filter(x => this.allExistingKeys.includes(x)).slice(0, maxWidgets)
      }

      const soffit: string = await getToken(import.meta.env.VITE_USER_RIGHTS_URI)
      for (const value of this.widgetToDisplayKeyArray) {
        this.buildWidget(value, soffit)
      }
    })
  }

  allExistingKeys: Array<string> = []

  async getUserFavoriteWidgets() {
    const url = import.meta.env.VITE_USER_FAVORITE_WIDGETS_URI
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      const json = await response.json()
      return json.favorites
    }
    catch (error: any) {
      console.error(error.message)
    }
  }

  async setUserFavoriteWidgets(keys: Array<string>) {
    const url = import.meta.env.VITE_USER_SET_FAVORITES_WIDGETS_URI
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify({ favorites: keys }),
      })
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
    }
    catch (error: any) {
      console.error(error.message)
    }
  }

  async resetUserFavoriteWidgets() {
    await this.setUserFavoriteWidgets([])
  }

  @property({ type: String, attribute: 'widget-keys' })
  widgetKeysString = ''

  widgetToDisplayKeyArray: Array<string> = []

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

  getAllKeysNotDisplayed(): Array<string> {
    return this.allExistingKeys.filter(x => !this.widgetToDisplayKeyArray.includes(x))
  }

  moveWidgetBack(key: string): void {
    const index = this.widgetToDisplayKeyArray.indexOf(key)
    if (index === 0) {
      return
    }
    const indexOther = index - 1;
    [this.widgetToDisplayKeyArray[indexOther], this.widgetToDisplayKeyArray[index]] = [this.widgetToDisplayKeyArray[index], this.widgetToDisplayKeyArray[indexOther]]
    this.requestUpdate()
  }

  moveWidgetForward(key: string): void {
    const index = this.widgetToDisplayKeyArray.indexOf(key)
    if (index === this.widgetToDisplayKeyArray.length - 1) {
      return
    }
    const indexOther = index + 1;
    [this.widgetToDisplayKeyArray[index], this.widgetToDisplayKeyArray[indexOther]] = [this.widgetToDisplayKeyArray[indexOther], this.widgetToDisplayKeyArray[index]]
    this.requestUpdate()
  }

  render(): TemplateResult {
    return html`
      <div class="widget">
        <header>
          <h2 class="sr-only">Accès rapides</h2>
        </header>
        <ul class="widget-tiles">
          ${repeat(
            this.widgetToDisplayKeyArray,
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
