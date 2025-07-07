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
import { library } from '@fortawesome/fontawesome-svg-core'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import '../search'
import 'user-menu/dist/r-user-menu.js'

const tagName = componentName('principal-container')

@localized()
@customElement(tagName)
export class ReciaPrincipalContainer extends LitElement {
  constructor() {
    super()
    library.add(
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  render(): TemplateResult {
    return html`
      <div class="principal-container">
        <div class="start">
          <span>Lycée international de Palaiseau</span>
        </div>
        <div class="middle">
          <div>
            <r-search>
            </r-search>
          </div>
        </div>
        <div class="end">
          <button class="btn-secondary circle search-button" aria-label="Rechercher dans l'ENT">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <r-user-menu>
          </r-user-menu>
          <div class="notification">
            <div class="notification-dot top right"></div>
            <button class="btn-secondary circle" aria-controls="notification-drawer" aria-expanded="false" aria-label="Tiroir de notifications">
              <i class="fa-solid fa-bell"></i>
            </button>
          </div>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaPrincipalContainer
  }
}
