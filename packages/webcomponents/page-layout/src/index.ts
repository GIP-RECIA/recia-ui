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
import type { Link } from './types/linkTypes.ts'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

@localized()
export class ReciaPageLayout extends LitElement {
  @property({ type: Object, attribute: 'back-link' })
  backLink?: Link

  @property({ type: String, attribute: 'page-title' })
  pageTitle?: string

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  render(): TemplateResult | typeof nothing {
    if (!this.pageTitle) {
      console.error('page-title is required')
      return nothing
    }

    return html`
      <div class="page-layout">
        <header>
          <div class="heading">
            ${
              this.backLink
                ? html`
                    <a
                      href="${this.backLink.href}"
                      target="${this.backLink.target ?? nothing}"
                      rel="${this.backLink.rel ?? nothing}"
                      class="btn-tertiary circle"
                      title="${ifDefined(this.backLink.name)}"
                    >
                      ${getIcon(faArrowLeft)}
                    </a>
                  `
                : nothing
            }
            <h1>${this.pageTitle}</h1>
          </div>
          <slot name="header"></slot>
        </header>
        <slot></slot>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(name)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaPageLayout)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaPageLayout
  }
}
