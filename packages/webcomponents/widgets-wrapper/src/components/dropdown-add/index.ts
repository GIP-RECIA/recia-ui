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
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../../../common/config'
import langHelper from '../../helpers/langHelper'
import { getIcon } from '../../utils/fontawesomeUtils'
import { setLocale } from '../../utils/localizationUtils'
import styles from './style.scss?inline'

@localized()
export class ReciaDropdownAdd extends LitElement {
  @property({ type: Array })
  items?: Array<{ key: string, value: string }>

  @property({ type: Boolean })
  disabled: boolean = false

  @state()
  isExpanded: boolean = false

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
    window.addEventListener('keyup', this.handleOutsideEvents.bind(this))
    window.addEventListener('click', this.handleOutsideEvents.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keyup', this.handleKeyPress.bind(this))
    window.removeEventListener('keyup', this.handleOutsideEvents.bind(this))
    window.removeEventListener('click', this.handleOutsideEvents.bind(this))
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (this.isExpanded && e.key === 'Escape') {
      e.preventDefault()
      this.close(e)
    }
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    if (
      this.isExpanded
      && e.target instanceof HTMLElement
      && !(this.contains(e.target) || e.composedPath().includes(this))
    ) {
      this.close(undefined, false)
    }
  }

  toggle(_: Event): void {
    this.isExpanded = !this.isExpanded
  }

  close(_: Event | undefined = undefined, resetFocus: boolean = true): void {
    this.isExpanded = false
    if (resetFocus)
      this.shadowRoot?.getElementById('add')?.focus()
  }

  handleItemClick(_: Event, key: string): void {
    this.close()
    this.dispatchEvent(new CustomEvent('item-click', {
      detail: { key },
    }))
  }

  render(): TemplateResult {
    return html`
      <div class="dropdown">
        <button
          id="add"
          class="btn-secondary small"
          ?disabled="${this.disabled}"
          aria-expanded="${this.isExpanded}"
          aria-controls="dropdown-content"
          aria-label="Menu ajouter"
          @click="${this.toggle}"
        >
          ${
            langHelper.localTranslation(
              `message.buttons.Ajouter`,
              'Ajouter',
            )
          }
          ${getIcon(faAdd)}
        </button>
        <ul
          id="dropdown-content"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
        >
          ${
            repeat(
              this.items ?? [],
              item => item.key,
              ({ key, value }) => html`
                <li>
                  <button
                    @click="${(e: Event) => this.handleItemClick(e, key)}"
                  >
                    ${value}
                  </button>
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

const tagName = componentName('dropdown-add')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaDropdownAdd)
}

declare global {
  interface Window {
    WidgetAdapter: any
  }
  interface HTMLElementTagNameMap {
    [tagName]: ReciaDropdownAdd
  }
}
