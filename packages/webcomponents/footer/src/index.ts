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
import type { Link } from './types/LinkType.ts'
import type { Template } from './types/TemplateType.ts'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import TemplateService from './services/templateService.ts'
import styles from './style.scss?inline'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

@localized()
export class ReciaFooter extends LitElement {
  @property({ type: String })
  domain: string = window.location.hostname

  @property({ type: String, attribute: 'template-api-url' })
  templateApiUrl?: string

  @property({ type: Array, attribute: 'top-links' })
  topLinks?: Array<Link>

  @property({ type: Array, attribute: 'bottom-links' })
  bottomLinks?: Array<Link>

  @state()
  template?: Template

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('domain') || _changedProperties.has('templateApiUrl')) {
      this._getTemplate()
      return false
    }
    if (_changedProperties.has('template') && this.template) {
      return true
    }
    return false
  }

  private async _getTemplate(): Promise<void> {
    if (!this.templateApiUrl)
      return

    this.template = await TemplateService.get(this.templateApiUrl, this.domain)
  }

  linkItemTemplate(link: Link): TemplateResult {
    return html`
        <li>
          <a
            href="${link.href}"
            target="${link.target ?? nothing}"
            rel="${link.rel ?? nothing}"
          >
            ${link.name}
          </a>
        </li>
      `
  }

  render(): TemplateResult | typeof nothing {
    return this.template
      ? html`
          <div class="footer">
            <div class="top">
              <div class="container">
                <div class="logo">
                  <img src="${this.template.logoPath}" alt="${this.template.name}">
                </div>
                <ul class="links">
                  ${
                    repeat(
                      this.topLinks ?? [],
                      link => link,
                      link => this.linkItemTemplate(link),
                    )
                  }
                </ul>
                <ul class="parteners">
                  ${
                    repeat(
                      this.template.sponsors ?? [],
                      parnter => parnter,
                      partner => html`
                        <li>
                          <a href="${partner.url}" target="_blank">
                            <img src="${partner.logoPath}" title="${partner.name}" />
                          </a>
                        </li>
                      `,
                    )
                  }
                </ul>
              </div>
            </div>
            <div class="bottom">
              <div class="container">
                <ul class="links">
                  ${
                    repeat(
                      this.bottomLinks ?? [],
                      link => link,
                      link => this.linkItemTemplate(link),
                    )
                  }
                  <li>©${new Date().getFullYear()} - ${this.template.name}</li>
                </ul>
                <span class="made-by">
                  ${getIcon(faHeart)}
                  ${msg(str`Fait avec amour par le ${'GIP RECIA'}`)}
                </span>
              </div>
            </div>
          </div>
        `
      : nothing
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(name)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaFooter)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaFooter
  }
}
