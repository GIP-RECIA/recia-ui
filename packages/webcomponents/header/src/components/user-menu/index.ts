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
import type { Ref } from 'lit/directives/ref.js'
import type { Link, UserMenuConfig } from '../../types/index.ts'
import {
  faArrowRightFromBracket,
  faChevronDown,
  faInfoCircle,
  faMagnifyingGlass,
  faPlay,
  faRightLeft,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { keyed } from 'lit/directives/keyed.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { UserMenuItem } from '../../types/index.ts'
import { getIcon, getIconWithStyle } from '../../utils/fontawesomeUtils.ts'
import { getDomainLink } from '../../utils/linkUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

const defaultConfig: UserMenuConfig = {
  [UserMenuItem.Search]: {
    icon: faMagnifyingGlass,
  },
  [UserMenuItem.Notification]: {},
  [UserMenuItem.Account]: {
    icon: faUser,
  },
  [UserMenuItem.InfoEtab]: {
    icon: faInfoCircle,
  },
  [UserMenuItem.ChangeEtab]: {
    icon: faRightLeft,
  },
  [UserMenuItem.Starter]: {
    icon: faPlay,
  },
  [UserMenuItem.Logout]: {
    icon: faArrowRightFromBracket,
  },
}

@localized()
export class ReciaUserMenu extends LitElement {
  @property({ type: String })
  picture?: string

  @property({ type: String, attribute: 'display-name' })
  displayName?: string

  @property({ type: String })
  function?: string

  @property({ type: Object })
  config?: Partial<UserMenuConfig> = defaultConfig

  @property({ type: Number })
  notification?: number

  @property({ type: String, attribute: 'avatar-size' })
  avatarSize?: string

  @state()
  isExpanded: boolean = false

  @state()
  localConfig?: Partial<UserMenuConfig>

  private buttonRef: Ref<HTMLElement> = createRef()

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

    this.localConfig = Object.fromEntries(
      Object.entries(defaultConfig)
        .filter(([key, _]) => this.config![key as UserMenuItem] !== false)
        .map(([key, value]) => [
          key,
          {
            ...value,
            ...this.config![key as UserMenuItem],
          },
        ]),
    )
  }

  toggle(_: Event): void {
    this.isExpanded = !this.isExpanded
  }

  close(_: Event | undefined = undefined, resetFocus: boolean = true): void {
    this.isExpanded = false
    if (resetFocus)
      this.buttonRef.value?.focus()
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

  emitEvent(e: Event, from: 'link' | 'button', type: string): void {
    this.close()
    if (from === 'button')
      this.dispatchEvent(new CustomEvent('launch', { detail: { type } }))
    document.dispatchEvent(new CustomEvent('user-menu-event', {
      detail: {
        event: e,
        elementId: type,
      },
      bubbles: true,
      composed: true,
    }))
  }

  static i18n(): Record<UserMenuItem, string> {
    return {
      [UserMenuItem.Search]: msg(str`Rechercher`),
      [UserMenuItem.Notification]: msg(str`Notifications`),
      [UserMenuItem.Account]: msg(str`Mon profil`),
      [UserMenuItem.InfoEtab]: msg(str`Informations de l'établissement`),
      [UserMenuItem.ChangeEtab]: msg(str`Changer d'établissement`),
      [UserMenuItem.Starter]: msg(str`Lancer le didacticiel`),
      [UserMenuItem.Logout]: msg(str`Déconnexion`),
    }
  }

  itemTemplate(
    item: {
      id: UserMenuItem
      icon?: IconDefinition
      link?: Link | null
    },
  ): TemplateResult {
    const isNotifications: boolean = !!((this.notification && this.notification > 0))

    const content = html`
      ${ReciaUserMenu.i18n()[item.id]}
      ${
        item.id === UserMenuItem.Notification
          ? keyed(
              `${isNotifications ? '' : 'no-'}notifications`,
              html`
                <div
                  class="badge"
                  style="${styleMap({
                    display: isNotifications ? undefined : 'none',
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
                    href="${getDomainLink(item.link.href)}"
                    target="${item.link.target ?? nothing}"
                    rel="${item.link.rel ?? nothing}"
                    @click="${(e: Event) => this.emitEvent(e, 'link', item.id)}"
                  >
                    ${content}
                  </a>
                `
              : html`
                  <button
                    id="${item.id}"
                    @click="${(e: Event) => this.emitEvent(e, 'button', item.id)}"
                  >
                    ${content}
                  </button>
                `,
          )
        }
      </li>
    `
  }

  render(): TemplateResult | typeof nothing {
    if (!this.localConfig)
      return nothing

    return html`
      <div class="user-menu">
        <div
          class="notification-dot top right"
          style="${styleMap({
            display: this.localConfig.notification !== false
              && this.notification
              && this.notification > 0
              ? undefined
              : 'none',
          })}"
        >
        </div>
        <button
          ${ref(this.buttonRef)}
          aria-expanded="${this.isExpanded}"
          aria-controls="user-menu"
          aria-label="${msg(str`Menu utilisateur`)}"
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
          ${
            getIconWithStyle(
              faChevronDown,
              { rotate: this.isExpanded ? '180deg' : undefined },
              {},
            )
          }
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
              Object.entries(this.localConfig),
              ([key, _]) => key,
              ([key, value]) => this.itemTemplate(
                { id: key as UserMenuItem, ...value },
              ),
            )
          }
        </ul>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('user-menu')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaUserMenu)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaUserMenu
  }
}
