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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaFooter extends LitElement {
  @property({ type: String })
  domain = window.location.hostname

  @property({ type: String, attribute: 'portal-path' })
  portalPath = ''

  @property({ type: String, attribute: 'template-api-url' })
  templateApiUrl = ''

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

  render(): TemplateResult {
    return html`
      <div class="footer">
        <div class="top">
          <div class="container">
            <img src="./svg/netocentre.svg" class="logo" alt="">
            <ul class="links">
              ${
                repeat(['Découvrir l\'ENT', 'Toute l\'actualité', 'Signaler un bug', 'Plan du site', 'Mentions légales et CGU', 'Accessibilité : partiellement conforme'], link => link, link => html`
                  <li>
                    <a href="#">${link}</a>
                  </li>
                `)
              }
            </ul>
            <ul class="parteners">
              ${
                repeat(['', '', '', '', ''], parnter => parnter, partner => html`
                  <li>
                    <a href="#" target="_blank">
                      <img src="https://placehold.co/69x59" alt="" />
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
                repeat(['Apereo.org', 'ESUP-Portail'], link => link, link => html`
                  <li>
                    <a href="#">${link}</a>
                  </li>
                `)
              }
              <li>©${new Date().getFullYear()} - Net O'Centre</li>
            </ul>
            <span class="made-by">${getIcon(faHeart)} ${msg(str`Fait avec amour par le ${'GIP RECIA'}`)}</span>
          </div>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaFooter
  }
}
