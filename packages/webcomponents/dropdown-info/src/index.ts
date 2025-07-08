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
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { Location } from './types/LocationType.ts'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaDropdownInfo extends LitElement {
  @property({ type: String })
  location?: Location = Location.BottomRight

  @property({ type: String })
  label?: string = ''

  @property({ type: Boolean, attribute: 'no-padding' })
  noPadding = false

  @property({ type: Boolean, attribute: 'no-mask' })
  noMask = false

  @state()
  isExpanded = false

  constructor() {
    super()
    library.add(
      faCircleInfo,
    )
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

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('location')) {
      if (!this.location || !Object.values(Location).includes(this.location)) {
        this.location = Location.BottomRight
      }
    }
    if (_changedProperties.has('label')) {
      if (!this.label || this.label.trim().length === 0) {
        this.label = ''
      }
    }
    return true
  }

  toggleDropdown(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
    this.isExpanded = !this.isExpanded
  }

  closeDropdown(e: Event, resetFocus: boolean = true): void {
    e.stopPropagation()
    this.isExpanded = false
    if (resetFocus)
      this.shadowRoot?.getElementById('dropdown-info-button')?.focus()
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (this.isExpanded && e.key === 'Escape') {
      e.preventDefault()
      this.closeDropdown(e)
    }
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    if (
      this.isExpanded
      && e.target instanceof HTMLElement
      && !(this.contains(e.target) || e.composedPath().includes(this))
    ) {
      this.isExpanded = false
    }
  }

  render(): TemplateResult {
    return html`
      <div class="dropdown-info">
        <button
          id="dropdown-info-button"
          class="${classMap({
            active: this.isExpanded,
          })}btn-secondary-toggle circle"
          aria-expanded="${this.isExpanded}"
          aria-controls="dropdown-info-menu"
          aria-label="${msg(str`Menu ${this.label}`)}"
          @click="${this.toggleDropdown}"
        >
          ${getIcon(faCircleInfo)}
        </button>
        ${
          !this.noMask
            ? html`
                <div
                  class="mask"
                  style="${styleMap({
                    display: this.isExpanded ? undefined : 'none',
                  })}"
                >
                </div>
              `
            : nothing
        }
        <div
          id="dropdown-info-menu"
          class="${classMap({
            'no-padding': this.noPadding,
            [this.location!]: true,
          })}menu"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
        >
          <slot></slot>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaDropdownInfo
  }
}
