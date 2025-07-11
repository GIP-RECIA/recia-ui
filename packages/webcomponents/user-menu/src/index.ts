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
import type { Config } from './types/ConfigType.ts'
import type { Link } from './types/LinkType.ts'
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
import { Item } from './types/ItemType.ts'
import { getIcon, getIconWithStyle } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaUserMenu extends LitElement {
  @property({ type: String })
  picture = ''

  @property({ type: String, attribute: 'display-name' })
  displayName = ''

  @property({ type: String })
  function = ''

  @property({ type: String })
  config = '{}'

  @property({ type: Number })
  notification = 0

  @property({ type: String, attribute: 'avatar-size' })
  avatarSize = ''

  @state()
  isExpanded = false

  @state()
  localConfig: Config = {
    [Item.Notification]: {},
    [Item.Settings]: {
      icon: faGear,
      link: {
        href: '',
      },
    },
    [Item.InfoEtab]: {
      icon: faInfoCircle,
    },
    [Item.ChangeEtab]: {
      icon: faRightLeft,
      link: {
        href: '/uPortal/p/switchStruct/',
      },
    },
    [Item.Starter]: {
      icon: faPlay,
    },
    [Item.Logout]: {
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
    const parsedConfig = JSON.parse(this.config) as Config
    const merged: Config = { ...this.localConfig }

    for (const key of Object.keys(parsedConfig) as Item[]) {
      const value = parsedConfig[key]
      if (value === false) {
        merged[key] = false
      }
      else {
        merged[key] = {
          ...merged[key],
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

  static i18n(): Record<Item, string> {
    return {
      [Item.Notification]: msg(str`Notifications`),
      [Item.Settings]: msg(str`Mon profil`),
      [Item.InfoEtab]: msg(str`Infos de l\'établissement`),
      [Item.ChangeEtab]: msg(str`Changer d\'établissement`),
      [Item.Starter]: msg(str`Lancer le didacticiel`),
      [Item.Logout]: msg(str`Déconnexion`),
    }
  }

  itemTemplate(item: { id: Item, icon?: IconDefinition, link?: Link | null }): TemplateResult {
    const content = html`
      ${ReciaUserMenu.i18n()[item.id]}
      ${
        item.id === Item.Notification
          ? keyed(
              this.notification > 0 ? 'notifications' : 'no-notifications',
              html`
                <div
                  class="badge"
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
                return Object.values(Item).includes(key as Item) && value !== false
              }),
              ([key, _]) => key,
              ([key, value]) => this.itemTemplate({ id: key as Item, ...value }),
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
    [tagName]: ReciaUserMenu
  }
}
