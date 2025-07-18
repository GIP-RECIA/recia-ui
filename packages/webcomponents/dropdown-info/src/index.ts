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
import type { Ref } from 'lit/directives/ref.js'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { Location } from './types/LocationType.ts'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

@localized()
export class ReciaDropdownInfo extends LitElement {
  @property({ type: String })
  location?: Location = Location.BottomRight

  @property({ type: String })
  label?: string = ''

  @property({ type: Boolean, attribute: 'no-padding' })
  noPadding: boolean = false

  @property({ type: Boolean, attribute: 'no-mask' })
  noMask: boolean = false

  @state()
  isExpanded: boolean = false

  maskRef: Ref<HTMLElement> = createRef()

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('keyup', this.handleKeyPress.bind(this))
    window.addEventListener('keyup', this.handleOutsideEvents.bind(this))
    window.addEventListener('click', this.handleOutsideEvents.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.handleClick.bind(this))
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

  toggle(_: Event): void {
    this.isExpanded = !this.isExpanded
  }

  close(_: Event | undefined = undefined, resetFocus: boolean = true): void {
    this.isExpanded = false
    if (resetFocus)
      this.shadowRoot?.getElementById('dropdown-info-button')?.focus()
  }

  handleClick(e: MouseEvent): void {
    if (this.isExpanded && e.composedPath().includes(this.maskRef.value!))
      this.close(e)
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
          @click="${this.toggle}"
        >
          ${getIcon(faCircleInfo)}
        </button>
        ${
          !this.noMask
            ? html`
                <div
                  ${ref(this.maskRef)}
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
const tagName = componentName(name)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaDropdownInfo)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaDropdownInfo
  }
}
