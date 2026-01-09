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
import type { Link } from '../../types/index.ts'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { componentName } from '../../../../common/config.ts'
import star from '../../assets/svg/star.svg?raw'
import starSolid from '../../assets/svg/starSolid.svg?raw'
import langHelper from '../../helpers/langHelper.ts'
import {
  addFavorite,
  removeFavorite,
} from '../../stores/index.ts'
import { getCategoryData } from '../../utils/categoryUtils.ts'
import { getSvgIconService } from '../../utils/iconUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

@localized()
export class ReciaService extends LitElement {
  @property({ type: Number, attribute: 'id' })
  channelId?: number

  @property({ type: String })
  fname?: string

  @property({ type: String })
  name?: string

  @property({ type: Number })
  category?: number

  @property({ type: String, attribute: 'icon-url' })
  iconUrl?: string

  @property({ type: Object })
  link?: Link

  @property({ type: Boolean, attribute: 'new' })
  isNew: boolean = false

  @property({ type: Boolean, attribute: 'favorite' })
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

  async toggleFavorite(_: Event): Promise<void> {
    if (!this.channelId)
      return

    this.isFavorite
      ? removeFavorite(this.channelId)
      : addFavorite(this.channelId)
  }

  openMore(e: Event): void {
    document.dispatchEvent(new CustomEvent('open-more', {
      detail: {
        event: e,
        fname: 'ServiceInfo',
        SERVICE: this.fname,
      },
    }))
    this.dispatchEvent(new CustomEvent('open-more', { detail: { fname: this.fname } }))
  }

  handleLinkClick(e: Event): void {
    document.dispatchEvent(new CustomEvent('service-event', {
      detail: {
        event: e,
        fname: this.fname,
      },
      bubbles: true,
      composed: true,
    }))
  }

  render(): TemplateResult | typeof nothing {
    const { name, className } = getCategoryData(this.category) ?? {}

    return this.link && this.name
      ? html`
          <div class="service ${className}">
            ${
              this.isNew
                ? html`
                    <div class="new">
                      <span class="new">${msg(str`nouveau`)}</span>
                    </div>
                  `
                : nothing
            }
            ${getSvgIconService(this.iconUrl)}
            ${
              this.link
                ? html`
                    <a
                      href="${this.link.href}"
                      target="${this.link.target ?? nothing}"
                      rel="${this.link.rel ?? nothing}"
                      class="name"
                      @click="${this.handleLinkClick}"
                    >
                      <h3>${this.name}</h3>
                      <span aria-hidden="true"></span>
                    </a>
                  `
                : nothing
            }
            ${
              name
                ? html`
                    <span class="category">${name}</span>
                  `
                : nothing
            }
            <div class="favorite">
              <button
                class="${classMap({ marked: this.isFavorite })}"
                aria-label="${this.isFavorite ? msg(str`Retirer des favoris`) : msg(str`Ajouter aux favoris`)} - ${this.name}"
                @click="${this.toggleFavorite}"
              >
                ${unsafeSVG(this.isFavorite ? starSolid : star)}
              </button>
            </div>
            ${
              this.more
                ? html`
                    <button
                      class="more"
                      aria-label="${msg(str`En savoir plus`)} - ${this.name}"
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
