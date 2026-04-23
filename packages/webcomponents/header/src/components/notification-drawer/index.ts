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
import { faBellSlash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { getIcon, getIconWithStyle } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

@localized()
export class ReciaNotificationDrawer extends LitElement {
  @property({ type: Boolean, attribute: 'expanded' })
  isExpanded: boolean = false

  private layoutRef: Ref<HTMLElement> = createRef()

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('keyup', this.handleOutsideEvents.bind(this))
    document.addEventListener('click', this.handleOutsideEvents.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('keyup', this.handleOutsideEvents.bind(this))
    document.removeEventListener('click', this.handleOutsideEvents.bind(this))
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('isExpanded')) {
      if (this.isExpanded === true) {
        setTimeout(() => {
          this.layoutRef.value?.focus()
        }, 150)
      }
    }
    return true
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    const catchEvents: EventTarget[] = [
      this.parentNode
        ?.querySelector('r-principal-container')
        ?.shadowRoot
        ?.querySelector('r-user-menu')
        ?.shadowRoot
        ?.querySelector('button#notification') as EventTarget,
      this.parentNode
        ?.querySelector('r-principal-container')
        ?.shadowRoot
        ?.querySelector('.notification > button') as EventTarget,
    ]
    if (
      this.isExpanded
      && e.target instanceof HTMLElement
      && !(
        this.contains(e.target)
        || e.composedPath().includes(this)
        || catchEvents?.some(event => e.composedPath().includes(event))
      )
    ) {
      this.closeDrawer()
    }
  }

  closeDrawer(_: Event | undefined = undefined): void {
    this.dispatchEvent(new CustomEvent('close', { detail: { isExpanded: false } }))
  }

  render(): TemplateResult {
    return html`
      <div
        ${ref(this.layoutRef)}
        id="notification-drawer"
        tabindex="-1"
        class="${classMap({
          expended: this.isExpanded,
        })}notification-drawer"
      >
        <button
          type="button"
          class="btn-tertiary circle close"
          aria-label="${msg(str`Fermer le tiroir notification`)}"
          @click="${this.closeDrawer}"
        >
          ${getIcon(faTimes)}
        </button>
        <div class="empty">
          ${getIconWithStyle(faBellSlash, undefined, { icon: true })}
          <span class="text">
            ${msg(str`Vous n'avez`)}
            <span class="large">${msg(str`Aucune notification`)}</span>
          </span>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('notification-drawer')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaNotificationDrawer)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaNotificationDrawer
  }
}
