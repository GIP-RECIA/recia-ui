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
import { faGear, faInfoCircle, faSave, faXmark } from '@fortawesome/free-solid-svg-icons'
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
import { getIcon, getIconWithStyle } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'
import { getToken } from './utils/soffitUtils.ts'
import './components/dropdown-add/index.ts'
import './components/widget/index.ts'

@localized()
export class ReciaWidgetsWrapper extends LitElement {
  @property({ type: String, attribute: 'adapter-source-uri' })
  adapterSourceUri: string = ''

  @property({ type: String, attribute: 'adapter-config-uri' })
  adapterConfigUri: string = ''

  @property({ type: String, attribute: 'localization-uri' })
  localizationUri: string = ''

  @property({ type: Number, attribute: 'widget-max-count' })
  widgetMaxCount: number = 3

  @property({ type: String, attribute: 'soffit-uri' })
  soffitUri: string = ''

  @property({ type: String, attribute: 'get-prefs-uri' })
  getPrefsUri: string = ''

  @property({ type: String, attribute: 'put-prefs-uri' })
  putPrefsUri: string = ''

  @state()
  isEditingWidgetsPrefs: boolean = false

  @state()
  widgetDataMap: Map<string, Widget> = new Map()

  @state()
  widgetToDisplayKeyArray: string[] = []

  @state()
  loading: boolean = true

  // used for cancel changes
  widgetToDisplayKeyArrayBackup: string[] = []

