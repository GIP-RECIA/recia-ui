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
import {
  faArrowRightFromBracket,
  faChevronDown,
  faGear,
  faInfoCircle,
  faMagnifyingGlass,
  faPlay,
  faRightLeft,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
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

@localized()
export class ReciaUserMenu extends LitElement {
  @property({ type: String })
  picture?: string

  @property({ type: String, attribute: 'display-name' })
  displayName?: string

  @property({ type: String })
  function?: string

  @property({ type: Object })
  config?: Config

  @property({ type: Number })
  notification?: number

  @property({ type: String, attribute: 'avatar-size' })
  avatarSize?: string

  @state()
  isExpanded: boolean = false

  @state()
  localConfig: Config = {
    [Item.Search]: {
      icon: faMagnifyingGlass,
    },
    [Item.Notification]: {},
    [Item.Settings]: {
      icon: faGear,
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
    if (!this.config)
      return

    const merged: Config = { ...this.localConfig }

    for (const key of Object.keys(this.config) as Item[]) {
      const value = this.config[key]
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

  toggle(_: Event): void {
    this.isExpanded = !this.isExpanded
  }

  close(_: Event | undefined = undefined, resetFocus: boolean = true): void {
    this.isExpanded = false
    if (resetFocus)
      this.shadowRoot?.getElementById('eyebrow-button')?.focus()
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (this.isExpanded && e.key === 'Escape') {
      e.preventDefault()
      this.close(e)
    }
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    if (
      this.isExpanded
      && e.target instanceof HTMLElement
      && !(this.contains(e.target) || e.composedPath().includes(this))
    ) {
      this.close(undefined, false)
    }
  }

  emitEvent(_: Event, type: string): void {
    this.close(undefined, false)
    this.dispatchEvent(new CustomEvent('launch', { detail: { type } }))
  }

  static i18n(): Record<Item, string> {
    return {
      [Item.Search]: msg(str`Rechercher`),
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
              this.notification && this.notification > 0 ? 'notifications' : 'no-notifications',
              html`
                <div
                  class="badge"
                  style="${styleMap({
                    display: this.notification && this.notification > 0 ? undefined : 'none',
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
                    @click="${this.close}"
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
      <div class="user-menu">
        <div
          class="notification-dot top right"
          style="${styleMap({
            display: this.localConfig.notification !== false && this.notification && this.notification > 0 ? undefined : 'none',
          })}"
        >
        </div>
        <button
          class="eyebrow-button"
          aria-expanded="${this.isExpanded}"
          aria-controls="user-menu"
          aria-label="${msg(str`Menu mon compte`)}"
          @click="${this.toggle}"
        >
          ${
            this.picture
              ? html`
                  <img
                    src="${this.picture}"
                    alt=""
                    class="picture"
                    style="${styleMap({
                      height: this.avatarSize !== '' ? this.avatarSize : undefined,
                      width: this.avatarSize !== '' ? this.avatarSize : undefined,
                    })}"
                  />
                `
              : nothing
          }
          ${
            this.displayName || this.function
              ? html`
                  <div class="info">
                    ${
                      this.displayName
                        ? html`<span class="displayname">${this.displayName}</span>`
                        : nothing
                    }
                    ${
                      this.function
                        ? html`<span class="function">${this.function}</span>`
                        : nothing
                    }
                  </div>
                `
              : nothing
          }
          ${getIconWithStyle(faChevronDown, { rotate: this.isExpanded ? '180deg' : undefined }, {})}
        </button>
        <ul
          id="user-menu"
          class="menu"
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

const tagName = componentName(name)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaUserMenu)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaUserMenu
  }
}
