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
import type { Ref } from 'lit/directives/ref.js'
import type {
  DrawerItem,
  Link,
  UpdatedFavoriteSection,
} from '../../types/index.ts'
import type { ReciaFavoriteBottomSheet } from '../favorite/bottom-sheet/index.ts'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { componentName } from '../../../../common/config.ts'
import grid from '../../assets/svg/grid.svg?raw'
import home from '../../assets/svg/home.svg?raw'
import star from '../../assets/svg/star.svg?raw'
import langHelper from '../../helpers/langHelper.ts'
import {
  $favoriteMenu,
  $settings,
  updateFavoritesFromFavorites,
  updateServices,
} from '../../stores/index.ts'
import { getSvgIcon } from '../../utils/iconUtils.ts'
import { getDomainLink, isCurrentPage } from '../../utils/linkUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import '../favorite/bottom-sheet/index.ts'
import '../favorite/dropdown/index.ts'

@localized()
@useStores($favoriteMenu)
@useStores($settings)
export class ReciaNavigationDrawer extends LitElement {
  @property({ type: String })
  name?: string

  @property({ type: Boolean })
  visible: boolean = false

  @property({ type: Boolean, attribute: 'expanded' })
  isExpanded: boolean = false

  @property({ type: Boolean, attribute: 'services-layout-state' })
  isServicesLayout: boolean = false

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
    updateServices()
    this.closeDrawer()
    this.favoriteBottomSheetRef.value!.dispatchEvent(new CustomEvent('open'))
  }

  openFavoriteDropdown(_: CustomEvent): void {
    updateServices()
    this.dispatchEvent(new CustomEvent('toggle-favorite-dropdown', { detail: { show: true } }))
    this.closeDrawer()
  }

  closeFavoriteDropdown(_: CustomEvent): void {
    this.dispatchEvent(new CustomEvent('toggle-favorite-dropdown', { detail: { show: false } }))
  }

  handleFavoriteUpdate(e: CustomEvent): void {
    const { newValue }: { newValue?: UpdatedFavoriteSection[] } = e.detail
    if (!newValue)
      return

    updateFavoritesFromFavorites(newValue)
  }

  emitEvent(_: Event): void {
    this.closeDrawer()
    this.dispatchEvent(new CustomEvent('launch', { detail: { } }))
  }

  itemTemplate(item: DrawerItem): TemplateResult {
    const icon = item.icon.startsWith('<svg ')
      ? unsafeSVG(item.icon)
      : getSvgIcon(item.icon)

    const content: TemplateResult = html`
      <div class="active-indicator"></div>
      <div class="icon">${icon}</div>
      <span class="text">${item.name}</span>
    `

    return item.link
      ? html`
          <li>
            <a
              id="nav-${item.id}"
              href="${getDomainLink(item.link.href)}"
              target="${item.link.target ?? nothing}"
              rel="${item.link.rel ?? nothing}"
              title="${item.name}"
              aria-label="${item.ariaLabel ?? nothing}"
              class="${classMap({
                active: item.isCurrent || (item.autoDetectCurrent === true && isCurrentPage(item.link.href)),
              })}"
              aria-current="${
                (item.isCurrent || (item.autoDetectCurrent === true && isCurrentPage(item.link.href))) ?? nothing
              }"
              @click="${this.closeDrawer}"
            >
              ${content}
            </a>
          </li>
        `
      : html`
          <li>
            <button
              id="nav-${item.id}"
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
    const { contextApiUrl, drawerItems, defaultOrgIconUrl, orgIconUrl, homePage } = $settings.get()
    const homeLink: Link = {
      href: getDomainLink(contextApiUrl ?? '/'),
      target: '_self',
    }

    return html`
      <nav
        role="navigation"
        aria-label="${msg(str`Tiroir de navigation`)}"
      >
        <button
          class="drawer-toggle"
          aria-expanded="${this.visible || this.isExpanded}"
          aria-controls="navigation-drawer"
          aria-label="${msg(str`Tiroir de navigation`)}"
          @click="${this.toggleDrawer}"
        >
          ${getSvgIcon(orgIconUrl ?? defaultOrgIconUrl)}
          <span>${this.isExpanded ? msg(str`Fermer`) : msg(str`Menu`)}</span>
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
            ${
              this.itemTemplate({
                id: 'home',
                name: msg(str`Accueil`),
                ariaLabel: msg(str`Retourner à l'accueil`),
                icon: home,
                link: homeLink,
                isCurrent: homePage,
              })
            }
            <li>
              <button
                id="nav-all-services"
                title="${msg(str`Tous les services`)}"
                class="${classMap({
                  active: this.isServicesLayout,
                })}"
                @click="${this.toggleServices}"
              >
                <div class="active-indicator"></div>
                <div class="icon">
                  ${unsafeSVG(grid)}
                </div>
                <span class="text">${msg(str`Tous les services`)}</span>
              </button>
            </li>
            <li id="nav-favorite">
              <button
                title="${msg(str`Favoris`)}"
                class="favorites-bottom-sheet"
                @click="${this.openFavoriteBottomSheet}"
              >
                <div class="active-indicator"></div>
                <div class="icon">
                  ${unsafeSVG(star)}
                </div>
                <span class="text">${msg(str`Favoris`)}</span>
              </button>
              <r-favorite-dropdown
                .data="${favoriteMenu}"
                ?expended="${this.isExpanded}"
                class="favorites-dropdown"
                @open="${this.openFavoriteDropdown}"
                @close="${this.closeFavoriteDropdown}"
                @updated="${this.handleFavoriteUpdate}"
              >
             </r-favorite-dropdown>
            </li>
            ${
              repeat(
                drawerItems ?? [],
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
      </nav>
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
