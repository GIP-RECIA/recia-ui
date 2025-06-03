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

import type { PropertyValues, TemplateResult } from 'lit'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAnglesRight, faArrowRight, faChevronDown, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { getIcon, getIconWithStyle } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'
import { slugify } from './utils/stringUtils.ts'

const tagName = componentName(name)

interface Item {
  name: string
  icon?: string
  link: string
}

@localized()
@customElement(tagName)
export class ReciaWidget extends LitElement {
  @property({ type: String })
  name = ''

  @property({ type: String })
  subtitle?: string

  @property({ type: Number })
  notifications = 0

  @property({ type: String })
  link = ''

  @property({ type: String })
  items = '[]'

  @property({ type: String, attribute: 'empty-icon' })
  emptyIcon?: string

  @property({ type: String, attribute: 'empty-text' })
  emptyText = msg(str`Aucun élément`)

  @property({ type: Boolean, attribute: 'empty-discover' })
  emptyDiscover = false

  @state()
  isExpanded = false

  @state()
  localItems: Array<Item> = []

  constructor() {
    super()
    library.add(
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('items')) {
      this.updateItems()
    }
    return true
  }

  updateItems(): void {
    const parsedItems = JSON.parse(this.items)
    this.localItems = parsedItems
  }

  toggleDropdown(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
    this.isExpanded = !this.isExpanded
  }

  headingTemplate(): TemplateResult {
    return html`
      <h3>${this.name}</h3>
      ${
        this.subtitle && this.subtitle.trim().length > 0
          ? html`<span class="heading-subtitle">${this.subtitle}</span>`
          : nothing
      }
    `
  }

  notificationsTemplate(): TemplateResult | typeof nothing {
    return this.notifications > 0
      ? html`<span class="counter">${this.notifications}<span class="sr-only"> ${msg(str`notifications`)}</span></span>`
      : nothing
  }

  render(): TemplateResult {
    const slug = slugify(this.name)

    return html`
      <li class="widget-tile">
        <header>
          <button
            aria-expanded="${this.isExpanded}"
            aria-controls="widget-${slug}-menu"
            aria-label="Widget ${this.name}"
            @click="${this.toggleDropdown}"
          >
            <div class="heading">${this.headingTemplate()}</div>
            <div class="grow-1"></div>
            ${this.notificationsTemplate()}
            ${getIconWithStyle(faChevronDown, { rotate: this.isExpanded ? '180deg' : undefined }, { 'folded-indicator': true })}
          </button>
          <div>
            <a href="${this.link}" aria-label="${this.name}">
              ${getIconWithStyle(faAnglesRight, {}, { 'focus-indicator': true })}
              <div class="heading">${this.headingTemplate()}</div>
            </a>
            <div class="grow-1"></div>
            ${this.notificationsTemplate()}
          </div>
        </header>
        <div
          id="widget-${slug}-menu"
          class="widget-menu"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
        >
          ${
            this.localItems.length > 0
              ? html`
                <ul>
                  ${
                    repeat(this.localItems, item => item.name, item => html`
                      <li>
                        <a href="${item.link}" title="${item.name}">
                          ${unsafeSVG(item.icon)}
                          <span>${item.name}</span>
                        </a>
                      </li>
                    `)
                  }
                </ul>
              `
              : html`
                <div class="empty">
                  ${
                    !this.emptyDiscover
                      ? this.emptyIcon
                        ? unsafeSVG(this.emptyIcon)
                        : getIconWithStyle(faInfoCircle, {}, { 'empty-icon': true })
                      : nothing
                  }
                  <span class="empty-text">
                    ${msg(str`Vous n'avez`)}<span class="large">${this.emptyText}</span>
                  </span>
                  ${
                    this.emptyDiscover
                      ? html`
                          <a href="${this.link}" class="btn-secondary small">
                            ${msg(str`Découvrir`)}${getIcon(faArrowRight)}
                          </a>
                        `
                      : nothing
                  }
                </div>
              `
          }
        </div>
      </li>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaWidget
  }
}
