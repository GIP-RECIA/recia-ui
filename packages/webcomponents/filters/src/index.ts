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
import type { Section } from './types/SectionType.ts'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { getIconWithStyle } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'
import { Item } from './types/ItemType.ts'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaFilters extends LitElement {
  @state()
  data: Array<Section> | null = null

  @state()
  isExpanded = false

  constructor() {
    super()
    library.add(
      faChevronDown,
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

  itemTemplate(section: Section, item: Item): TemplateResult {
    const { id, type } = section
    const { key, value } = item
    const inputId = type === 'radio' ? `${id}-${key}` : key
    const name = type === 'radio' ? id : key

    return html`
        <li>
          <input
            id="${inputId}"
            type="${type}"
            name="${name}"
            value="${key}"
          >
          <label for="${inputId}">${value}</label>
        </li>
      `
  }

  render(): TemplateResult {
    return html`
      <div class="filters">
        <header>
          <button
            aria-expanded="${this.isExpanded}"
            aria-controls="filter-menu"
            @click="${this.toggleDropdown}"
          >
            <span class="heading">${msg(str`Filtres`)}</span>
            <span class="badge">1</span>
            <div class="grow-1"></div>
            ${getIconWithStyle(faChevronDown, { rotate: this.isExpanded ? '180deg' : undefined }, { 'folded-indicator': true })}
          </button>
          <span class="heading">${msg(str`Filtres`)}</span>
        </header>
        <ul
          id="filter-menu"
          class="menu"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
        >
          ${
            repeat(
              this.data ?? [],
              section => section,
              section => html`
                <li>
                  <header aria-hidden="true">
                    <span>${section.name}</span>
                  </header>
                  <fieldset>
                    <legend class="sr-only">${section.name}</legend>
                    <ul>
                      ${
                        repeat(
                          section.items,
                          item => item.id,
                          item => this.itemTemplate(section, item)
                        )
                      }
                    </ul>
                  </fieldset>
                </li>
              `,
            )
          }
        </ul>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaFilters
  }
}
