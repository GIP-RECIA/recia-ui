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
import type { Section } from '../../types/SectionType.ts'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../../../common/config.ts'
import { name } from '../../../package.json'
import langHelper from '../../helpers/langHelper.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import '../layout/index.ts'

@localized()
export class ReciaFavoriteDropdown extends LitElement {
  @property({ type: Boolean })
  show: boolean = false

  @property({ type: Array })
  data?: Array<Section>

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

  close(e: Event | undefined = undefined): void {
    e?.stopPropagation()
    this.dispatchEvent(new CustomEvent('close', { detail: { show: false } }))
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (this.show && e.key === 'Escape') {
      e.preventDefault()
      this.close()
    }
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    if (
      this.show
      && e.target instanceof HTMLElement
      && !(this.contains(e.target) || e.composedPath().includes(this))
    ) {
      this.close()
    }
  }

  render(): TemplateResult {
    return html`
      <div
        id="dropdown-favorites-menu"
        class="menu"
        style="${styleMap({
          display: this.show ? undefined : 'none',
        })}"
      >
        <div class="active-indicator"></div>
        <r-favorite-layout
          .data="${this.data}"
        >
        </r-favorite-layout>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(`${name}-dropdown`)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaFavoriteDropdown)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaFavoriteDropdown
  }
}
