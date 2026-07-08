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
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { componentName } from 'common/config.ts'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import langHelper from '../../helpers/langHelper.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

@localized()
export class ReciaTablist extends LitElement {
  @property({ type: String, attribute: 'id-prefix' })
  idPrefix?: string

  @property({ type: Array })
  tabs: string[] = []

  @property({ type: Number, attribute: 'active-tab' })
  activeTab: number = 0

  tablistRef: Ref<HTMLUListElement> = createRef()

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  private setActiveTab(tab: number): void {
    this.activeTab = tab
    this.tablistRef.value?.querySelector(`#${this.idPrefix}-tab-${tab}`)?.focus()
    this.dispatchEvent(new CustomEvent('set-active-tab', {
      detail: {
        tab,
      },
    }))
  }

  private changeActiveTab(e: KeyboardEvent): void {
    let index: number | undefined
    const active = this.activeTab

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        index = active - 1 > -1
          ? active - 1
          : this.tabs.length - 1
        break
      case 'ArrowRight':
        e.preventDefault()
        index = active + 1 < this.tabs.length
          ? active + 1
          : 0
        break
      case 'Home':
        e.preventDefault()
        index = 0
        break
      case 'End':
        e.preventDefault()
        index = this.tabs.length - 1
        break
      default:
        index = undefined
        break
    }

    if (
      index === undefined
      || active === index
    ) {
      return
    }

    this.setActiveTab(index)
  }

  render(): TemplateResult {
    return html`
      <ul
        ${ref(this.tablistRef)}
        role="tablist"
        class="tab-selector"
      >
        ${
          repeat(
            this.tabs ?? [],
            (item, index) => `${item}-${index}`,
            (item, index) => html`
              <li>
                <button
                  id="${this.idPrefix}-tab-${index}"
                  type="button"
                  role="tab"
                  aria-selected="${this.activeTab === index}"
                  aria-controls="${this.idPrefix}-tabpanel-${index}"
                  tabindex="${this.activeTab === index ? '0' : '-1'}"
                  class="tag${classMap({
                    active: this.activeTab === index,
                  })}"
                  @click="${() => this.setActiveTab(index)}"
                  @keydown="${this.changeActiveTab}"
                >
                  ${item}
                </button>
              </li>
            `,
          )
        }
      </ul>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('tablist')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaTablist)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaTablist
  }
}
