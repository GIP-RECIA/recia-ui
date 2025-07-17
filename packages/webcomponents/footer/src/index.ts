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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import templateService from './services/templateService.ts'
import styles from './style.scss?inline'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

@localized()
export class ReciaFooter extends LitElement {
  @property({ type: String })
  domain = window.location.hostname

  @property({ type: String, attribute: 'portal-path' })
  portalPath = ''

  @property({ type: String, attribute: 'template-api-url' })
  templateApiUrl = ''

  @property({ type: Array })
  links: Array<Link> = []

  @state()
  template: Template | null = null

  constructor() {
    super()
    library.add(
      faHeart,
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    if (
      _changedProperties.has('domain')
      || _changedProperties.has('portalPath')
      || _changedProperties.has('templateApiUrl')
    ) {
      this._getTemplate()
      return false
    }
    if (_changedProperties.has('template') && this.template !== null) {
      return true
    }
    return false
  }

  private async _getTemplate() {
    const template = await templateService.get(this.templateApiUrl, this.domain)
    if (template !== null) {
      this.template = template
    }
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
                    repeat(['Mentions légales et CGU', 'Accessibilité : partiellement conforme'], link => link, link => html`
                      <li>
                        <a href="#">${link}</a>
                      </li>
                    `)
                  }
                </ul>
                <ul class="parteners">
                  ${
                    repeat(this.template.sponsors || [], parnter => parnter, partner => html`
                      <li>
                        <a href="${partner.url}" target="_blank">
                          <img src="${partner.logoPath}" title="${partner.name}" />
                        </a>
                      </li>
                    `)
                  }
                </ul>
              </div>
            </div>
            <div class="bottom">
              <div class="container">
                <ul class="links">
                  ${
                    repeat(this.links, link => link, link => html`
                      <li>
                        <a
                          href="${link.href}"
                          target="${link.target ?? nothing}"
                          rel="${link.rel ?? nothing}"
                        >
                          ${link.name}
                        </a>
                      </li>
                    `)
                  }
                  <li>©${new Date().getFullYear()} - ${this.template.name}</li>
                </ul>
                <span class="made-by">${getIcon(faHeart)} ${msg(str`Fait avec amour par le ${'GIP RECIA'}`)}</span>
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
