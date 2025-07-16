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

import type { Section } from 'filters/src/types/SectionType.ts'
import type { TemplateResult } from 'lit'
import type { Service } from '../../types/ServiceType.ts'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import 'filters/dist/r-filters.js'
import '../service/index.ts'

const tagName = componentName('services-layout')

@localized()
@customElement(tagName)
export class ReciaServicesLayout extends LitElement {
  @property({ type: Boolean })
  show: boolean = false

  @property({ type: Boolean, attribute: 'navigation-drawer-visible' })
  isNavigationDrawerVisible: boolean = false

  @property({ type: Array })
  filters?: Array<Section>

  @property({ type: Array })
  services?: Array<Service>

  private activeElement: HTMLElement | undefined

  constructor() {
    super()
    library.add(
      faArrowLeft,
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('keyup', this.handleKeyPress.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keyup', this.handleKeyPress.bind(this))
  }

  closeMenu(_: Event, resetFocus: boolean = true): void {
    this.dispatchEvent(new CustomEvent('close', { detail: { show: false } }))
    if (resetFocus)
      this.activeElement?.focus()
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (this.show && e.key === 'Escape') {
      e.preventDefault()
      this.closeMenu(e)
    }
  }

  updateFilters(e: CustomEvent): void {
    const { id, checked } = e.detail.activeFilters[0] ?? {}
  }

  render(): TemplateResult {
    return html`
      <div
        id="services-layout"
        class="${classMap({
          'navigation-drawer-visible': this.isNavigationDrawerVisible,
        })}services-layout"
        style="${styleMap({
          display: this.show ? undefined : 'none',
        })}"
        tabindex="-1"
      >
        <div class="container page-layout">
          <header>
            <div class="heading">
              <button
                class="btn-tertiary circle"
                aria-label="${msg(str`Fermer le menu`)}"
                @click="${this.closeMenu}"
              >
                ${getIcon(faArrowLeft)}
              </button>
              <h1>${msg(str`Tous les services`)}</h1>
            </div>
            ${
              false
                ? html`
                    <div class="sort">
                      <label for="services-sort">Trier par :</label>
                      <select name="" id="services-sort">
                        <button>
                          <selectedcontent></selectedcontent>
                        </button>
                        <option value="pop-up">Popularité<i class="fa-solid fa-arrow-up"></i></option>
                        <option value="pop-down">Popularité<i class="fa-solid fa-arrow-down"></i></option>
                        <option value="pop-up">Alphabétique<i class="fa-solid fa-arrow-up"></i></option>
                        <option value="pop-down">Alphabétique<i class="fa-solid fa-arrow-down"></i></option>
                      </select>
                    </div>
                  `
                : nothing
            }
          </header>
          <r-filters
            .data="${this.filters}"
            @update-filters="${this.updateFilters}"
          >
          </r-filters>
          <ul>
            ${
              repeat(
                this.services ?? [],
                service => service,
                service => html`
                    <li>
                      <r-service
                        name="${service.name}"
                        category="${service.category}"
                        icon-url="${service.iconUrl}"
                        .link="${service.link}"
                        ?new="${service.new}"
                        ?favorite="${service.favorite}"
                        ?more="${service.more}"
                      >
                      </r-service>
                    </li>
                  `,
              )
            }
          </ul>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaServicesLayout
  }
}
