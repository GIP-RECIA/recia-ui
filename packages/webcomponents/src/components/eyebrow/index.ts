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

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { TemplateResult } from 'lit'
import type { DirectiveResult } from 'lit/async-directive.js'
import type { UnsafeHTMLDirective } from 'lit/directives/unsafe-html.js'
import { icon, library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRightFromBracket,
  faChevronDown,
  faChevronUp,
  faGear,
  faInfoCircle,
  faPlay,
  faRightLeft,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { prefix } from '../../../config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { setLocale } from '../../localization.ts'
import styles from './style.scss?inline'

const tagName = `${prefix}eyebrow`

@localized()
@customElement(tagName)
export class ReciaEyebrow extends LitElement {

  @state()
  isExpanded = false

  constructor() {
    super()
    library.add(
      faArrowRightFromBracket,
      faChevronDown,
      faChevronUp,
      faGear,
      faInfoCircle,
      faPlay,
      faRightLeft,
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

  toggleDropdown(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
    this.isExpanded = !this.isExpanded
  }

  closeDropdown(e: Event, resetFocus: boolean = true): void {
    e.stopPropagation()
    this.isExpanded = false
    if (resetFocus)
      this.shadowRoot?.getElementById('eyebrow-button')?.focus()
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
      && !this.contains(e.target)
    ) {
      this.isExpanded = false
    }
  }

  emitEvent(e: Event, type: string): void {
    this.closeDropdown(e, false)
    document.dispatchEvent(new CustomEvent('launch', {
      detail: {
        type,
      },
      bubbles: true,
      composed: true,
    }))
  }

  getIcon(svg: IconDefinition): DirectiveResult<typeof UnsafeHTMLDirective> {
    return unsafeHTML(icon(svg).html.toString())
  }

  render(): TemplateResult {
    return html`
      <div class="eyebrow">
        <div class="eyebrow-notification"></div>
        <button
          id="eyebrow-button"
          class="eyebrow-button"
          aria-expanded="${this.isExpanded}"
          aria-controls="eyebrow-menu"
          aria-label="${msg('Menu mon compte')}"
          @click="${this.toggleDropdown}"
        >
          <img src="https://placehold.co/46x46" alt="" class="picture"/>
          <div class="info">
            <span class="displayname">Anaïs Durant</span>
            <span class="function">Enseignante</span>
          </div>
          ${this.getIcon(this.isExpanded ? faChevronUp : faChevronDown)}
        </button>
        <ul
          id="eyebrow-menu"
          class="eyebrow-menu"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
        >
          <li>
            <button
              id="notification"
              @click="${(e: Event) => this.emitEvent(e, 'notification')}"
            >
              ${msg('Notifications')}
              <div class="counter">4</div>
            </button>
          </li>
          <li>
            <a
              id="settings"
              href="#"
              @click="${this.closeDropdown}"
            >
              ${msg('Mon profil')}
              ${this.getIcon(faGear)}
            </a>
          </li>
          <li>
            <button
              id="info-etab"
              @click="${(e: Event) => this.emitEvent(e, 'info-etab')}"
            >
              ${msg('Infos de l\'établissement')}
              ${this.getIcon(faInfoCircle)}
            </button>
          </li>
          <li>
            <button
              id="change-etab"
              @click="${(e: Event) => this.emitEvent(e, 'change-etab')}"
            >
              ${msg('Changer d\'établissement')}
              ${this.getIcon(faRightLeft)}
            </button>
          </li>
          <li>
            <button
              id="starter"
              @click="${(e: Event) => this.emitEvent(e, 'starter')}"
            >
              ${msg('Lancer le didacticiel')}
              ${this.getIcon(faPlay)}
            </button>
          </li>
          <li>
            <a
              id="logout"
              href="#"
              @click="${this.closeDropdown}"
            >
              ${msg('Déconnexion')}
              ${this.getIcon(faArrowRightFromBracket)}
            </a>
          </li>
        </ul>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaEyebrow
  }
}
