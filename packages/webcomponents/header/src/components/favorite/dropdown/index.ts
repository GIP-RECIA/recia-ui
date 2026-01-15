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
import type { Ref } from 'lit/directives/ref.js'
import type { FavoriteSection } from '../../../types/index.ts'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { componentName } from '../../../../../common/config.ts'
import star from '../../../assets/svg/star.svg?raw'
import langHelper from '../../../helpers/langHelper.ts'
import { setLocale } from '../../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import '../layout/index.ts'

@localized()
export class ReciaFavoriteDropdown extends LitElement {
  @property({ type: Boolean })
  expended: boolean = false

  @property({ type: Array })
  data?: FavoriteSection[]

  @state()
  isExpanded: boolean = false

  private contentRef: Ref<HTMLElement> = createRef()

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

  toggle(_: Event | undefined = undefined): void {
    if (!this.isExpanded) {
      this.dispatchEvent(new CustomEvent('open'))
      this.isExpanded = true
    }
    else {
      this.close()
    }
  }

  close(_: Event | undefined = undefined, resetFocus: boolean = true): void {
    this.dispatchEvent(new CustomEvent('close'))
    this.contentRef.value?.scrollTo({ top: 0 })
    this.isExpanded = false
    if (resetFocus)
      this.shadowRoot?.getElementById('dropdown-favorites-button')?.focus()
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (this.isExpanded && e.key === 'Escape') {
      e.preventDefault()
      this.close()
    }
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    if (
      this.isExpanded
      && e.target instanceof HTMLElement
      && !(this.contains(e.target) || e.composedPath().includes(this))
    ) {
      this.close(undefined, false)
      this.shadowRoot?.querySelector('r-favorite-layout')?.dispatchEvent(new CustomEvent('reset'))
    }
  }

  render(): TemplateResult {
    return html`
      <div class="dropdown-favorites">
        <button
          id="dropdown-favorites-button"
          title="${msg(str`Favoris`)}"
          aria-label="${msg(str`Menu favoris`)}"
          aria-expanded="${this.isExpanded}"
          aria-controls="dropdown-favorites-menu"
          class="${classMap({
            active: this.isExpanded,
            expended: this.expended,
          })}"
          @click="${this.toggle}"
        >
          <div class="active-indicator"></div>
          <div class="icon">
            ${unsafeSVG(star)}
          </div>
          <span class="text">${msg(str`Favoris`)}</span>
        </button>
        <div
          id="dropdown-favorites-menu"
          class="menu"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
        >
          <div class="active-indicator"></div>
          <div
            ${ref(this.contentRef)}
            class="content"
          >
            <r-favorite-layout
              .data="${this.data}"
              @updated="${(e: CustomEvent) => this.dispatchEvent(new CustomEvent(e.type, e))}"
            >
            </r-favorite-layout>
          </div>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('favorite-dropdown')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaFavoriteDropdown)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaFavoriteDropdown
  }
}
