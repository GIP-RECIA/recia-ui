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
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import { WidgetSelectorData } from './classes/WidgetSelectorData.ts'
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

    document.addEventListener('WIDGETS-BEGIN', async () => {
      if (import.meta.env.DEV) {
        await this.resetUserFavoriteWidgets()
      }

      await this.setupLocalization()

      // get all widgets keys known/accepted by the adapter
      this.allExistingKeys = window.WidgetAdapter.getKeys()
      const maxWidgets: number = import.meta.env.VITE_WIDGET_COUNT

      this.filteredRequiredWidgetsKeys = this.widgetKeysString.split(';').filter(x => this.allExistingKeys.includes(x))
      this.filteredUserFavoriteWidgetsKeys = await this.getUserFavoriteWidgets()
      const intersection = this.intersect(this.filteredUserFavoriteWidgetsKeys, this.filteredRequiredWidgetsKeys)
      // if some required are not in the favorite
      if (intersection.length < this.filteredRequiredWidgetsKeys.length) {
        const favNotInIntersect = this.filteredUserFavoriteWidgetsKeys.length - intersection.length
        const reqNotInIntersect = this.filteredRequiredWidgetsKeys.length - intersection.length

        if (favNotInIntersect + reqNotInIntersect + intersection.length <= maxWidgets) {
          // order of concat preserves order of favorites
          this.widgetToDisplayKeyArray = [...new Set(intersection.concat(this.filteredUserFavoriteWidgetsKeys).concat(this.filteredRequiredWidgetsKeys))]
        }
        else {
          // concat required before favorites
          this.widgetToDisplayKeyArray = [...new Set(intersection.concat(this.filteredRequiredWidgetsKeys).concat(this.filteredUserFavoriteWidgetsKeys))].slice(0, maxWidgets)
        }
      }
      else {
        this.widgetToDisplayKeyArray = intersection
      }
      this.filteredRequiredWidgetsKeys = this.intersect(this.filteredRequiredWidgetsKeys, this.widgetToDisplayKeyArray)
      this.filteredUserFavoriteWidgetsKeys = this.widgetToDisplayKeyArray
      await this.setUserFavoriteWidgets(this.widgetToDisplayKeyArray)
      this.soffit = await getToken(import.meta.env.VITE_USER_RIGHTS_URI)
      for (const value of this.widgetToDisplayKeyArray) {
        this.buildWidget(value, this.soffit)
      }
      await this.buildWidgetSelector()
    })
  }

  @property({ type: String, attribute: 'localization-uri' })
  localizationUri = ''

  @property({ type: Boolean, attribute: 'dev-edit' })
  allowDevEdit = false

  async setupLocalization() {
    const version: string = window.WidgetAdapter.getVersion()
    const url = `${this.localizationUri}?v=${version}`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      const json = await response.json()
      langHelper.setReference(json)
    }
    catch (error: any) {
      console.error(error.message)
    }
  }

  soffit: string = ''

  intersect<T>(a: Array<T>, b: Array<T>): Array<T> {
    return a.filter(value => b.includes(value))
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

  beginEdit(): void {
    this.allWidgetsCopy = JSON.parse(JSON.stringify(this.allWidgets))
    this.editing = true
    this.requestUpdate()
  }

  cancelEdit(): void {
    this.allWidgetsCopy = JSON.parse(JSON.stringify(this.allWidgets))
    this.editing = false
    this.requestUpdate()
  }

  saveEdit(): void {
    this.allWidgets = JSON.parse(JSON.stringify(this.allWidgetsCopy))
    this.widgetToDisplayKeyArray = this.allWidgets.filter(x => x.displayed).map(x => x.key)
    this.setUserFavoriteWidgets(this.widgetToDisplayKeyArray)
    this.editing = false
    this.requestUpdate()
    for (const value of this.widgetToDisplayKeyArray) {
      this.buildWidget(value, this.soffit)
    }
  }

  applyEdit(): void {
    this.widgetToDisplayKeyArray = this.allWidgetsCopy.filter(x => x.displayed).map(x => x.key)
    this.requestUpdate()
  }

  allWidgets: Array<WidgetSelectorData> = []
  allWidgetsCopy: Array<WidgetSelectorData> = []

  async buildWidgetSelector() {
    const names: Array<{ name: string, key: string }> = await window.WidgetAdapter.getAllNames()
    const namesWithDisplayedSortedOnTop = this.union(this.widgetToDisplayKeyArray, names.map(x => x.key))
    for (const val of namesWithDisplayedSortedOnTop) {
      const widgetSelectorData: WidgetSelectorData = new WidgetSelectorData(val, val, this.filteredRequiredWidgetsKeys.includes(val), this.widgetToDisplayKeyArray.includes(val), this.filteredDefaultWidgetsKeys.includes(val))
      this.allWidgets.push(widgetSelectorData)
    }
  }

  editing: boolean = false

  async resetUserFavoriteWidgets() {
    // temp for dev, must be empty
    await this.setUserFavoriteWidgets(['Documents', 'Mediacentre'])
  }

  @property({ type: String, attribute: 'widget-keys-required' })
  widgetKeysString = ''

  widgetToDisplayKeyArray: Array<string> = []
  filteredRequiredWidgetsKeys: Array<string> = []
  filteredUserFavoriteWidgetsKeys: Array<string> = []

  async buildWidget(key: string, soffit: string) {
    // don't rebuild widget if already in map
    if (this.widgetDataMap.has(key)) {
      return
    }

    let itemsAsString: string = await this.getWidgetData(key, soffit)
    const regexForPartToLocalize = /I18N\$([A-Za-z0-9]+)\$/g
    let execArray
    const replaceMap: Map<string, string> = new Map()
    // eslint-disable-next-line no-cond-assign
    while ((execArray = regexForPartToLocalize.exec(itemsAsString)) !== null) {
      if (!replaceMap.has(execArray[0])) {
        replaceMap.set(execArray[0], this.t(`items.${execArray[1]}`, execArray[1]))
      }
    }
    replaceMap.forEach((value: string, key: string) => {
      itemsAsString = itemsAsString.replaceAll(key, value)
    })
    const widgetData: WidgetData = JSON.parse(itemsAsString)

    const emptyText = this.t(`empty-text.${key}`, widgetData.emptyText)
    widgetData.emptyText = emptyText

    // values used for display in dev env
    if (import.meta.env.DEV) {
      if (this.filteredRequiredWidgetsKeys.includes(key)) {
        widgetData.required = true
      }
      if (this.filteredUserFavoriteWidgetsKeys.includes(key)) {
        widgetData.favorite = true
      }
    }
    this.widgetDataMap.set(key, widgetData)
    this.requestUpdate()
  }

  t(key: string, defaultString?: string): string {
    return langHelper.localTranslation(`message.${key}`, defaultString ?? 'Missing localization')
  }

  async getWidgetData(key: string, soffit: string): Promise<string> {
    return await window.WidgetAdapter.getJsonForWidget(key, soffit)
  }

  @state()
  widgetDataMap: Map<string, WidgetData> = new Map()

  // temp design for dev
  getWidgetEditionMenuRender(): TemplateResult {
    if (!this.editing) {
      return html` <button @click="${this.beginEdit}">Editer</button>`
    }

    return html`
    <p>${import.meta.env.VITE_WIDGET_COUNT}</p>
    <ul>
      ${this.allWidgetsCopy.map(wds =>
        html`<li>${this.getSingleWidgetEditingRender(wds)}</li>`,
      )}
    </ul>
    <button @click="${this.saveEdit}">Sauver</button>
    <button @click="${this.cancelEdit}">Annuler</button>
    `
  }

  // temp design for dev
  getSingleWidgetEditingRender(wsd: WidgetSelectorData): TemplateResult {
    return html`
      <input type="checkbox" ?checked=${wsd.displayed} ?disabled=${wsd.required} id="${wsd.key}" @click="${(e: Event) => { this.handleSelectionClick(e, wsd) }}" name="${wsd.key}" value="${wsd.displayed}">
      <label for="${wsd.key}"> ${wsd.name} ${wsd.required ? '[REQ]' : ''}</label><br>
      <button @click="${() => { this.moveWidgetBack(wsd) }}" ?hidden="${this.allWidgetsCopy.indexOf(wsd) === 0}" >Précédent</button>
      <button @click="${() => { this.moveWidgetForward(wsd) }}" ?hidden="${this.allWidgetsCopy.indexOf(wsd) === this.allWidgetsCopy.length - 1}">Suivant</button>
      `
  }

  getWidgetRender(key: string): TemplateResult {
    if (this.widgetDataMap.has(key)) {
      const widgetData: WidgetData = this.widgetDataMap.get(key)!
      return html`
      <r-widget
        role="listitem"
        name="${widgetData.name}"
        subtitle="${widgetData.subtitle}"
        link="${widgetData.link}"
        target="${widgetData.target}"
        rel="${widgetData.rel}"
        empty-text="${widgetData.emptyText}"
        ?empty-discover=${widgetData.emptyDiscover ?? false}
        items=${widgetData.items}
        ?required=${widgetData.required ?? false} //temp value for dev
        ?favorite=${widgetData.favorite ?? false} //temp value for dev
        event-dnma="${widgetData.eventDNMA}"
        event-payload-dnma="${widgetData.eventpayloadDNMA}"
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

  moveWidgetBack(wsd: WidgetSelectorData): void {
    const index = this.allWidgetsCopy.indexOf(wsd)
    if (index === 0) {
      return
    }
    const indexOther = index - 1;
    [this.allWidgetsCopy[indexOther], this.allWidgetsCopy[index]] = [this.allWidgetsCopy[index], this.allWidgetsCopy[indexOther]]
    this.requestUpdate()
    this.applyEdit()
  }

  moveWidgetForward(wsd: WidgetSelectorData): void {
    const index = this.allWidgetsCopy.indexOf(wsd)
    if (index === this.allWidgetsCopy.length - 1) {
      return
    }
    const indexOther = index + 1;
    [this.allWidgetsCopy[index], this.allWidgetsCopy[indexOther]] = [this.allWidgetsCopy[indexOther], this.allWidgetsCopy[index]]
    this.requestUpdate()
    this.applyEdit()
  }

  handleSelectionClick(e: Event, wsd: WidgetSelectorData): void {
    if (wsd.displayed) { // handle deselection attempt
      if (wsd.required) {
        e.stopPropagation()
        e.preventDefault()
      }
      else {
        wsd.displayed = false
      }
    }
    else { // handle selection attempt
      if (this.allWidgetsCopy.filter(x => x.displayed).length >= this.getMaxWidgetsCount()) {
        e.stopPropagation()
        e.preventDefault()
      }
      else {
        wsd.displayed = true
      }
    }
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
    ${this.allowDevEdit
        ? html`
      <div>
        ${this.getWidgetEditionMenuRender()}
      </div>`
        : ''
    }
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaWidgetsWrapper
  }
}
