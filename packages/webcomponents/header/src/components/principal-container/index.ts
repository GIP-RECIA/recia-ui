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
import { faArrowRightToBracket, faBell, faCircleInfo, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../../../common/config.ts'
import { preserveFromSpreading } from '../../config.ts'
import { spreadAttributes } from '../../directives/spreadAttributesDirective.ts'
import langHelper from '../../helpers/langHelper.ts'
import {
  $authenticated,
  $infoEtabData,
  $settings,
  $userInfo,
  $userMenu,
} from '../../stores/index.ts'
import { UserMenuItem } from '../../types/index.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import '../search/index.ts'
import '../user-menu/index.ts'
import '../info-etab/dropdown-info/index.ts'

@localized()
@useStores($infoEtabData)
@useStores($settings)
@useStores($userInfo)
export class ReciaPrincipalContainer extends LitElement {
  @property({ type: Boolean, attribute: 'navigation-drawer-visible' })
  isNavigationDrawerVisible: boolean = false

  @property({ type: Boolean, attribute: 'searching' })
  isSearching: boolean = false

  @property({ type: String })
  name?: string

  @property({ type: Boolean, attribute: 'search-open' })
  searchOpen: boolean = false

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  authenticatedTemplate(): TemplateResult {
    const infoEtabData = $infoEtabData.get()
    const { search, notifications, infoEtab } = $settings.get()
    const userMenu = $userMenu.get()

    return html`
        <div class="principal-container">
          <div class="start">
            <span>${this.name}</span>
            ${
              infoEtab
                ? html`
                    <button
                      id="${UserMenuItem.InfoEtab}"
                      class="btn-secondary-toggle circle"
                      aria-label="${msg(str`Infos de l\'établissement`)}"
                      @click="${(_: Event) => {
                        this.dispatchEvent(new CustomEvent('user-menu-event', {
                          detail: {
                            type: UserMenuItem.InfoEtab,
                          },
                        }))
                      }}"
                    >
                      ${getIcon(faCircleInfo)}
                    </button>
                    <r-info-etab-dropdown-info
                      class="dropdown-info"
                      .data="${infoEtabData}"
                    >
                    </r-info-etab-dropdown-info>
                  `
                : nothing
            }
          </div>
          ${
            search
              ? html`
                <div
                  class="${classMap({
                    'visible': this.searchOpen,
                    'navigation-drawer-visible': this.isNavigationDrawerVisible,
                    'searching': this.isSearching,
                  })}middle"
                >
                  <r-search
                    ?open="${this.searchOpen}"
                    @event="${(e: CustomEvent) => {
                      this.dispatchEvent(new CustomEvent('search-event', e))
                    }}"
                  >
                  </r-search>
                </div>
              `
              : nothing
          }
          <div class="end">
            ${
              search
                ? html`
                    <button
                      style="${styleMap({
                        display: this.searchOpen ? 'none' : undefined,
                      })}"
                      class="btn-secondary circle search-button"
                      aria-label="${msg(str`Rechercher dans l'ENT`)}"
                      @click="${(_: Event) => {
                        this.dispatchEvent(new CustomEvent(
                          'user-menu-event',
                          { detail: { type: UserMenuItem.Search } },
                        ))
                      }}"
                    >
                      ${getIcon(faMagnifyingGlass)}
                    </button>
                  `
                : nothing
            }
            ${
              userMenu
                ? html`
                    <r-user-menu
                      ${
                        spreadAttributes(
                          userMenu,
                          new Set(preserveFromSpreading),
                        )
                      }
                      @launch="${(e: CustomEvent) => {
                        this.dispatchEvent(new CustomEvent('user-menu-event', e))
                      }}"
                    >
                    </r-user-menu>
                  `
                : nothing
            }
            ${
              notifications
                ? html`
                    <div class="notification">
                      <div class="notification-dot top right"></div>
                      <button
                        class="btn-secondary circle"
                        aria-controls="notification-drawer"
                        aria-expanded="false"
                        aria-label="${msg(str`Tiroir de notifications`)}"
                      >
                        ${getIcon(faBell)}
                      </button>
                    </div>
                  `
                : nothing
            }
          </div>
        </div>
      `
  }

  notAuthenticatedTemplate(): TemplateResult {
    const { signInUrl, defaultOrgIconUrl, orgIconUrl } = $settings.get()

    return html`
        <div class="principal-container not-logged">
          <div class="start">
            <svg class="simple" aria-hidden="true">
              <use href="${orgIconUrl ?? defaultOrgIconUrl}#icone"></use>
            </svg>
          </div>
          <div class="end">
            ${
              signInUrl
                ? html`
                    <a
                      id="${UserMenuItem.Logout}"
                      href="${signInUrl}"
                      target="_self"
                    >
                      ${msg(str`Accéder à l'ENT`)}
                      ${getIcon(faArrowRightToBracket)}
                    </a>
                  `
                : nothing
            }
          </div>
        </div>
      `
  }

  render(): TemplateResult {
    return $authenticated.get()
      ? this.authenticatedTemplate()
      : this.notAuthenticatedTemplate()
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('principal-container')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaPrincipalContainer)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaPrincipalContainer
  }
}
