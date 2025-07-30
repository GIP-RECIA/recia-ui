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
import type { Item } from '../../widget/src/types/ItemType.ts'
import type { WidgetDataDTO } from './classes/WidgetDataDTO.ts'
import type { WidgetSelectorData } from './classes/WidgetSelectorData.ts'
import type { ItemDTO } from './types/ItemDTOType.ts'
import type { KeyENTPersonProfilsInfo } from './types/KeyENTPersonProfilsInfoType.ts'
import type { WidgetData } from './types/WidgetDataType.ts'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAnglesRight,
  faArrowLeft,
  faArrowRight,
  faChevronDown,
  faCog,
  faInfoCircle,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'

import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'
import { getToken } from './utils/soffitUtils.ts'
import 'widget'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaWidgetsWrapper extends LitElement {
  constructor() {
    super()
    library.add(
      faAnglesRight,
      faArrowLeft,
      faArrowRight,
      faChevronDown,
      faInfoCircle,
      faPlus,
      faTimes,
    )
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
    const versionUpdate = (new Date()).getTime()
    const scriptAdapter = document.createElement('script')
    scriptAdapter.type = 'module'
    scriptAdapter.src = `${this.adapterSourceUri}?v=${versionUpdate}&configUri=${this.adapterConfigUri}`
    document.body.appendChild(scriptAdapter)
  }

  async monInit() {
    await this.setupLocalization()

    const soffit = await getToken(this.soffitUri)
    await this.fetchKeyToNameMap(soffit.decoded.ENTPersonProfils)

    this.keyENTPersonProfilsInfo = await window.WidgetAdapter.getKeysENTPersonProfils(soffit.decoded.ENTPersonProfils)

    const prefs = await this.getUserFavoriteWidgets()
    const hasPrefs = prefs !== undefined && !prefs.noStoredPrefs
    const preferedKeys: Array<string> = hasPrefs ? [...prefs!.prefs.filter(x => this.keyENTPersonProfilsInfo.allowedKeys.includes(x))] : [...this.keyENTPersonProfilsInfo.defaultKeys]

    const missingRequiredKeys: Array<string> = this.except(this.keyENTPersonProfilsInfo.requiredKeys, preferedKeys)

    if (missingRequiredKeys.length > 0) {
      this.widgetToDisplayKeyArray = this.keyENTPersonProfilsInfo.requiredKeys.concat(this.except(preferedKeys, this.keyENTPersonProfilsInfo.requiredKeys)).toSpliced(this.getMaxWidgetsCount(), Infinity)
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

  // #region PROPERTIES

  @property({ type: String, attribute: 'adapter-source-uri' })
  adapterSourceUri = ''

  @property({ type: String, attribute: 'localization-uri' })
  localizationUri = ''

  @property({ type: Number, attribute: 'widget-max-count' })
  widgetMaxCount = 3

  @property({ type: String, attribute: 'soffit-uri' })
  soffitUri = ''

  @property({ type: String, attribute: 'adapter-config-uri' })
  adapterConfigUri = ''

  @property({ type: String, attribute: 'get-prefs-uri' })
  getPrefsUri = ''

  @property({ type: String, attribute: 'put-prefs-uri' })
  putPrefsUri = ''

  // #endregion PROPERTIES

  // #region VARIABLES

  allWidgets: Array<WidgetSelectorData> = []
  keyToNameMap: Map<string, string> = new Map()

  @state()
  isEditingWidgetsPrefs: boolean = false

  @state()
  widgetDataMap: Map<string, WidgetData> = new Map()

  @state()
  widgetToDisplayKeyArray: Array<string> = []

  // used for cancel changes
  widgetToDisplayKeyArrayBackup: Array<string> = []

  keyENTPersonProfilsInfo: KeyENTPersonProfilsInfo

  dropdownOpen: boolean = false

  itemByWidgetNestedMap: Map<string, Map<string, Item>> = new Map()

  // store the bounded event used for listenning for click, and removing it when the dropdown is closed
  boundClickEventOnPage: { (e: Event): void, (this: Window, ev: MouseEvent): any } | undefined

  // #endregion VARIABLES

  async fetchKeyToNameMap(profils: any) {
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
   * @returns The number of widgets that must be displayed at the same time. Is **not related** to the widgetToDisplayKeyArray length.
   */
  getWidgetsToShowCount(): number {
    return Math.min(this.getMaxWidgetsCount(), this.keyENTPersonProfilsInfo.allowedKeys.length)
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

  intersect<T>(a: Array<T>, b: Array<T>): Array<T> {
    return a.filter(value => b.includes(value))
  }

  union<T>(a: Array<T>, b: Array<T>): Array<T> {
    return [...new Set([...a, ...b])]
  }

  except<T>(a: Array<T>, b: Array<T>): Array<T> {
    return a.filter(x => !b.includes(x))
  }

  removeItem<T>(a: Array<T>, b: T): Array<T> {
    return a.filter(x => x !== b)
  }

  async getUserFavoriteWidgets(): Promise<{ prefs: Array<string>, noStoredPrefs: boolean } | undefined> {
    const url = this.getPrefsUri
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
    const url = this.putPrefsUri
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

  async resetUserFavoriteWidgets() {
    await this.setUserFavoriteWidgets([])
  }

  handleClickOnItem(e: CustomEvent) {
    const id: string = e.detail.id
    const uid: string = e.detail.uid
    const item: Item | undefined = this.itemByWidgetNestedMap.get(uid)?.get(id)
    if (item === undefined) {
      return
    }

    if (item.eventDNMA) {
      document.dispatchEvent(
        new CustomEvent(
          item.eventDNMA,
          {
            detail: JSON.parse(item.eventDNMApayload),
          },
        ),
      )
    }

    if (item.event) {
      document.dispatchEvent(
        new CustomEvent(
          item.event,
          {
            detail: JSON.parse(item.eventpayload),
          },
        ),
      )
    }
  }

  handleMove(e: CustomEvent) {
    const newPosition: string = e.detail.newPosition
    const uid: string = e.detail.uid
    if (!this.widgetToDisplayKeyArray.includes(uid)) {
      return
    }
    if (newPosition === '+1') {
      this.moveWidgetForward(uid)
    }
    else if (newPosition === '-1') {
      this.moveWidgetBack(uid)
    }
  }

  moveWidgetBack(uid: string): void {
    const index = this.widgetToDisplayKeyArray.indexOf(uid)
    if (index === 0) {
      return
    }
    const indexOther = index - 1;
    [this.widgetToDisplayKeyArray[indexOther], this.widgetToDisplayKeyArray[index]] = [this.widgetToDisplayKeyArray[index], this.widgetToDisplayKeyArray[indexOther]]
    this.requestUpdate()
  }

  moveWidgetForward(uid: string): void {
    const index = this.widgetToDisplayKeyArray.indexOf(uid)
    if (index === this.widgetToDisplayKeyArray.length - 1) {
      return
    }
    const indexOther = index + 1;
    [this.widgetToDisplayKeyArray[index], this.widgetToDisplayKeyArray[indexOther]] = [this.widgetToDisplayKeyArray[indexOther], this.widgetToDisplayKeyArray[index]]
    this.requestUpdate()
  }

  clickOnGerer() {
    this.isEditingWidgetsPrefs = true
    // create a copy of array, because original will be modified to reflect the change instantly, and this one will be used if cancel is pressed
    this.widgetToDisplayKeyArrayBackup = [...this.widgetToDisplayKeyArray]
  }

  clickOnAnnuler() {
    this.isEditingWidgetsPrefs = false
    this.dropdownOpen = false
    this.widgetToDisplayKeyArray = [...this.widgetToDisplayKeyArrayBackup]
  }

  clickOnSauvegarder() {
    this.isEditingWidgetsPrefs = false
    this.setUserFavoriteWidgets(this.widgetToDisplayKeyArray)
  }

  async handleAddWidget(key: string) {
    if (this.widgetToDisplayKeyArray.length >= this.getMaxWidgetsCount()) {
      return
    }

    // avoid duplicated display, should not happen but check is just in case
    if (this.widgetToDisplayKeyArray.includes(key)) {
      return
    }
    const soffit = await getToken(this.soffitUri)
    this.widgetToDisplayKeyArray.push(key)
    this.buildWidget(key, soffit.encoded)
  }

  handleRemoveWidget(e: CustomEvent) {
    this.widgetToDisplayKeyArray = this.removeItem(this.widgetToDisplayKeyArray, e.detail.uid)
  }

  async buildWidget(key: string, soffit: string) {
    if (this.widgetDataMap.has(key)) {
      this.requestUpdate()
      return
    }
    const widgetData: WidgetData = {
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

      const widgetDataDTO: WidgetDataDTO = JSON.parse(itemsAsString)

      const emptyText = this.t(`empty-text.${key}`, widgetDataDTO.emptyText)

      widgetData.loading = false
      widgetData.subtitle = widgetDataDTO.subtitle
      widgetData.emptyText = emptyText
      widgetData.emptyDiscover = widgetDataDTO.emptyDiscover
      widgetData.link = widgetDataDTO.link
        ? {
            href: widgetDataDTO.link,
            target: widgetDataDTO.target,
            rel: widgetDataDTO.rel,
          }
        : undefined

      const itemDTOs: Array<ItemDTO> = widgetDataDTO.items ? JSON.parse(widgetDataDTO.items) : undefined

      if (itemDTOs !== undefined) {
        const items: Array<Item> = itemDTOs.map(x => (
          {
            name: x.name,
            icon: x.icon,
            link: x.link
              ? {
                  href: x.link,
                  target: x.target,
                  rel: x.rel,
                }
              : undefined,
            id: x.id,
            event: x.event,
            eventpayload: x.eventpayload,
            eventDNMA: x.eventDNMA,
            eventDNMApayload: x.eventpayloadDNMA,
          }),
        )
        widgetData.items = items
        this.itemByWidgetNestedMap.set(key, new Map())
        items.forEach((value: Item) => {
          this.itemByWidgetNestedMap.get(key)?.set(value.id, value)
        })
      }
    }
    catch (error) {
      widgetData.isError = true
      widgetData.loading = false
      widgetData.errorMessage = this.t('error-message', 'Une erreur est survenue')
      console.error('catch error build widget', error)
    }
    this.requestUpdate()
  }

  t(key: string, defaultString?: string): string {
    return langHelper.localTranslation(`message.${key}`, defaultString ?? 'Missing localization')
  }

  async getWidgetData(key: string, soffit: string): Promise<string> {
    try {
      return await window.WidgetAdapter.getJsonForWidget(key, soffit)
    }
    catch (error) {
      console.error(`${error} from get widget data`)
      throw error
    }
  }

  clickOnAjouter() {
    this.dropdownOpen = !this.dropdownOpen
    this.requestUpdate()
    this.boundClickEventOnPage = this.handleClickEventOnPageIfDropdownIsOpen.bind(this)

    // required, if not present the created event listener will detect the current event
    setTimeout(() => {
      window.addEventListener('click', this.boundClickEventOnPage!)
    }, 0)
  }

  handleClickEventOnPageIfDropdownIsOpen(e: Event): void {
    const dropdownContent = this.shadowRoot!.querySelector('#dropdown-content')
    const addWidgetButton = this.shadowRoot!.querySelector('#add-widget-button')
    const clickIsInside: boolean = e.composedPath().includes(dropdownContent as EventTarget)
    const clickIsOnButton: boolean = e.composedPath().includes(addWidgetButton as EventTarget)
    if (!clickIsInside) {
      // do not interfere with button behavior
      if (!clickIsOnButton) {
        this.dropdownOpen = false
      }
      window.removeEventListener('click', this.boundClickEventOnPage!)
      this.requestUpdate()
    }
  }

  removeClickEvent() {
    window.removeEventListener('click', this.boundClickEventOnPage!)
  }

  canSave() {
    return this.widgetToDisplayKeyArray.length === this.getWidgetsToShowCount()
  }

  getWidgetRender(key: string, index: number): TemplateResult {
    if (this.widgetDataMap.has(key)) {
      const widgetData: WidgetData = this.widgetDataMap.get(key)!
      return html`
      <r-widget
        role="listitem"
        uid="${widgetData.uid}"
        name="${widgetData.name}"
        subtitle="${widgetData.subtitle}"
        .link="${widgetData.link}"
        empty-text="${widgetData.emptyText}"
        ?empty-discover=${widgetData.emptyDiscover ?? false}
        .items=${widgetData.items}
        ?deletable="${widgetData.deletable}"
        ?no-previous="${index === 0}"
        ?no-next="${index === this.widgetToDisplayKeyArray.length - 1}"
        ?loading="${widgetData.loading}"
        ?manage="${this.isEditingWidgetsPrefs}"
        @click-on-item="${this.handleClickOnItem}"
        @move="${this.handleMove}"
        @delete="${this.handleRemoveWidget}"
        ?is-error="${widgetData.isError ?? false}"
        error-message="${widgetData.errorMessage}"
        ></r-widget>
    `
    }
    return html``
  }

  getPlaceholderWidgetRender(index: number): TemplateResult {
    return html`
      <r-widget
        role="listitem"
        uid="${index}"
        name="."
        subtitle="."
        .link=""
        empty-text=""
        ?empty-discover="false"
        .items=""
        ?deletable="false"
        ?no-previous="${index === 0}"
        ?no-next="${index === 2}"
        ?loading=${true}
        ></r-widget>
    `
  }

  dropdownRender(): TemplateResult {
    const nonUsedKeys = this.except(this.keyENTPersonProfilsInfo.allowedKeys, this.widgetToDisplayKeyArray).filter(x => this.keyToNameMap.has(x))
    return html`
      <button id="add-widget-button" ?disabled="${this.widgetToDisplayKeyArray.length >= this.getMaxWidgetsCount() || nonUsedKeys.length === 0}" class="btn-secondary small" @click="${this.clickOnAjouter}">${this.t(`buttons.Ajouter`, 'Ajouter')} </button>
      <div id="dropdown-content" class="dropdown-content" style="${!this.dropdownOpen || nonUsedKeys.length === 0 ? 'display:none' : nothing}">
       ${repeat(
          nonUsedKeys,
          (widgetKey: string) => widgetKey,
          (widgetKey: string) => html`
            <button ?disabled="${this.widgetToDisplayKeyArray.length >= this.getMaxWidgetsCount()}" @click="${() => { this.handleAddWidget(widgetKey) }}">${this.keyToNameMap.get(widgetKey)}</button>
            `,
        )}
      </div>
    `
  }

  widgetCountRender(): TemplateResult {
    // TODO : localize
    if (this.canSave()) {
      return html`<p>Widgets actifs : ${this.widgetToDisplayKeyArray.length}/${this.getWidgetsToShowCount()}</p>`
    }
    return html`<p>Nombre de widgets actifs insuffisant : ${this.widgetToDisplayKeyArray.length}/${this.getWidgetsToShowCount()}</p>`
  }

  render(): TemplateResult {
    return html`
      <div class="widget">
        <header>
          <h2 class="sr-only">Accès rapides</h2>
          ${
            this.isEditingWidgetsPrefs === false
              ? html`
               <div class="to-right">
                  <button class="btn-secondary small" ?disabled="${Array.from(this.widgetDataMap.values()).some(x => x.loading) || this.widgetDataMap.size === 0}"  @click="${this.clickOnGerer}">${this.t(`buttons.Gerer`, 'Gerer')} ${getIcon(faCog)}</button>
                </div>
              `
              : html`
              <div class="to-right">
               ${this.dropdownRender()}
              <button class="btn-secondary small" @click="${this.clickOnAnnuler}">${this.t(`buttons.Annuler`, 'Annuler')}</button>
              <button class="btn-secondary small" ?disabled="${!this.canSave()}" title="Save" @click="${this.clickOnSauvegarder}">${this.t(`buttons.Sauvegarder`, 'Sauvegarder')}</button>
            </div>
            <p class="no-mobile">    ${this.widgetCountRender()}</p>

            `
          }

        </header>
        <ul class="widget-tiles">
          ${
  this.widgetToDisplayKeyArray.length > 0
    ? repeat(
        this.widgetToDisplayKeyArray,
        (widgetKey: string) => widgetKey,
        (widgetKey: string, index: number) => html`
                 ${this.getWidgetRender(widgetKey, index)}
              `,
      )
    : map([0, 1, 2], i => this.getPlaceholderWidgetRender(i))}
        </ul>
        <p class="mobile-only">
        ${this.isEditingWidgetsPrefs ? this.widgetCountRender() : nothing}
        </p>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface Window {
    WidgetAdapter: any
  }
  interface HTMLElementTagNameMap {
    [tagName]: ReciaWidgetsWrapper
  }
}
