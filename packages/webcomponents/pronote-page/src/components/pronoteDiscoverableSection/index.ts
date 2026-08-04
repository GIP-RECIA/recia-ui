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
import { notificationsTemplate } from '../../templates/notificationsTemplate'
import { getIconWithStyle } from '../../utils/fontawesomeUtils'

@localized()
export class PronoteDiscoverableSection extends LitElement {
  @property({ type: String, attribute: 'display-title' })
  displayTitle?: string

  @property({ type: String, attribute: 'content-classes' })
  contentClasses?: string

  @property({ type: Number, attribute: 'count' })
  count: number = 0

  @state()
  isExpanded: boolean = false

  constructor() {
    super()
  }

  render(): TemplateResult {
    return html`
    <div>

    <div class="widescreen">
      <h2 >${this.displayTitle}</h2>
      ${notificationsTemplate(this.count)}
    </div>

      <button class="h2-wrapper" aria-expanded="${this.isExpanded}" @click="${() => { this.isExpanded = !this.isExpanded }}" >
        <h2>${this.displayTitle}
      </h2>
        <div class="grow-1"></div>
          ${notificationsTemplate(this.count)}
        ${
          getIconWithStyle(
            faChevronDown,
            { rotate: this.isExpanded ? '180deg' : undefined },
            { 'folded-indicator': true },
          )
        }
      </button>

      <div class="${`${this.contentClasses} ${this.isExpanded ? '' : 'not-expanded'}`}">
        <slot></slot>
      </div>
    </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('pronote-discoverable-section')

if (!customElements.get(tagName)) {
  customElements.define(tagName, PronoteDiscoverableSection)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: PronoteDiscoverableSection
  }
}
