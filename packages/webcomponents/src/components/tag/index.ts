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

import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { prefix } from '../../../config.ts'
import styles from './style.scss?inline'

const tagName = `${prefix}tag`

@customElement(tagName)
export class ReciaTag extends LitElement {
  @property({ type: String })
  type?: string

  @property({ type: Boolean })
  disabled = false

  @property({ type: Boolean })
  circle = false

  @property({ type: String })
  size?: 'small'

  @property({ type: Boolean })
  active = false

  render() {
    return html`
      <button
        type=${this.type ?? nothing}
        ?disabled=${this.disabled}
        class="tag${this.circle ? ' circle' : ''}${this.size ? ` ${this.size}` : ''}${this.active ? ' active' : ''}"
      >
        <slot></slot>
      </button>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaTag
  }
}
