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

const tagName = componentName('navigation-drawer')

@localized()
@customElement(tagName)
export class ReciaNavigationDrawer extends LitElement {
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
      <button class="drawer-toggle" aria-controls="navigation-drawer" aria-label="Tiroir de navigation">
        <svg aria-hidden="true">
          <use xlink:href="./spritemap.svg#NOC-simple"></use>
        </svg>
        <span>Menu</span>
      </button>
      <div id="navigation-drawer" class="navigation-drawer visible">
        <div>
          <span>Lycée international de Palaiseau</span>
        </div>
        <ul>
          <li>
            <a href="#" title="Accueil" aria-label="Retourer à l'accueil" class="back-home active">
              <div class="active-indicator"></div>
              <div class="icon">
                <i class="fa-solid fa-house"></i>
              </div>
              <span class="text">Accueil</span>
            </a>
          </li>
          <li class="dropdown-services">
            <button title="Tous les services">
              <div class="active-indicator"></div>
              <div class="icon">
                <i class="fa-solid fa-grip"></i>
              </div>
              <span class="text">Tous les services</span>
            </button>
          </li>
          <li class="dropdown-favorites">
            <button title="Favoris">
              <div class="active-indicator"></div>
              <div class="icon">
                <i class="fa-regular fa-star"></i>
              </div>
              <span class="text">Favoris</span>
            </button>
          </li>
          <li>
            <a href="#" title="Mediacentre">
              <div class="active-indicator"></div>
              <div class="icon">
                <i class="fa-solid fa-book-open"></i>
              </div>
              <span class="text">Mediacentre</span>
            </a>
          </li>
          <li>
            <a href="#" title="Tutoriels">
              <div class="active-indicator"></div>
              <div class="icon">
                <i class="fa-solid fa-message"></i>
              </div>
              <span class="text">Tutoriels</span>
            </a>
          </li>
        </ul>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaNavigationDrawer
  }
}
