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
import type { Link } from '../../types/LinkType.ts'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { keyed } from 'lit/directives/keyed.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { componentName } from '../../../../common/config.ts'
import { name } from '../../../package.json'
import langHelper from '../../helpers/langHelper.ts'
import { Category } from '../../types/CategoryType.ts'
import { Origin } from '../../types/OriginType.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

@localized()
export class ReciaServiceInfoLayout extends LitElement {
  @property({ type: String, attribute: 'icon-url' })
  iconUrl?: string

  @property({ type: String })
  name?: string

  @property({ type: String })
  origin?: Origin

  @property({ type: String })
  category?: Category

  @property({ type: Boolean, attribute: 'favorite-toggle' })
  canTogglefavorite: boolean = false

  @property({ type: Boolean, attribute: 'favorite', reflect: true })
  isFavorite: boolean = false

  @property({ type: String })
  description?: string

  @property({ type: String })
  video?: string

  @property({ type: Array })
  ressources?: Array<Link>

  @property({ type: Object, attribute: 'ressources-link' })
  ressourcesLink?: Link

  @property({ type: Object, attribute: 'launch-link' })
  launchLink?: Link

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('ressources')) {
      if (!Array.isArray(this.ressources) || this.ressources.length === 0) {
        this.ressources = []
      }
    }
    return true
  }

  static i18nOrigin(): Record<Origin, string> {
    return {
      [Origin.native]: msg(str`Sercice natif`),
      [Origin.external]: msg(str`Service externe`),
    }
  }

  static i18nCategory(): Record<Category, string> {
    return {
      [Category.documentation]: msg(str`Documentation`),
      [Category.collaboratif]: msg(str`Collaboratif`),
      [Category.apprentissage]: msg(str`Apprentissage`),
      [Category.vieScolaire]: msg(str`Vie scolaire`),
      [Category.orientation]: msg(str`Orientation`),
      [Category.parametres]: msg(str`Paramètres`),
      [Category.communication]: msg(str`Communication`),
    }
  }

  toggleFavorite(_: Event): void {
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

  ressourcesTemplate(): TemplateResult | typeof nothing {
    return this.ressources && this.ressources.length > 0
      ? html`
        <section class="ressources">
          <h2 class="h3">${msg(str`Ressources disponibles`)}</h2>
          <ul>
            ${
              repeat(
                this.ressources,
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
            this.ressourcesLink
              ? html`
                  <a
                    href="${this.ressourcesLink.href}"
                    class="btn-secondary small"
                  >
                    ${msg(str`Voir toutes les ressources`)}
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
                this.origin && Object.values(Origin).includes(this.origin)
                  ? html`
                      <span class="origin">
                        ${ReciaServiceInfoLayout.i18nOrigin()[this.origin]}
                      </span>
                    `
                  : nothing
              }
              ${
                this.category && Object.values(Category).includes(this.category)
                  ? html`
                      <span class="tag-category ${this.category}">
                        ${ReciaServiceInfoLayout.i18nCategory()[this.category]}
                      </span>
                    `
                  : nothing
              }
            </div>
          </div>
          ${
            this.canTogglefavorite
              ? html`
                  <button
                    class="btn-secondary"
                    @click="${this.toggleFavorite}"
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
                `
              : nothing
          }
        </header>
        <div class="content">
          <section class="description">
            <h2 class="h3">${msg(str`Description`)}</h2>
            <div>${unsafeHTML(this.description)}</div>
          </section>
          ${this.videoTemplate()}
          ${this.ressourcesTemplate()}
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
                  <a
                    href="${this.launchLink.href}"
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

const tagName = componentName(`${name}-layout`)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaServiceInfoLayout)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaServiceInfoLayout
  }
}
