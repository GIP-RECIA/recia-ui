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
import type { LinkType } from './types/LinkType.ts'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { keyed } from 'lit/directives/keyed.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { CategoryType } from './types/CategoryType.ts'
import { OriginType } from './types/OriginType.ts'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaServiceMoreLayout extends LitElement {
  @property({ type: String, attribute: 'icon-url' })
  iconUrl?: string

  @property({ type: String })
  name = ''

  @property({ type: String })
  origin?: OriginType

  @property({ type: String })
  category?: CategoryType

  @property({ type: Boolean, attribute: 'favorite', reflect: true })
  isFavorite = false

  @property({ type: String })
  description = ''

  @property({ type: String })
  video = ''

  @property({ type: Array })
  tutorials: Array<LinkType> = []

  @property({ type: Object, attribute: 'tutorials-link' })
  tutorialsLink?: LinkType

  @property({ type: Object, attribute: 'launch-link' })
  launchLink?: LinkType

  constructor() {
    super()
    library.add(
      faStar,
      faArrowRight,
      farStar,
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  static i18nOrigin(): Record<OriginType, string> {
    return {
      [OriginType.native]: msg(str`Sercice natif`),
      [OriginType.external]: msg(str`Service externe`),
    }
  }

  static i18nCategory(): Record<CategoryType, string> {
    return {
      [CategoryType.documentation]: msg(str`Documentation`),
      [CategoryType.collaboratif]: msg(str`Collaboratif`),
      [CategoryType.apprentissage]: msg(str`Apprentissage`),
      [CategoryType.vieScolaire]: msg(str`Vie scolaire`),
      [CategoryType.orientation]: msg(str`Orientation`),
      [CategoryType.parametres]: msg(str`Paramètres`),
      [CategoryType.communication]: msg(str`Communication`),
    }
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite
    this.dispatchEvent(new CustomEvent('toggle-favorite', { detail: { favorite: this.isFavorite } }))
  }

  videoTemplate(): TemplateResult | typeof nothing {
    return this.video
      ? html`
        <section class="first-step">
          <h2 class="h3">${msg(str`Premiers pas avec le service`)}</h2>
          <div class="video">
            <iframe
              src="${this.video}"
              width="640"
              height="360"
              allowfullscreen
            >
            </iframe>
          </div>
        </section>
        `
      : nothing
  }

  tutorialsTemplate(): TemplateResult | typeof nothing {
    return this.tutorials.length > 0
      ? html`
        <section class="tutorials">
          <h2 class="h3">${msg(str`Tutoriels disponibles (${this.tutorials.length})`)}</h2>
          <ul>
            ${
              repeat(
                this.tutorials,
                link => link,
                link => html`
                  <li>
                    <a
                      href="${link.href}"
                      target="${link.target ?? nothing}"
                      rel="${link.rel ?? nothing}"
                    >
                      ${link.name}
                    </a>
                  </li>
                `,
              )
            }
          </ul>
          ${
            this.tutorialsLink
              ? html`
                <a
                  href="${this.tutorialsLink.href}"
                  class="btn-secondary small"
                >
                  ${msg(str`Voir tous les tutoriels`)}
                  ${getIcon(faArrowRight)}
                </a>
              `
              : nothing
          }
        </section>
        `
      : nothing
  }

  render(): TemplateResult {
    return html`
      <div class="service-info">
        <header>
          <div class="heading">
            ${
              this.iconUrl
                ? html`
                    <svg class="heading-logo" aria-hidden="true">
                      <use href="${this.iconUrl}"></use>
                    </svg>
                  `
                : nothing
            }
            <div class="heading-text">
              <h1>${this.name}</h1>
              ${
                this.origin && Object.values(OriginType).includes(this.origin)
                  ? html`
                      <span class="origin">
                        ${ReciaServiceMoreLayout.i18nOrigin()[this.origin]}
                      </span>
                    `
                  : nothing
              }
              ${
                this.category && Object.values(CategoryType).includes(this.category)
                  ? html`
                      <span class="category ${this.category}">${ReciaServiceMoreLayout.i18nCategory()[this.category]}</span>
                    `
                  : nothing
              }
            </div>
          </div>
          <button
            class="btn-secondary"
            @click="${() => this.toggleFavorite()}"
          >
            ${
              keyed(
                this.isFavorite,
                this.isFavorite
                  ? html`
                    ${getIcon(faStar)}
                    ${msg(str`Retirer des favoris`)}
                    `
                  : html`
                    ${getIcon(farStar)}
                    ${msg(str`Ajouter aux favoris`)}
                    `,
              )
            }
          </button>
        </header>
        <div class="content">
          <section class="description">
            <h2 class="h3">${msg(str`Description`)}</h2>
            <div>${unsafeHTML(this.description)}</div>
          </section>
          ${this.videoTemplate()}
          ${this.tutorialsTemplate()}
        </div>
        <footer>
          <button
            class="btn-secondary close"
            @click="${() => this.dispatchEvent(new CustomEvent('close'))}"
          >
            ${msg(str`Fermer`)}
          </button>
          ${
            this.launchLink
              ? html`
                <a href="${this.launchLink.href}"
                  target="${this.launchLink.target ?? nothing}"
                  rel="${this.launchLink.rel ?? nothing}"
                  class="btn-primary launch"
                >
                  ${msg(str`Lancer le service`)}
                  ${getIcon(faArrowRight)}
                </a>
              `
              : nothing
          }
        </footer>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaServiceMoreLayout
  }
}
