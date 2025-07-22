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
import { faBell, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { userStore } from '../../stores/index.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import '../search'
import 'user-menu'

@localized()
@useStores(userStore)
export class ReciaPrincipalContainer extends LitElement {
  @property({ type: String })
  name?: string

  @property({ type: Boolean, attribute: 'search' })
  searchEnabled: boolean = false

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  render(): TemplateResult {
    return html`
      <div class="principal-container">
        <div class="start">
          <span>${this.name}</span>
        </div>
        ${
          this.searchEnabled
            ? html`
              <div class="middle">
                <div>
                  <r-search>
                  </r-search>
                </div>
              </div>
            `
            : nothing
        }
        <div class="end">
          ${
            this.searchEnabled
              ? html`
                  <button
                    class="btn-secondary circle search-button"
                    aria-label="${msg(str`Rechercher dans l'ENT`)}"
                  >
                    ${getIcon(faMagnifyingGlass)}
                  </button>
                `
              : nothing
          }
          ${
            userStore.get()
              ? html`
                  <r-user-menu
                    picture="${userStore.get()!.picture ?? '/images/icones/noPictureUser.svg'}"
                    display-name="${userStore.get()!.displayName}"
                  >
                  </r-user-menu>
                `
              : nothing
          }
          ${
            false
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
