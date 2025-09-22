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
import type { Widget, WidgetsWrapperConfig } from './types/widgetType.ts'
import { faGear, faSave, faXmark } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { repeat } from 'lit/directives/repeat.js'
import { isEqual } from 'lodash-es'
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

  @state()
  isEditingWidgetsPrefs: boolean = false

  @state()
  widgetDataMap: Map<string, Widget> = new Map()

  @state()
  widgetToDisplayKeyArray: Array<string> = []

  // used for cancel changes
  widgetToDisplayKeyArrayBackup: Array<string> = []

  // store the bounded event used for listenning for click, and removing it when the dropdown is closed
  boundClickEventOnPage: { (e: Event): void, (this: Window, ev: MouseEvent): any } | undefined

  wrapperConfig: WidgetsWrapperConfig = {
    allowedKeys: [],
    requiredKeys: [],
    defaultKeys: [],
    names: [],
  }

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
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
    document.addEventListener('update-favorites', this.updateFavorites.bind(this))
  }

  async monInit(): Promise<void> {
    await TranslationService.init(`${this.localizationUri}?v=${window.WidgetAdapter.getVersion()}`)

    const soffit = await getToken(this.soffitUri)

    this.wrapperConfig = await await window.WidgetAdapter.getKeysENTPersonProfils(soffit.decoded.ENTPersonProfils)

    const prefs = await FavoriteService.getUserFavoriteWidgets(this.getPrefsUri)
    const hasPrefs = prefs !== undefined && !prefs.noStoredPrefs
    const preferedKeys: Array<string> = hasPrefs
      ? prefs!.prefs.filter(x => this.wrapperConfig.allowedKeys.includes(x))
      : this.wrapperConfig.defaultKeys ?? []

    const missingRequiredKeys: Array<string> = except(this.wrapperConfig.requiredKeys, preferedKeys)

    if (missingRequiredKeys.length > 0) {
      this.widgetToDisplayKeyArray = this.wrapperConfig.requiredKeys
        .concat(except(preferedKeys, this.wrapperConfig.requiredKeys))
        .toSpliced(this.getMaxWidgetsCount(), Infinity)
    }
    else {
      this.widgetToDisplayKeyArray = preferedKeys
    }

    if (!isEqual(prefs?.prefs, this.widgetToDisplayKeyArray))
      await FavoriteService.setUserFavoriteWidgets(this.putPrefsUri, this.widgetToDisplayKeyArray)
    for (const value of this.widgetToDisplayKeyArray) {
      this.buildWidget(value, soffit.encoded)
    }
    this.requestUpdate()
  }

  getMaxWidgetsCount(): number {
    return Math.max(this.widgetMaxCount, this.wrapperConfig.requiredKeys.length)
  }

  /**
   *
   * @returns The number of widgets that must be displayed at the same time.
   * Is **not related** to the widgetToDisplayKeyArray length.
   */
  getWidgetsToShowCount(): number {
    return Math.min(this.getMaxWidgetsCount(), this.wrapperConfig.allowedKeys.length)
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

  async clickOnSauvegarder(): Promise<void> {
    this.isEditingWidgetsPrefs = false
    await FavoriteService.setUserFavoriteWidgets(this.putPrefsUri, this.widgetToDisplayKeyArray)
  }

  async handleAddWidget(e: CustomEvent): Promise<void> {
    const { key } = e.detail
    if (this.widgetToDisplayKeyArray.length >= this.getMaxWidgetsCount())
      return

    // avoid duplicated display, should not happen but check is just in case
    if (this.widgetToDisplayKeyArray.includes(key))
      return

    const soffit = await getToken(this.soffitUri)
    this.widgetToDisplayKeyArray.push(key)
    this.buildWidget(key, soffit.encoded)
  }

  handleRemoveWidget(e: CustomEvent): void {
    this.widgetToDisplayKeyArray = removeItem(this.widgetToDisplayKeyArray, e.detail.uid)
  }

  async buildWidget(
    key: string,
    soffit: string,
    forceRebuild: boolean = false,
  ): Promise<void> {
    if (this.widgetDataMap.has(key) && !forceRebuild) {
      this.requestUpdate()
      return
    }

    let widgetData: Widget = {
      uid: key,
      name: this.wrapperConfig.names.find(name => name.key === key)?.name ?? key,
      loading: true,
    }
    this.widgetDataMap.set(key, widgetData)
    this.requestUpdate()

    try {
      widgetData = JSON.parse(
        JSON
          .stringify(
            await window.WidgetAdapter.getJsonForWidget(key, soffit),
          )
          .replaceAll(
            /I18N\$([A-Za-z0-9]+)\$/g,
            (_, match) => langHelper.localTranslation(`items.${match}`, match),
          ),
      )
      let emptyText: string | undefined = langHelper.localTranslation(`empty-text.${key}`, '')
      emptyText = emptyText !== '' ? emptyText : undefined

      this.widgetDataMap.set(key, {
        ...widgetData,
        emptyText,
        deletable: !this.wrapperConfig.requiredKeys.includes(key),
      })
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (_) {
      let errorMessage: string | undefined = langHelper.localTranslation('error-message', '')
      errorMessage = errorMessage !== '' ? errorMessage : undefined

      this.widgetDataMap.set(key, {
        ...widgetData,
        loading: false,
        isError: true,
        errorMessage,
      })
    }
    this.requestUpdate()
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
    const nonUsed = this.wrapperConfig.names.filter(({ key }) =>
      except(this.wrapperConfig.allowedKeys, this.widgetToDisplayKeyArray).includes(key),
    )

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
