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

import type { ReciaFavoriteBottomSheet } from 'favorite'
import type { TemplateResult } from 'lit'
import type { Ref } from 'lit/directives/ref.js'
import type { DrawerItem, Link, UpdatedFavoriteSection } from '../../types/index.ts'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faGrip, faHouse } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import pathHelper from '../../helpers/pathHelper.ts'
import { $favoriteMenu, $services, updateFavoritesFromFavorites, updateServices } from '../../stores/index.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import 'favorite'

@localized()
@useStores($favoriteMenu)
export class ReciaNavigationDrawer extends LitElement {
  @property({ type: String })
  logo?: string

  @property({ type: String })
  name?: string

  @property({ type: Object, attribute: 'home-link' })
  homeLink?: Link

  @property({ type: Boolean })
  visible: boolean = false

  @property({ type: Array })
  items?: Array<DrawerItem>

  @property({ type: Boolean, attribute: 'expanded' })
  isExpanded: boolean = false

  @property({ type: Boolean, attribute: 'services-layout-state' })
  isServicesLayout: boolean = false

  @state()
  isFavoriteDrawer: boolean = false

  favoriteBottomSheetRef: Ref<ReciaFavoriteBottomSheet> = createRef()

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('keyup', this.handleOutsideEvents.bind(this))
    window.addEventListener('click', this.handleOutsideEvents.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    window.removeEventListener('keyup', this.handleOutsideEvents.bind(this))
    window.removeEventListener('click', this.handleOutsideEvents.bind(this))
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    if (
      this.isExpanded
      && e.target instanceof HTMLElement
      && !(this.contains(e.target) || e.composedPath().includes(this))
    ) {
      this.closeDrawer()
    }
  }

  toggleDrawer(_: Event): void {
    this.dispatchEvent(new CustomEvent('toggle', { detail: { isExpanded: !this.isExpanded } }))
  }

  closeDrawer(_: Event | undefined = undefined): void {
    this.dispatchEvent(new CustomEvent('toggle', { detail: { isExpanded: false } }))
  }

  toggleServices(_: Event): void {
    this.closeDrawer()
    this.dispatchEvent(new CustomEvent('toggle-services-layout', { detail: { show: !this.isServicesLayout } }))
  }

  openFavoriteBottomSheet(_: Event): void {
    this.getServices()
    this.closeDrawer()
    this.favoriteBottomSheetRef.value!.dispatchEvent(new CustomEvent('open'))
  }

  openFavoriteDropdown(_: CustomEvent): void {
    this.getServices()
    this.closeDrawer()
  }

  getServices(): void {
    if (!$services.get()) {
      updateServices()
    }
  }

  handleFavoriteUpdate(e: CustomEvent): void {
    const { newValue }: { newValue?: Array<UpdatedFavoriteSection> } = e.detail
    if (!newValue)
      return

    updateFavoritesFromFavorites(newValue)
  }

  emitEvent(_: Event): void {
    this.closeDrawer()
    this.dispatchEvent(new CustomEvent('launch', { detail: { } }))
  }

  itemTemplate(item: DrawerItem): TemplateResult {
    const content: TemplateResult = html`
      <div class="active-indicator"></div>
      <div class="icon">
        ${getIcon(item.icon)}
      </div>
      <span class="text">${item.name}</span>
    `

    return item.link
      ? html`
          <li>
            <a
              href="${item.link.href}"
              target="${item.link.target ?? nothing}"
              rel="${item.link.rel ?? nothing}"
              title="${item.name}"
              aria-label="${item.ariaLabel ?? nothing}"
              class="${classMap({
                active: pathHelper.isCurrentPage(item.link.href),
              })}"
              aria-current="${pathHelper.isCurrentPage(item.link.href) ?? nothing}"
              @click="${this.closeDrawer}"
            >
              ${content}
            </a>
          </li>
        `
      : html`
          <li>
            <button
              title="${item.name}"
              aria-label="${item.ariaLabel ?? nothing}"
              @click="${(e: Event) => {
                this.emitEvent(e)
                this.closeDrawer()
              }}"
            >
              ${content}
            </button>
          </li>
        `
  }

  render(): TemplateResult {
    const favoriteMenu = $favoriteMenu.get()

    return html`
      <button
        class="drawer-toggle"
        aria-controls="navigation-drawer"
        aria-label="${msg(str`Tiroir de navigation`)}"
        @click="${this.toggleDrawer}"
      >
        <svg aria-hidden="true">
          <use href="${this.logo}"></use>
        </svg>
        <span>${msg(str`Menu`)}</span>
      </button>
      <div
        id="navigation-drawer"
        class="${classMap({
          visible: this.visible,
          expended: this.isExpanded,
        })}navigation-drawer"
      >
        <div>
          <span>${this.name}</span>
        </div>
        <ul>
          ${this.itemTemplate({
            name: msg(str`Accueil`),
            ariaLabel: msg(str`Retourer à l'accueil`),
            icon: faHouse,
            link: this.homeLink,
          })}
          <li>
            <button
              title="${msg(str`Tous les services`)}"
              aria-label=""
              class="${classMap({
                active: this.isServicesLayout,
              })}"
              @click="${this.toggleServices}"
            >
              <div class="active-indicator"></div>
              <div class="icon">
                ${getIcon(faGrip)}
              </div>
              <span class="text">${msg(str`Tous les services`)}</span>
            </button>
          </li>
          <li class="favorites-bottom-sheet">
            <button
              id="toggle-favorite-button"
              title="${msg(str`Favoris`)}"
              @click="${this.openFavoriteBottomSheet}"
            >
              <div class="active-indicator"></div>
              <div class="icon">
                ${getIcon(farStar)}
              </div>
              <span class="text">${msg(str`Favoris`)}</span>
            </button>
          </li>
          <li class="favorites-dropdown">
            <r-favorite-dropdown
              .data="${favoriteMenu}"
              ?expended="${this.isExpanded}"
              @open="${this.openFavoriteDropdown}"
              @updated="${this.handleFavoriteUpdate}"
            >
           </r-favorite-dropdown>
          </li>
          ${
            repeat(
              this.items ?? [],
              item => item.name,
              item => this.itemTemplate(item),
            )
          }
        </ul>
      </div>
      <div class="teleport">
        <r-favorite-bottom-sheet
          ${ref(this.favoriteBottomSheetRef)}
          .data="${favoriteMenu}"
          @updated="${this.handleFavoriteUpdate}"
        >
        </r-favorite-bottom-sheet>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('navigation-drawer')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaNavigationDrawer)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaNavigationDrawer
  }
}
