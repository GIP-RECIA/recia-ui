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
import type { Section } from '../../../../filters/src/types/SectionType.ts'
import { faArrowLeft, faWarning } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { $baseServicesLoad, $services } from '../../stores/index.ts'
import { LoadingState } from '../../types/index.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import { alphaSort } from '../../utils/stringUtils.ts'
import styles from './style.scss?inline'
import '../service/index.ts'
import 'filters'

@localized()
@useStores($services)
@useStores($baseServicesLoad)
export class ReciaServicesLayout extends LitElement {
  @property({ type: Boolean })
  show: boolean = false

  @property({ type: Boolean, attribute: 'navigation-drawer-visible' })
  isNavigationDrawerVisible: boolean = false

  @property({ type: Array })
  filters?: Array<Section>

  private activeElement: HTMLElement | undefined

  constructor() {
    super()
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

  updateFilters(_: CustomEvent): void {
    // const { id, checked } = e.detail.activeFilters[0] ?? {}
  }

  contentTemplate(): TemplateResult | typeof nothing {
    const loadingState = $baseServicesLoad.get()

    switch (loadingState) {
      case LoadingState.ERROR:
        return this.errorTemplate()

      case LoadingState.LOADED:
        return this.tilesTemplate()

      case LoadingState.UNLOADED:
      case LoadingState.LOADING:
      default:
        return this.skeletonTemplate()
    }
  }

  errorTemplate(): TemplateResult {
    return html`
        <div class="error">
          ${getIcon(faWarning)}
          <p>
            ${msg(str`Une erreur est survenue lors de la récupération des services.\nTentez de rafraichir la page.`)}
          </p>
        </div>
      `
  }

  skeletonTemplate(): TemplateResult {
    return html`
        <!-- <r-filters
          loading
          loding-sections="1"
          loding-sections-items="9"
        >
        </r-filters> -->
        <ul>
          ${map(range(20), () => html`<li class="skeleton"></li>`)}
        </ul>
      `
  }

  tilesTemplate(): TemplateResult {
    const services = $services.get() ?? []

    return html`
        ${
          this.filters
            ? html`
                <r-filters
                  .data="${this.filters}"
                  @update-filters="${this.updateFilters}"
                >
                </r-filters>
              `
            : nothing
        }
        <ul>
          ${
            repeat(
              services?.sort((a, b) => alphaSort(a.name, b.name, 'asc')),
              service => service.id,
              service => html`
                  <li>
                    <r-service
                      id="${service.id}"
                      .fname="${service.fname}"
                      name="${service.name}"
                      category="${service.category ?? nothing}"
                      icon-url="${service.iconUrl ?? nothing}"
                      .link="${service.link}"
                      ?new="${service.new}"
                      ?favorite="${service.favorite}"
                      ?more="${service.more}"
                      @open-more="${(e: CustomEvent) => this.dispatchEvent(new CustomEvent(e.type, e))}"
                    >
                    </r-service>
                  </li>
                `,
            )
          }
        </ul>
      `
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
          ${this.contentTemplate()}
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('services-layout')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaServicesLayout)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaServicesLayout
  }
}
