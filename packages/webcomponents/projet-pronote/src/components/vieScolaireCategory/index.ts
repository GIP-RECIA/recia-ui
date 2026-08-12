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
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { localized } from '@lit/localize'
import { componentName } from 'common/config.js'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import styles from '../../style.scss?inline'
import { getIconWithStyle } from '../../utils/fontawesomeUtils'

@localized()
export class VieScolaireCategory extends LitElement {
  @property({ type: String, attribute: 'display-title' })
  displayTitle?: string

  @state()
  isExpanded: boolean = false

  constructor() {
    super()
  }

  render(): TemplateResult {
    return html`
   <div class="discoverable-wrapper">
        <button
             class="h3-wrapper"
             aria-expanded="${this.isExpanded}"
             @click="${() => { this.isExpanded = !this.isExpanded }}" >
            <h3>${this.displayTitle}</h3>
            <div class="grow-1"></div>
            ${
              getIconWithStyle(
                faChevronDown,
                { rotate: this.isExpanded ? '180deg' : undefined },
                { 'folded-indicator': true },
              )
            }
          </button>
      <div class="${this.isExpanded ? '' : 'not-expanded-always'}">
        <slot></slot>
      </div>
    </div>
      `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('vie-scolaire-category')

if (!customElements.get(tagName)) {
  customElements.define(tagName, VieScolaireCategory)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: VieScolaireCategory
  }
}
