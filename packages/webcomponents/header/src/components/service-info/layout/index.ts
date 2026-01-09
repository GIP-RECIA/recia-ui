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
import type { Link } from '../../../types/index.ts'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import {
  faArrowRight,
  faExclamationTriangle,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { keyed } from 'lit/directives/keyed.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { componentName } from '../../../../../common/config.ts'
import langHelper from '../../../helpers/langHelper.ts'
import { CategoryKey, Origin } from '../../../types/index.ts'
import { getCategoryTranslation } from '../../../utils/categoryUtils.ts'
import { getIcon, getIconWithStyle } from '../../../utils/fontawesomeUtils.ts'
import { getSvgIconService } from '../../../utils/iconUtils.ts'
import { setLocale } from '../../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

@localized()
export class ReciaServiceInfoLayout extends LitElement {
  @property({ type: String })
  fname?: string

  @property({ type: String, attribute: 'icon-url' })
  iconUrl?: string

  @property({ type: String })
  name?: string

  @property({ type: String })
  origin?: Origin

  @property({ type: String })
  category?: CategoryKey

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

  @property({ type: Boolean })
  loading: boolean = false

  @property({ type: Boolean })
  error: boolean = false

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

  toggleFavorite(_: Event): void {
    this.isFavorite = !this.isFavorite
    this.dispatchEvent(new CustomEvent(
      'toggle-favorite',
      { detail: { favorite: this.isFavorite } },
    ))
  }

  handleLinkClick(e: Event): void {
    document.dispatchEvent(new CustomEvent('service-info-event', {
      detail: {
        event: e,
        fname: this.fname,
      },
      bubbles: true,
      composed: true,
    }))
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

  skeletonTemplate(): TemplateResult {
    return html`
        <div class="service-info">
          <header inert>
            <div class="heading">
              <div class="icon skeleton"></div>
              <div class="heading-text">
                <h1 class="skeleton"></h1>
                <span class="tag-category skeleton"></span>
              </div>
            </div>
          </header>
          <div class="content" inert>
            <section class="description">
              <h2 class="h3">${msg(str`Description`)}</h2>
              <div class="skeleton">
                <p></p>
                <p></p>
                <p></p>
              </div>
            </section>
            <section class="first-step">
              <h2 class="h3">${msg(str`Premiers pas avec le service`)}</h2>
              <div class="video">
                <div class="skeleton"></div>
              </div>
            </section>
          </div>
          <footer>
            <button
              class="btn-secondary close"
              @click="${() => this.dispatchEvent(new CustomEvent('close'))}"
            >
              ${msg(str`Fermer`)}
            </button>
          </footer>
        </div>
      `
  }

  errorTemplate(): TemplateResult {
    return html`
        <div class="service-info">
          <div class="content">
            <div class="error">
              ${getIconWithStyle(faExclamationTriangle, undefined, { icon: true })}
              <p>
                ${msg(str`Une erreur est survenue lors de la récupération des informations du service.\nTentez de rouvrir cette fiche.`)}
              </p>
            </div>
          </div>
          <footer>
            <button
              class="btn-secondary close"
              @click="${() => this.dispatchEvent(new CustomEvent('close'))}"
            >
              ${msg(str`Fermer`)}
            </button>
          </footer>
        </div>
      `
  }

  render(): TemplateResult {
    if (this.loading)
      return this.skeletonTemplate()
    if (this.error)
      return this.errorTemplate()

    return html`
      <div class="service-info">
        <header>
          <div class="heading">
            ${getSvgIconService(this.iconUrl)}
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
                this.category && Object.values(CategoryKey).includes(this.category)
                  ? html`
                      <span class="tag-category ${this.category}">
                        ${getCategoryTranslation(this.category)}
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
                    @click="${this.handleLinkClick}"
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

const tagName = componentName('service-info-layout')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaServiceInfoLayout)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaServiceInfoLayout
  }
}
