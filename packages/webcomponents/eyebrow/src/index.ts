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

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { PropertyValues, TemplateResult } from 'lit'
import type { LinkType } from './types/LinkType.ts'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRightFromBracket,
  faChevronDown,
  faChevronUp,
  faGear,
  faInfoCircle,
  faPlay,
  faRightLeft,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { keyed } from 'lit/directives/keyed.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { ItemType } from './types/ItemType.ts'
import { getIcon, getIconWithStyle } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaEyebrow extends LitElement {
  @property({ type: String })
  picture = ''

  @property({ attribute: 'display-name', type: String })
  displayName = ''

  @property({ type: String })
  function = ''

  @property({ type: String })
  config = '{}'

  @property({ type: Number })
  notification = 0

  @property({ attribute: 'avatar-size', type: String })
  avatarSize = ''

  @state()
  isExpanded = false

  @state()
  localConfig: Record<ItemType, false | { icon?: IconDefinition, link?: LinkType | null }> = {
    [ItemType.Notification]: {},
    [ItemType.Settings]: {
      icon: faGear,
      link: {
        href: '',
      },
    },
    [ItemType.InfoEtab]: {
      icon: faInfoCircle,
    },
    [ItemType.ChangeEtab]: {
      icon: faRightLeft,
      link: {
        href: '/uPortal/p/switchStruct/',
      },
    },
    [ItemType.Starter]: {
      icon: faPlay,
    },
    [ItemType.Logout]: {
      icon: faArrowRightFromBracket,
      link: {
        href: '/uPortal/Logout',
      },
    },
  }

  constructor() {
    super()
    library.add(
      faArrowRightFromBracket,
      faChevronDown,
      faChevronUp,
      faGear,
      faInfoCircle,
      faPlay,
      faRightLeft,
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('keyup', this.handleKeyPress.bind(this))
    window.addEventListener('keyup', this.handleOutsideEvents.bind(this))
    window.addEventListener('click', this.handleOutsideEvents.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keyup', this.handleKeyPress.bind(this))
    window.removeEventListener('keyup', this.handleOutsideEvents.bind(this))
    window.removeEventListener('click', this.handleOutsideEvents.bind(this))
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('config')) {
      this.mergeConfig()
    }
    return true
  }

  mergeConfig(): void {
    const parsedConfig = JSON.parse(this.config)
    const merged: typeof this.localConfig = { ...this.localConfig }

    for (const key in parsedConfig) {
      const value = parsedConfig[key]
      if (value === false) {
        merged[key as ItemType] = false
      }
      else {
        merged[key as ItemType] = {
          ...merged[key as ItemType],
          ...value,
        }
      }
    }

    this.localConfig = merged
  }

  toggleDropdown(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
    this.isExpanded = !this.isExpanded
  }

  closeDropdown(e: Event, resetFocus: boolean = true): void {
    e.stopPropagation()
    this.isExpanded = false
    if (resetFocus)
      this.shadowRoot?.getElementById('eyebrow-button')?.focus()
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (this.isExpanded && e.key === 'Escape') {
      e.preventDefault()
      this.closeDropdown(e)
    }
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    if (
      this.isExpanded
      && e.target instanceof HTMLElement
      && !(this.contains(e.target) || e.composedPath().includes(this))
    ) {
      this.isExpanded = false
    }
  }

  emitEvent(e: Event, type: string): void {
    this.closeDropdown(e, false)
    document.dispatchEvent(new CustomEvent('launch', {
      detail: {
        type,
      },
      bubbles: true,
      composed: true,
    }))
  }

  static i18n(): Record<ItemType, string> {
    return {
      [ItemType.Notification]: msg(str`Notifications`),
      [ItemType.Settings]: msg(str`Mon profil`),
      [ItemType.InfoEtab]: msg(str`Infos de l\'établissement`),
      [ItemType.ChangeEtab]: msg(str`Changer d\'établissement`),
      [ItemType.Starter]: msg(str`Lancer le didacticiel`),
      [ItemType.Logout]: msg(str`Déconnexion`),
    }
  }

  itemTemplate(item: { id: ItemType, icon?: IconDefinition, link?: LinkType | null }): TemplateResult {
    const content = html`
      ${ReciaEyebrow.i18n()[item.id]}
      ${
        item.id === ItemType.Notification
          ? keyed(
              this.notification > 0 ? 'notifications' : 'no-notifications',
              html`
                <div
                  class="counter"
                  style="${styleMap({
                    display: this.notification > 0 ? undefined : 'none',
                  })}"
                >
                  ${this.notification}
                </div>
              `,
            )
          : nothing
      }
      ${item.icon ? keyed(item.icon, getIcon(item.icon)) : nothing}
    `

    return html`
      <li>
        ${
          keyed(
            `${item.id}-${item.link && item.link.href.trim() !== '' ? 'link' : 'button'}`,
            item.link && item.link.href.trim() !== ''
              ? html`
              <a
                id="${item.id}"
                href="${item.link.href}"
                target="${item.link.target ?? nothing}"
                rel="${item.link.rel ?? nothing}"
                @click="${this.closeDropdown}"
              >
                ${content}
              </a>
            `
              : html`
              <button
                id="${item.id}"
                @click="${(e: Event) => this.emitEvent(e, item.id)}"
              >
                ${content}
              </button>
            `,
          )
        }
      </li>
    `
  }

  render(): TemplateResult {
    return html`
      <div class="eyebrow">
        <div
          class="eyebrow-notification"
          style="${styleMap({
            display: this.localConfig.notification !== false && this.notification > 0 ? undefined : 'none',
          })}"
        >
        </div>
        <button
          id="eyebrow-button"
          class="eyebrow-button"
          aria-expanded="${this.isExpanded}"
          aria-controls="eyebrow-menu"
          aria-label="${msg(str`Menu mon compte`)}"
          @click="${this.toggleDropdown}"
        >
          <img
            src="${this.picture}"
            alt=""
            class="picture"
            style="${styleMap({
              height: this.avatarSize !== '' ? this.avatarSize : undefined,
              width: this.avatarSize !== '' ? this.avatarSize : undefined,
            })}"
          />
          <div class="info">
            <span class="displayname">${this.displayName}</span>
            <span
              class="function"
              style="${styleMap({
                display: this.function !== '' ? undefined : 'none',
              })}"
            >
              ${this.function}
            </span>
          </div>
          ${getIconWithStyle(faChevronDown, { rotate: this.isExpanded ? '180deg' : undefined }, {})}
        </button>
        <ul
          id="eyebrow-menu"
          class="eyebrow-menu"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
        >
          ${
            repeat(
              Object.entries(this.localConfig)?.filter(([key, value]) => {
                return Object.values(ItemType).includes(key as ItemType) && value !== false
              }),
              ([key, _]) => key,
              ([key, value]) => this.itemTemplate({ id: key as ItemType, ...value }),
            )
          }
        </ul>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaEyebrow
  }
}
