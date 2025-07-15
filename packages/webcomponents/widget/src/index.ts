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
import type { Item } from './types/ItemType.ts'
import type { Link } from './types/LinkType.ts'
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

@localized()
@customElement(tagName)
export class ReciaWidget extends LitElement {
  @property({ type: String })
  name?: string

  @property({ type: String })
  subtitle?: string

  @property({ type: Number })
  notifications?: number

  @property({ type: Object })
  link?: Link

  @property({ type: Array })
  items?: Array<Item>

  @property({ type: String, attribute: 'empty-icon' })
  emptyIcon?: string

  @property({ type: String, attribute: 'empty-text' })
  emptyText: string = msg(str`Aucun élément`)

  @property({ type: Boolean, attribute: 'empty-discover' })
  emptyDiscover: boolean = false

  @state()
  isExpanded: boolean = false

  constructor() {
    super()
    library.add(
      faAnglesRight,
      faArrowRight,
      faChevronDown,
      faInfoCircle,
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  toggleDropdown(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
    this.isExpanded = !this.isExpanded
  }

  clickOnItem(item: Item): void {
    this.dispatchEvent(new CustomEvent('click-on-item', { detail: { item } }))
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
    return this.notifications && this.notifications > 0
      ? html`
          <span class="badge lg">
            ${this.notifications}
            <span class="sr-only">${msg(str`notifications`)}</span>
          </span>
        `
      : nothing
  }

  itemTemplate(item: Item): TemplateResult {
    const content: TemplateResult = html`
      ${unsafeSVG(item.icon)}
      <span>${item.name}</span>
    `

    return html`
      <li>
        ${
          item.link
            ? html`
                <a
                  href="${item.link.href}"
                  target="${item.link.target ?? nothing}"
                  rel="${item.link.rel ?? nothing}"
                  title="${item.name}"
                >
                  ${content}
                </a>
              `
            : html`
                <button
                  title="${item.name}"
                  @click="${() => this.clickOnItem(item)}"
                >
                  ${content}
                </button>
              `
        }
      </li>
    `
  }

  render(): TemplateResult | typeof nothing {
    if (!this.name)
      return nothing

    const slug = slugify(this.name)

    return html`
      <div class="widget">
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
            ${
              getIconWithStyle(
                faChevronDown,
                { rotate: this.isExpanded ? '180deg' : undefined },
                { 'folded-indicator': true },
              )
            }
          </button>
          <div>
            ${
              this.link
                ? html`
                    <a
                      href="${this.link.href}"
                      target="${this.link.target ?? nothing}"
                      rel="${this.link.rel ?? nothing}"
                      aria-label="${this.name}"
                    >
                      ${getIconWithStyle(faAnglesRight, undefined, { 'focus-indicator': true })}
                      <div class="heading">${this.headingTemplate()}</div>
                    </a>
                  `
                : html`<div class="heading">${this.headingTemplate()}</div>`
            }
            <div class="grow-1"></div>
            ${this.notificationsTemplate()}
          </div>
        </header>
        <div
          id="widget-${slug}-menu"
          class="menu"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
        >
          ${
            this.items && this.items.length > 0
              ? html`
                  <ul>
                    ${
                      repeat(
                        this.items,
                        item => item,
                        item => this.itemTemplate(item),
                      )
                    }
                  </ul>
                `
              : html`
                  <div class="empty">
                    ${
                      !this.emptyDiscover
                        ? this.emptyIcon
                          ? unsafeSVG(this.emptyIcon)
                          : getIconWithStyle(faInfoCircle, undefined, { icon: true })
                        : nothing
                    }
                    <span class="text">
                      ${msg(str`Vous n'avez`)}
                      <span class="large">${this.emptyText}</span>
                    </span>
                    ${
                      this.emptyDiscover && this.link
                        ? html`
                            <a
                              href="${this.link.href}"
                              target="${this.link.target ?? nothing}"
                              rel="${this.link.rel ?? nothing}"
                              class="btn-secondary small"
                            >
                              ${msg(str`Découvrir`)}${getIcon(faArrowRight)}
                            </a>
                          `
                        : nothing
                    }
                  </div>
                `
          }
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaWidget
  }
}
