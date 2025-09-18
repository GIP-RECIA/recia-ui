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
import type { KeyENTPersonProfilsInfo } from './types/KeyENTPersonProfilsInfoType.ts'
import type { Widget } from './types/widgetType.ts'
import { faGear, faSave, faXmark } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import FavoriteService from './services/favoriteService.ts'
import TranslationService from './services/translationService.ts'
import styles from './style.scss?inline'
import { except, removeItem } from './utils/arrayUtils.ts'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'
import { getToken } from './utils/soffitUtils.ts'
import './components/dropdown-add/index.ts'
import './components/widget/index.ts'

@localized()
export class ReciaWidgetsWrapper extends LitElement {
  @property({ type: String, attribute: 'adapter-source-uri' })
  adapterSourceUri: string = ''

  @property({ type: String, attribute: 'localization-uri' })
  localizationUri: string = ''

  @property({ type: Number, attribute: 'widget-max-count' })
  widgetMaxCount: number = 3

  @property({ type: String, attribute: 'soffit-uri' })
  soffitUri: string = ''

  @property({ type: String, attribute: 'adapter-config-uri' })
  adapterConfigUri: string = ''

  @property({ type: String, attribute: 'get-prefs-uri' })
  getPrefsUri: string = ''

  @property({ type: String, attribute: 'put-prefs-uri' })
  putPrefsUri: string = ''

  keyToNameMap: Map<string, string> = new Map()

  @state()
  isEditingWidgetsPrefs: boolean = false

  @state()
  widgetDataMap: Map<string, Widget> = new Map()

  @state()
  widgetToDisplayKeyArray: Array<string> = []

  // used for cancel changes
  widgetToDisplayKeyArrayBackup: Array<string> = []

  keyENTPersonProfilsInfo: KeyENTPersonProfilsInfo

