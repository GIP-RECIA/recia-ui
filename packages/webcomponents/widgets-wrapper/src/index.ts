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

      // FILTERED PROPERTIES
      this.filteredRequiredWidgetsKeys = this.widgetRequiredKeysAsString.split(';').filter(x => this.allExistingKeys.includes(x))
      this.filteredDefaultWidgetsKeys = this.widgetDefaultKeysAsString.split(';').filter(x => this.allExistingKeys.includes(x))

      const prefs = await this.getUserFavoriteWidgets()
      const hasPrefs = prefs !== undefined && !prefs.noStoredPrefs
      const preferedKeys: Array<string> = hasPrefs ? [...prefs!.prefs.filter(x => this.allExistingKeys.includes(x))] : [...this.filteredDefaultWidgetsKeys]

      const missingRequiredKeys: Array<string> = this.except(this.filteredRequiredWidgetsKeys, preferedKeys)

      if (missingRequiredKeys.length > 0) {
        this.widgetToDisplayKeyArray = this.filteredRequiredWidgetsKeys.concat(this.except(preferedKeys, this.filteredRequiredWidgetsKeys)).splice(this.getMaxWidgetsCount(), Infinity)
      }
      else {
        this.widgetToDisplayKeyArray = preferedKeys
      }

      await this.setUserFavoriteWidgets(this.widgetToDisplayKeyArray)
      this.soffit = await getToken(import.meta.env.VITE_USER_RIGHTS_URI)
      for (const value of this.widgetToDisplayKeyArray) {
        this.buildWidget(value, this.soffit)
      }
      this.requestUpdate()
      await this.buildWidgetSelector()
    })
  }

  @property({ type: String, attribute: 'localization-uri' })
  localizationUri = ''

  @property({ type: Boolean, attribute: 'dev-edit' })
  allowDevEdit = false

  getMaxWidgetsCount(): number {
    return Math.max(import.meta.env.VITE_WIDGET_COUNT, this.filteredRequiredWidgetsKeys.length)
  }

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

  union<T>(a: Array<T>, b: Array<T>): Array<T> {
    return [...new Set([...a, ...b])]
  }

  except<T>(a: Array<T>, b: Array<T>): Array<T> {
    return a.filter(x => !b.includes(x))
  }

  allExistingKeys: Array<string> = []

  async getUserFavoriteWidgets(): Promise<{ prefs: Array<string>, noStoredPrefs: boolean } | undefined> {
    const url = import.meta.env.VITE_USER_FAVORITE_WIDGETS_URI
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      const json = await response.json()

      return {
        prefs: json.displayedKeys !== undefined ? json.displayedKeys : [],
        noStoredPrefs: json.displayedKeys === undefined,
      }
    }
    catch (error: any) {
      console.error(error.message)
      return undefined
    }
  }

  async setUserFavoriteWidgets(keys: Array<string>) {
    const url = import.meta.env.VITE_USER_SET_FAVORITES_WIDGETS_URI
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify({ displayedKeys: keys }),
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
  widgetRequiredKeysAsString = ''

  @property({ type: String, attribute: 'widget-keys-default' })
  widgetDefaultKeysAsString = ''

  widgetToDisplayKeyArray: Array<string> = []
  filteredRequiredWidgetsKeys: Array<string> = []
  filteredDefaultWidgetsKeys: Array<string> = []

  async buildWidget(key: string, soffit: string) {
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
    <p>${this.getMaxWidgetsCount()}</p>
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
        ?required=${widgetData.required ?? false}
        ?favorite=${widgetData.favorite ?? false}
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