  wrapperConfig: WidgetsWrapperConfig = {
    allowedKeys: [],
    requiredKeys: [],
    defaultKeys: [],
    availableWidgets: [],
  }

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
    document.addEventListener('init-widget', () => {
      this.initialize()
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

  async initialize(): Promise<void> {
    await TranslationService.init(`${this.localizationUri}?v=${window.WidgetAdapter.getVersion()}`)
    const soffit = await getToken(this.soffitUri)
    this.wrapperConfig = await window.WidgetAdapter.getConfig(soffit.decoded.ENTPersonProfils)

    const {
      displayedKeys: storedDisplayedKeys,
      defaultKeys: storedDefaultKeys,
      noStoredDisplayedKeys,
    } = await FavoriteService.getUserFavoriteWidgets(this.getPrefsUri)

    let displayKeys = noStoredDisplayedKeys
      ? this.wrapperConfig.defaultKeys
      : storedDisplayedKeys.filter(key => this.wrapperConfig.allowedKeys.includes(key))

    const missingRequiredKeys = except(this.wrapperConfig.requiredKeys, displayKeys)
    if (missingRequiredKeys.length > 0)
      displayKeys = [...missingRequiredKeys, ...displayKeys]

    const missingDefaultKeys = noStoredDisplayedKeys
      ? except(this.wrapperConfig.defaultKeys, displayKeys)
      : except(this.wrapperConfig.defaultKeys, storedDefaultKeys)
    if (missingDefaultKeys.length > 0)
      displayKeys = [...displayKeys, ...missingDefaultKeys]

    this.widgetToDisplayKeyArray = [...new Set(displayKeys)]

    if (
      missingRequiredKeys.length > 0
      || missingDefaultKeys.length > 0
      || !storedDefaultKeys.every(key => this.wrapperConfig.defaultKeys.includes(key))
    ) {
      await FavoriteService.setUserFavoriteWidgets(
        this.putPrefsUri,
        this.widgetToDisplayKeyArray,
        this.wrapperConfig.defaultKeys,
      )
    }

    this.widgetToDisplayKeyArray.forEach((key) => {
      this.buildWidget(key, soffit.encoded)
    })
    this.loading = false
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
    await FavoriteService.setUserFavoriteWidgets(
      this.putPrefsUri,
      this.widgetToDisplayKeyArray,
      this.wrapperConfig.defaultKeys,
    )
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
    const currentWidget = this.wrapperConfig.availableWidgets.find(({ uid }) => uid === key)
    if (!currentWidget)
      return

    if (this.widgetDataMap.has(key) && !forceRebuild) {
      this.requestUpdate()
      return
    }

    const handler = currentWidget.handler ?? key
    const baseWidgetData: Widget = {
      ...currentWidget,
      deletable: !this.wrapperConfig.requiredKeys.includes(key),
      loading: true,
    }
    this.widgetDataMap.set(key, baseWidgetData)
    this.requestUpdate()

    try {
      const widgetData = JSON.parse(
        JSON
          .stringify(
            await window.WidgetAdapter.getWidget(key, soffit),
          )
          .replaceAll(
            /I18N\$([A-Za-z0-9]+)\$/g,
            (_, match) => langHelper.localTranslation(`items.${match}`, match),
          ),
      )
      let emptyText: string | undefined = langHelper.localTranslation(`empty-text.${handler}`, '')
      emptyText = emptyText !== '' ? emptyText : undefined

      this.widgetDataMap.set(key, {
        ...baseWidgetData,
        ...widgetData,
        loading: false,
        emptyText,
      })
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (_) {
      let errorMessage: string | undefined = langHelper.localTranslation('error-message', '')
      errorMessage = errorMessage !== '' ? errorMessage : undefined

      this.widgetDataMap.set(key, {
        ...baseWidgetData,
        loading: false,
        isError: true,
        errorMessage,
      })
    }
    this.requestUpdate()
  }

  canSave(): boolean {
    return !isEqual(this.widgetToDisplayKeyArrayBackup, this.widgetToDisplayKeyArray)
      && this.widgetToDisplayKeyArray.length >= this.wrapperConfig.requiredKeys.length
      && this.widgetToDisplayKeyArray.length <= this.widgetMaxCount
  }

  contentTemplate(): TemplateResult | typeof nothing {
    if (this.loading && this.widgetToDisplayKeyArray.length === 0)
      return this.skeletonTemplate()

    return html`
        ${
          this.widgetToDisplayKeyArray.length === 0 && !this.isEditingWidgetsPrefs
            ? html`
                <div class="empty">
                  ${getIconWithStyle(faInfoCircle, undefined, { icon: true })}
                  <p>${
                    msg(str`${msg(str`Vous n'avez`)} aucun widget\nCliquez sur le bouton "${
                      langHelper.localTranslation(
                        'buttons.Gerer',
                        msg(str`Gérer`),
                      )
                    }" pour en ajouter de nouveaux`)
                  }</p>
                </div>
              `
            : nothing
        }
        <ul class="widget-tiles">
          ${
            repeat(
              this.widgetToDisplayKeyArray.map(key => this.widgetDataMap.get(key)).filter(data => data !== undefined),
              widget => widget.uid,
              (widget, index) => html`
                <li>
                  <r-widget
                    uid="${widget.uid}"
                    name="${widget.name}"
                    subtitle="${widget.subtitle ?? nothing}"
                    notifications="${widget.notifications ?? nothing}"
                    .link="${widget.link}"
                    .items="${widget.items}"
                    empty-icon="${widget.emptyIcon ?? nothing}"
                    empty-text="${widget.emptyText ?? nothing}"
                    ?empty-discover=${widget.emptyDiscover ?? false}
                    ?manage="${this.isEditingWidgetsPrefs}"
                    ?deletable="${widget.deletable}"
                    ?no-previous="${index === 0}"
                    ?no-next="${index === this.widgetToDisplayKeyArray.length - 1}"
                    ?loading="${widget.loading}"
                    ?error="${widget.isError ?? false}"
                    error-message="${widget.errorMessage ?? nothing}"
                    @move="${this.handleMove}"
                    @delete="${this.handleRemoveWidget}"
                  >
                  </r-widget>
                </li>
                `,
            )
          }
          ${
            this.widgetToDisplayKeyArray.length === 0 || this.isEditingWidgetsPrefs
              ? this.placholderTemplate()
              : nothing
          }
        </ul>
      `
  }

  skeletonTemplate(): TemplateResult {
    return html`
        <ul class="widget-tiles">
          ${
            map(
              range(this.widgetMaxCount),
              () => html`
                <li>
                  <r-widget loading>
                  </r-widget>
                </li>
              `,
            )
          }
        </ul>
      `
  }

  placholderTemplate(): TemplateResult {
    return html`
        ${
          map(
            range(this.widgetMaxCount - this.widgetToDisplayKeyArray.length),
            () => html`
              <li>
                <r-widget placeholder>
                </r-widget>
              </li>
            `,
          )
        }
      `
  }

  render(): TemplateResult {
    const nonUsed = this.wrapperConfig.availableWidgets.filter(({ uid }) =>
      except(this.wrapperConfig.allowedKeys, this.widgetToDisplayKeyArray).includes(uid),
    )

    return html`
      <div class="widget-layout">
        <header>
          <h2 class="sr-only">${msg(str`Accès rapides`)}</h2>
          <div class="actions">
            ${
              !this.isEditingWidgetsPrefs
                ? html`
                    <button
                      class="btn-secondary small"
                      ?disabled="${
                        Array.from(this.widgetDataMap.values()).some(x => x.loading)
                        || this.loading
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
        </header>
        <div class="content">
          ${this.contentTemplate()}
        </div>
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