  // store the bounded event used for listenning for click, and removing it when the dropdown is closed
  boundClickEventOnPage: { (e: Event): void, (this: Window, ev: MouseEvent): any } | undefined

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)

    this.keyENTPersonProfilsInfo = {
      ENTPersonProfils: [],
      allowedKeys: [],
      requiredKeys: [],
      defaultKeys: [],
    }

    document.addEventListener('init-widget', () => {
      this.monInit()
    })
  }

  connectedCallback(): void {
    super.connectedCallback()
    const scriptAdapter = document.createElement('script')
    scriptAdapter.type = 'module'
    const uriHasParam: boolean = this.adapterSourceUri.split('?')[1]?.length > 0
    scriptAdapter.src = `${this.adapterSourceUri}${uriHasParam ? '&' : '?'}configUri=${this.adapterConfigUri}`
    document.body.appendChild(scriptAdapter)
    this.updateFavorites = this.updateFavorites.bind(this)
    document.addEventListener('update-favorites', this.updateFavorites)
  }

  async monInit(): Promise<void> {
    await TranslationService.init(`${this.localizationUri}?v=${window.WidgetAdapter.getVersion()}`)

    const soffit = await getToken(this.soffitUri)
    await this.fetchKeyToNameMap(soffit.decoded.ENTPersonProfils)

    this.keyENTPersonProfilsInfo = await window.WidgetAdapter.getKeysENTPersonProfils(soffit.decoded.ENTPersonProfils)

    const prefs = await FavoriteService.getUserFavoriteWidgets(this.getPrefsUri)
    const hasPrefs = prefs !== undefined && !prefs.noStoredPrefs
    const preferedKeys: Array<string> = hasPrefs
      ? [...prefs!.prefs.filter(x => this.keyENTPersonProfilsInfo.allowedKeys.includes(x))]
      : [...this.keyENTPersonProfilsInfo.defaultKeys]

    const missingRequiredKeys: Array<string> = except(this.keyENTPersonProfilsInfo.requiredKeys, preferedKeys)

    if (missingRequiredKeys.length > 0) {
      this.widgetToDisplayKeyArray = this.keyENTPersonProfilsInfo.requiredKeys
        .concat(except(preferedKeys, this.keyENTPersonProfilsInfo.requiredKeys))
        .toSpliced(this.getMaxWidgetsCount(), Infinity)
    }
    else {
      this.widgetToDisplayKeyArray = preferedKeys
    }

    await this.setUserFavoriteWidgets(this.widgetToDisplayKeyArray)
    for (const value of this.widgetToDisplayKeyArray) {
      this.buildWidget(value, soffit.encoded)
    }
    this.requestUpdate()
  }

  async fetchKeyToNameMap(profils: any): Promise<void> {
    const names: Array<{ name: string, key: string }> = await window.WidgetAdapter.getAllNames(profils)
    names.forEach((value) => {
      this.keyToNameMap.set(value.key, value.name)
    })
    this.requestUpdate()
  }

  getMaxWidgetsCount(): number {
    return Math.max(this.widgetMaxCount, this.keyENTPersonProfilsInfo.requiredKeys.length)
  }

  /**
   *
   * @returns The number of widgets that must be displayed at the same time.
   * Is **not related** to the widgetToDisplayKeyArray length.
   */
  getWidgetsToShowCount(): number {
    return Math.min(this.getMaxWidgetsCount(), this.keyENTPersonProfilsInfo.allowedKeys.length)
  }

  async setUserFavoriteWidgets(keys: Array<string>): Promise<void> {
    await FavoriteService.setUserFavoriteWidgets(this.putPrefsUri, keys)
  }

  async resetUserFavoriteWidgets(): Promise<void> {
    await this.setUserFavoriteWidgets([])
  }

  async updateFavorites(): Promise<void> {
    const soffit = await getToken(this.soffitUri)
    await this.buildWidget('Favoris', soffit.encoded, true)
  }

  handleMove(e: CustomEvent): void {
    const newPosition: string = e.detail.newPosition
    const uid: string = e.detail.uid
    if (!this.widgetToDisplayKeyArray.includes(uid))
      return
    if (newPosition === '+1')
      this.moveWidgetForward(uid)
    else if (newPosition === '-1')
      this.moveWidgetBack(uid)
  }

  moveWidgetBack(uid: string): void {
    const index = this.widgetToDisplayKeyArray.indexOf(uid)
    if (index === 0)
      return
    const indexOther = index - 1;
    [
      this.widgetToDisplayKeyArray[indexOther],
      this.widgetToDisplayKeyArray[index],
    ] = [
      this.widgetToDisplayKeyArray[index],
      this.widgetToDisplayKeyArray[indexOther],
    ]
    this.requestUpdate()
  }

  moveWidgetForward(uid: string): void {
    const index = this.widgetToDisplayKeyArray.indexOf(uid)
    if (index === this.widgetToDisplayKeyArray.length - 1)
      return
    const indexOther = index + 1;
    [
      this.widgetToDisplayKeyArray[index],
      this.widgetToDisplayKeyArray[indexOther],
    ] = [
      this.widgetToDisplayKeyArray[indexOther],
      this.widgetToDisplayKeyArray[index],
    ]
    this.requestUpdate()
  }

  clickOnGerer(): void {
    this.isEditingWidgetsPrefs = true
    // create a copy of array, because original will be modified to reflect
    // the change instantly, and this one will be used if cancel is pressed
    this.widgetToDisplayKeyArrayBackup = [...this.widgetToDisplayKeyArray]
  }

  clickOnAnnuler(): void {
    this.isEditingWidgetsPrefs = false
    this.widgetToDisplayKeyArray = [...this.widgetToDisplayKeyArrayBackup]
  }

  clickOnSauvegarder(): void {
    this.isEditingWidgetsPrefs = false
    this.setUserFavoriteWidgets(this.widgetToDisplayKeyArray)
  }

  async handleAddWidget(e: CustomEvent): Promise<void> {
    const { key } = e.detail
    if (this.widgetToDisplayKeyArray.length >= this.getMaxWidgetsCount())
      return

    // avoid duplicated display, should not happen but check is just in case
    if (this.widgetToDisplayKeyArray.includes(key)) {
      return
    }
    const soffit = await getToken(this.soffitUri)
    this.widgetToDisplayKeyArray.push(key)
    this.buildWidget(key, soffit.encoded)
  }

  handleRemoveWidget(e: CustomEvent): void {
    this.widgetToDisplayKeyArray = removeItem(this.widgetToDisplayKeyArray, e.detail.uid)
  }

  async buildWidget(key: string, soffit: string, forceRebuild: boolean = false): Promise<void> {
    if (this.widgetDataMap.has(key) && !forceRebuild) {
      this.requestUpdate()
      return
    }
    const widgetData: Widget = {
      name: this.keyToNameMap.get(key) ?? key,
      uid: key,
      emptyDiscover: false,
      emptyText: '',
      loading: true,
      deletable: !this.keyENTPersonProfilsInfo.requiredKeys.includes(key),
    }

    this.widgetDataMap.set(key, widgetData)
    this.requestUpdate()

    try {
      let itemsAsString: string = JSON.stringify(await this.getWidgetData(key, soffit))
      const regexForPartToLocalize = /I18N\$([A-Za-z0-9]+)\$/g
      let execArray
      const replaceMap: Map<string, string> = new Map()
      // eslint-disable-next-line no-cond-assign
      while ((execArray = regexForPartToLocalize.exec(itemsAsString)) !== null) {
        if (!replaceMap.has(execArray[0])) {
          replaceMap.set(
            execArray[0],
            langHelper.localTranslation(`items.${execArray[1]}`, execArray[1]),
          )
        }
      }
      replaceMap.forEach((value: string, key: string) => {
        itemsAsString = itemsAsString.replaceAll(key, value)
      })

      const widgetDataDTO: Widget & { eventDNMA: any, eventpayloadDNMA: any } = JSON.parse(itemsAsString)
      let emptyText: string | undefined = langHelper.localTranslation(`empty-text.${key}`, '')
      emptyText = emptyText !== '' ? emptyText : undefined

      widgetData.loading = false
      widgetData.subtitle = widgetDataDTO.subtitle
      widgetData.emptyText = emptyText
      widgetData.emptyDiscover = widgetDataDTO.emptyDiscover ?? false
      widgetData.link = widgetDataDTO.link
      widgetData.items = widgetDataDTO.items
    }
    catch (error) {
      widgetData.isError = true
      widgetData.loading = false
      widgetData.errorMessage = langHelper.localTranslation('error-message', 'Une erreur est survenue')
      console.error('catch error build widget', error)
    }
    this.requestUpdate()
  }

  async getWidgetData(key: string, soffit: string): Promise<Widget & { eventDNMA: any, eventpayloadDNMA: any }> {
    try {
      return await window.WidgetAdapter.getJsonForWidget(key, soffit)
    }
    catch (error) {
      console.error(`${error} from get widget data`)
      throw error
    }
  }

  removeClickEvent(): void {
    window.removeEventListener('click', this.boundClickEventOnPage!)
  }

  canSave(): boolean {
    return this.widgetToDisplayKeyArray.length === this.getWidgetsToShowCount()
  }

  getWidgetRender(key: string, index: number): TemplateResult | typeof nothing {
    if (!this.widgetDataMap.has(key))
      return nothing

    const widgetData: Widget = this.widgetDataMap.get(key)!
    return html`
      <r-widget
        role="listitem"
        uid="${widgetData.uid}"
        name="${widgetData.name}"
        subtitle="${widgetData.subtitle ?? nothing}"
        .link="${widgetData.link}"
        empty-text="${widgetData.emptyText ?? nothing}"
        ?empty-discover=${widgetData.emptyDiscover ?? false}
        .items=${widgetData.items}
        ?deletable="${widgetData.deletable}"
        ?no-previous="${index === 0}"
        ?no-next="${index === this.widgetToDisplayKeyArray.length - 1}"
        ?loading="${widgetData.loading}"
        ?manage="${this.isEditingWidgetsPrefs}"
        @move="${this.handleMove}"
        @delete="${this.handleRemoveWidget}"
        ?error="${widgetData.isError ?? false}"
        error-message="${widgetData.errorMessage ?? nothing}"
      >
      </r-widget>
    `
  }

  widgetCountRender(): TemplateResult {
    // TODO : localize
    const count: string = `${this.widgetToDisplayKeyArray.length}/${this.getWidgetsToShowCount()}`
    const message = this.canSave()
      ? 'Widgets actifs'
      : 'Nombre de widgets actifs insuffisant'

    return html`<span class="info">${message} : ${count}</span>`
  }

  render(): TemplateResult {
    const nonUsed = except(this.keyENTPersonProfilsInfo.allowedKeys, this.widgetToDisplayKeyArray)
      .filter(x => this.keyToNameMap.has(x))
      .map((x) => { return { key: x, value: this.keyToNameMap.get(x) } })

    return html`
      <div class="widget-layout">
        <header>
          <h2 class="sr-only">${msg(str`Accès rapides`)}</h2>
          <div class="actions">
            ${
              this.isEditingWidgetsPrefs === false
                ? html`
                    <button
                      class="btn-secondary small"
                      ?disabled="${
                        Array.from(this.widgetDataMap.values()).some(x => x.loading)
                        || this.widgetDataMap.size === 0
                      }"
                      @click="${this.clickOnGerer}"
                    >
                      ${
                        langHelper.localTranslation(
                          'buttons.Gerer',
                          msg(str`Gérer`),
                        )
                      }
                      ${getIcon(faGear)}
                    </button>
                  `
                : html`
                    <r-dropdown-add
                      .items="${nonUsed}"
                      ?disabled="${
                        this.widgetToDisplayKeyArray.length >= this.getMaxWidgetsCount()
                        || nonUsed.length === 0
                      }"
                      @item-click="${this.handleAddWidget}"
                    >
                    </r-dropdown-add>
                    <button
                      class="btn-secondary small"
                      @click="${this.clickOnAnnuler}"
                    >
                      ${
                        langHelper.localTranslation(
                          'buttons.Annuler',
                          msg(str`Annuler`),
                        )
                      }
                      ${getIcon(faXmark)}
                    </button>
                    <button
                      class="btn-secondary small"
                      ?disabled="${!this.canSave()}"
                      title="Save"
                      @click="${this.clickOnSauvegarder}"
                    >
                      ${
                        langHelper.localTranslation(
                          'buttons.Sauvegarder',
                          msg(str`Enregistrer`),
                        )
                      }
                      ${getIcon(faSave)}
                    </button>
                  `
            }
          </div>
          ${
            this.isEditingWidgetsPrefs === true
              ? this.widgetCountRender()
              : nothing
          }
        </header>
        <ul class="widget-tiles">
          ${
            this.widgetToDisplayKeyArray.length > 0
              ? repeat(
                  this.widgetToDisplayKeyArray,
                  widgetKey => widgetKey,
                  (widgetKey, index) => html`
                    ${this.getWidgetRender(widgetKey, index)}
                  `,
                )
              : map(
                  range(this.widgetMaxCount),
                  index => html`
                    <r-widget
                      role="listitem"
                      uid="${index}"
                      name=" "
                      loading
                    >
                    </r-widget>
                  `,
                )
          }
        </ul>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(name)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaWidgetsWrapper)
}

declare global {
  interface Window {
    WidgetAdapter: any
  }
  interface HTMLElementTagNameMap {
    [tagName]: ReciaWidgetsWrapper
  }
}
