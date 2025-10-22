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
import type { Link } from '../../types/linkType.ts'
import type { WidgetItem } from '../../types/widgetType.ts'
import {
  faAnglesRight,
  faArrowLeft,
  faArrowRight,
  faChevronDown,
  faInfoCircle,
  faTimes,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { getIcon, getIconWithStyle } from '../../utils/fontawesomeUtils.ts'
import { getSvgIcon } from '../../utils/iconUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import { slugify } from '../../utils/stringUtils.ts'
import styles from './style.scss?inline'

@localized()
export class ReciaWidget extends LitElement {
  @property({ type: String })
  uid?: string

  @property({ type: String })
  name?: string

  @property({ type: String })
  subtitle?: string

  @property({ type: Number })
  notifications?: number

  @property({ type: Object })
  link?: Link

  @property({ type: Array })
  items?: Array<WidgetItem>

  @property({ type: String, attribute: 'empty-icon' })
  emptyIcon?: string

  @property({ type: String, attribute: 'empty-text' })
  emptyText?: string

  @property({ type: Boolean, attribute: 'empty-discover' })
  emptyDiscover: boolean = false

  @property({ type: Boolean })
  manage: boolean = false

  @property({ type: Boolean })
  deletable: boolean = false

  @property({ type: Boolean, attribute: 'no-previous' })
  noPrevious: boolean = false

  @property({ type: Boolean, attribute: 'no-next' })
  noNext: boolean = false

  @property({ type: Boolean })
  loading: boolean = false

  @property({ type: Boolean, attribute: 'error' })
  isError: boolean = false

  @property({ type: String, attribute: 'error-message' })
  errorMessage?: string

  @property({ type: Boolean })
  placeholder: boolean = false

  @state()
  isExpanded: boolean = false

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  toggleDropdown(): void {
    this.isExpanded = !this.isExpanded
  }

  deleteWidget(): void {
    this.dispatchEvent(new CustomEvent('delete', { detail: { uid: this.uid } }))
  }

  moveWidget(newPosition: '-1' | '+1'): void {
    this.dispatchEvent(new CustomEvent('move', { detail: { uid: this.uid, newPosition } }))
  }

  clickOnItem(_: Event, item: WidgetItem): void {
    const { dispatchEvents } = item
    dispatchEvents?.forEach(({ type, detail }) => {
      document.dispatchEvent(new CustomEvent(type, { detail }))
    })
  }

  clickOnHeadingLink(_: Event) {
    document.dispatchEvent(new CustomEvent('click-portlet-card', {
      detail: { fname: this.uid },
    }))
  }

  headingTemplate(): TemplateResult {
    return html`
      <h3>${this.name}</h3>
      ${
        this.subtitle && this.subtitle.trim().length > 0
          ? html`<span class="heading-subtitle">${this.subtitle}</span>`
          : nothing
      }
    `
  }

  notificationsTemplate(): TemplateResult | typeof nothing {
    return this.notifications && this.notifications > 0
      ? html`
          <span class="badge lg">
            ${this.notifications}
            <span class="sr-only">${msg(str`notifications`)}</span>
          </span>
        `
      : nothing
  }

  itemTemplate(item: WidgetItem): TemplateResult {
    const isNew: boolean = item.isNew ?? false
    const content: TemplateResult = html`
      ${getSvgIcon(item.icon)}
      <div class=${classMap({ isNew })}">
        <span>${item.name}</span>
        ${
          item.description
            ? html`<span class="description">${item.description}</span>`
            : nothing
        }
      </div>
    `
    const title = `${item.name}${item.description ? ` | ${item.description}` : ''}`

    return html`
      <li>
        ${
          item.link
            ? html`
                <a
                  href="${item.link.href}"
                  target="${item.link.target ?? nothing}"
                  rel="${item.link.rel ?? nothing}"
                  title="${title}"
                  @click="${(e: Event) => this.clickOnItem(e, item)}"
                >
                  ${content}
                </a>
              `
            : html`
                <button
                  title="${title}"
                  @click="${(e: Event) => this.clickOnItem(e, item)}"
                >
                  ${content}
                </button>
              `
        }
      </li>
    `
  }

  contentTemplate(): TemplateResult {
    if (this.isError)
      return this.errorTemplate()

    if (this.items && this.items.length > 0) {
      return html`
        <ul>
          ${
            repeat(
              this.items,
              item => item,
              item => this.itemTemplate(item),
            )
          }
        </ul>
      `
    }

    return this.emptyTemplate()
  }

  emptyTemplate(): TemplateResult {
    return html`
      <div class="empty">
        ${
          !this.emptyDiscover
            ? this.emptyIcon
              ? unsafeSVG(this.emptyIcon)
              : getIconWithStyle(faInfoCircle, undefined, { icon: true })
            : nothing
        }
        <span class="text">
          ${msg(str`Vous n'avez`)}
          <span class="large">${this.emptyText ?? msg(str`Aucun élément`)}</span>
        </span>
        ${
          this.emptyDiscover && this.link
            ? html`
                <a
                  href="${this.link.href}"
                  target="${this.link.target ?? nothing}"
                  rel="${this.link.rel ?? nothing}"
                  class="btn-secondary small"
                >
                  ${msg(str`Découvrir`)}${getIcon(faArrowRight)}
                </a>
              `
            : nothing
        }
      </div>
    `
  }

  errorTemplate(): TemplateResult {
    return html`
      <div class="error">
        ${getIconWithStyle(faTriangleExclamation, undefined, { icon: true })}
        <span class="text">
          ${msg(str`Erreur`)}
          <span class="large">${this.errorMessage ?? msg(str`Impossible de charger le contenu`)}</span>
        </span>
      </div>
    `
  }

  actionTemplate(): TemplateResult | typeof nothing {
    return this.manage
      ? html`
          <div class="actions">
            ${
              this.deletable
                ? html`
                    <div class="action-delete">
                      <button
                        aria-label="${msg(str`Supprimer le widget`)}"
                        @click="${() => this.deleteWidget()}"
                      >
                        ${getIcon(faTimes)}
                      </button>
                    </div>
                  `
                : nothing
            }
            ${
              !this.noPrevious
                ? html`
                    <div class="action-back">
                      <button
                        aria-label="${msg(str`Réordonner vers la gauche`)}"
                        @click="${() => this.moveWidget('-1')}"
                      >
                        ${getIcon(faArrowLeft)}
                      </button>
                    </div>
                  `
                : nothing
            }
            <div class="grow-1"></div>
            ${
              !this.noNext
                ? html`
                    <div class="action-next">
                      <button
                        aria-label="${msg(str`Réordonner vers la droite`)}"
                        @click="${() => this.moveWidget('+1')}"
                      >
                        ${getIcon(faArrowRight)}
                      </button>
                    </div>
                  `
                : nothing
            }
          </div>
        `
      : nothing
  }

  render(): TemplateResult | typeof nothing {
    if (this.loading)
      return html`<div class="widget-skeleton"></div>`
    if (this.placeholder)
      return html`<div class="widget-placeholder"></div>`

    if (!this.uid || !this.name) {
      console.error('uid and name are required')
      return nothing
    }

    const slug = slugify(this.name)

    return html`
      <div class="widget">
        ${this.actionTemplate()}
        <header ?inert="${this.manage || this.loading || this.placeholder}">
          <button
            aria-expanded="${this.isExpanded}"
            aria-controls="widget-${slug}-menu"
            aria-label="Widget ${this.name}"
            @click="${this.toggleDropdown}"
          >
            <div class="heading">${this.headingTemplate()}</div>
            <div class="grow-1"></div>
            ${this.notificationsTemplate()}
            ${
              getIconWithStyle(
                faChevronDown,
                { rotate: this.isExpanded ? '180deg' : undefined },
                { 'folded-indicator': true },
              )
            }
          </button>
          <div>
            ${
              this.link
                ? html`
                    <a
                      href="${this.link.href}"
                      target="${this.link.target ?? nothing}"
                      rel="${this.link.rel ?? nothing}"
                      aria-label="${this.name}"
                      @click="${this.clickOnHeadingLink}"
                    >
                      ${getIconWithStyle(faAnglesRight, undefined, { 'focus-indicator': true })}
                      <div class="heading">${this.headingTemplate()}</div>
                    </a>
                  `
                : html`<div class="heading">${this.headingTemplate()}</div>`
            }
            <div class="grow-1"></div>
            ${this.notificationsTemplate()}
          </div>
        </header>
        <div
          id="widget-${slug}-menu"
          class="menu"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
          ?inert="${this.manage || this.loading}"
        >
          ${this.contentTemplate()}
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('widget')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaWidget)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaWidget
  }
}
