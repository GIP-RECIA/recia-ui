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
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import FavoritesService from '../../services/favoritesService.ts'
import { settings, soffit } from '../../stores/index.ts'
import { Category } from '../../types/CategoryType.ts'
import { getIconWithStyle } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import 'filters'

@localized()
@useStores(settings)
@useStores(soffit)
export class ReciaService extends LitElement {
  @property({ type: Number, attribute: 'id' })
  channelId?: number

  @property({ type: String })
  fname?: string

  @property({ type: String })
  name?: string

  @property({ type: String })
  category?: Category

  @property({ type: String, attribute: 'icon-url' })
  iconUrl?: string

  @property({ type: Object })
  link?: Link

  @property({ type: Boolean, attribute: 'new' })
  isNew: boolean = false

  @property({ type: Boolean, attribute: 'favorite', reflect: true })
  isFavorite: boolean = false

  @property({ type: Boolean })
  more: boolean = false

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('category')) {
      if (!this.category || !Object.values(Category).includes(this.category)) {
        this.category = undefined
      }
    }
    return true
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

  async toggleFavorite(_: Event): Promise<void> {
    const { favoriteApiUrl } = settings.get()
    const soffitObject = soffit.get()
    if (!soffitObject || !favoriteApiUrl || !this.channelId)
      return

    const response: boolean = this.isFavorite
      ? await FavoritesService.remove(soffitObject, favoriteApiUrl, this.channelId)
      : await FavoritesService.add(soffitObject, favoriteApiUrl, this.channelId)

    if (response)
      this.isFavorite = !this.isFavorite
  }

  openMore(_: Event): void {
    this.dispatchEvent(new CustomEvent('open-more', { detail: { fname: this.fname } }))
  }

  render(): TemplateResult | typeof nothing {
    return this.link && this.name
      ? html`
          <div class="service ${this.category}">
            ${
              this.isNew
                ? html`
                    <div class="new">
                      <span class="new">${msg(str`nouveau`)}</span>
                    </div>
                  `
                : nothing
            }
            <svg class="icon" aria-hidden="true">
              ${
                this.iconUrl
                  ? html`<use href="${this.iconUrl}"></use>`
                  : nothing
              }
            </svg>
            ${
              this.link
                ? html`
                    <a
                      href="${this.link.href}"
                      target="${this.link.target ?? nothing}"
                      rel="${this.link.rel ?? nothing}"
                      class="name"
                    >
                      <h3>${this.name}</h3>
                      <span aria-hidden="true"></span>
                    </a>
                  `
                : nothing
            }
            ${
              this.category
                ? html`
                    <span class="category">${ReciaService.i18nCategory()[this.category]}</span>
                  `
                : nothing
            }
            <div class="favorite">
              <button
                aria-label="${this.isFavorite ? msg(str`Retirer des favoris`) : msg(str`Ajouter aux favoris`)}"
                @click="${this.toggleFavorite}"
              >
                ${
                  getIconWithStyle(
                    this.isFavorite ? faStar : farStar,
                    undefined,
                    { marked: this.isFavorite },
                  )
                }
              </button>
            </div>
            ${
              this.more
                ? html`
                    <button
                      class="more"
                      @click="${this.openMore}"
                    >
                      ${msg(str`En savoir plus`)}
                    </button>
                  `
                : nothing
            }
          </div>
        `
      : nothing
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('service')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaService)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaService
  }
}
