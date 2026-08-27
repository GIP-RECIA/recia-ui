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
import type { Ref } from 'lit/directives/ref.js'
import type { Notif } from '../../types/index.ts'
import {
  faBellSlash,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { componentName } from 'common/config.ts'
import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
  intlFormatDistance,
} from 'date-fns'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import langHelper from '../../helpers/langHelper.ts'
import NotificationService from '../../services/notificationService.ts'
import {
  $groupedNotifications,
  $services,
  $settings,
  $soffit,
  deleteNotifications,
  getNotificationsIds,
} from '../../stores/index.ts'
import { priorityMap } from '../../types/index.ts'
import { getCategory } from '../../utils/categoryUtils.ts'
import { getIcon, getIconWithStyle } from '../../utils/fontawesomeUtils.ts'
import { getSvgIconService } from '../../utils/iconUtils.ts'
import { getDomainLink } from '../../utils/linkUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

@localized()
@useStores($groupedNotifications)
@useStores($services)
export class ReciaNotificationDrawer extends LitElement {
  @property({ type: Boolean, attribute: 'expanded' })
  isExpanded: boolean = false

  private layoutRef: Ref<HTMLElement> = createRef()

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
  }

  connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('keyup', this.handleOutsideEvents.bind(this))
    document.addEventListener('click', this.handleOutsideEvents.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('keyup', this.handleOutsideEvents.bind(this))
    document.removeEventListener('click', this.handleOutsideEvents.bind(this))
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('isExpanded')) {
      if (this.isExpanded === true) {
        setTimeout(() => {
          this.layoutRef.value?.focus()
        }, 150)
      }
      else {
        setTimeout(() => {
          this.layoutRef.value?.scrollTo({ top: 0 })
        }, 150)
      }
    }
    return true
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    const catchEvents: EventTarget[] = [
      this.parentNode
        ?.querySelector('r-principal-container')
        ?.shadowRoot
        ?.querySelector('r-user-menu')
        ?.shadowRoot
        ?.querySelector('button#notification') as EventTarget,
      this.parentNode
        ?.querySelector('r-principal-container')
        ?.shadowRoot
        ?.querySelector('.notification > button') as EventTarget,
    ]
    if (
      this.isExpanded
      && e.target instanceof HTMLElement
      && !(
        this.contains(e.target)
        || e.composedPath().includes(this)
        || catchEvents?.some(event => e.composedPath().includes(event))
      )
    ) {
      this.closeDrawer()
    }
  }

  closeDrawer(_: Event | undefined = undefined): void {
    this.dispatchEvent(new CustomEvent('close', { detail: { isExpanded: false } }))
  }

  handleLinkClick(e: Event, fname: string | undefined): void {
    document.dispatchEvent(new CustomEvent('notification-event', {
      detail: {
        event: e,
        fname,
      },
      bubbles: true,
      composed: true,
    }))
  }

  async delete(
    notifIds: string[],
  ): Promise<void> {
    const { notificationsDeleteApiUrl, notificationsRefreshDelay } = $settings.get()
    const soffit = $soffit.get()

    if (!soffit || !notificationsDeleteApiUrl || !notificationsRefreshDelay)
      return

    const response = await NotificationService.action(
      soffit,
      notificationsDeleteApiUrl,
      notifIds,
    )
    if (response)
      deleteNotifications(notifIds)
  }

  dayTemplate(
    day: string,
    services: Map<string, Notif[]>,
  ): TemplateResult {
    const isToday = differenceInCalendarDays(day, new Date()) === 0

    return html`
      <li>
        <h2
          title="${
            ifDefined(!isToday ? format(day, 'P') : undefined)
          }"
        >
          ${intlFormatDistance(day, new Date(), { unit: 'day' })}
        </h2>

        <ul>
          ${
            repeat(
              services,
              service => service,
              ([key, value]) => this.serviceTemplate(day, key, value),
            )
          }
        </ul>
      </li>
    `
  }

  serviceTemplate(
    day: string,
    service: string,
    notifications: Notif[],
  ): TemplateResult {
    const { notificationsDeleteApiUrl } = $settings.get()
    const notifIds = getNotificationsIds(day, service)
    const services = $services.get()
    const {
      fname,
      name,
      iconUrl,
      category,
    } = services?.find(serv => serv.fname === service) ?? {}
    const { className } = getCategory(category) ?? {}
    let serviceName: string | undefined
    if (services)
      serviceName = name ?? service

    return html`
      <li>
        <div class="header${classMap({
          [className as string]: className !== undefined,
          skeleton: services === undefined,
        })}">
          ${
            iconUrl
              ? getSvgIconService(iconUrl)
              : nothing
          }
          <h3 ?inert="${services === undefined}">${serviceName}</h3>
          ${
            notificationsDeleteApiUrl
              ? html`
                  <button
                    type="button"
                    aria-label="${
                      msg(str`Supprimer les notifications ${serviceName} du ${format(day, 'P')}`)
                    }"
                    class="btn-secondary circle small"
                    @click="${(_: Event) => this.delete(notifIds)}"
                  >
                    ${getIcon(faTimes)}
                  </button>
                `
              : nothing
          }
        </div>

        <ul>
          ${
            repeat(
              notifications,
              notif => notif.notification.header.notificationId,
              notif => this.notificationTemplate(notif, fname),
            )
          }
        </ul>
      </li>
    `
  }

  notificationTemplate(
    notification: Notif,
    fname: string | undefined,
  ): TemplateResult {
    const { notificationsDeleteApiUrl } = $settings.get()
    const {
      notification: {
        content: {
          link,
          message,
          title,
        },
        header: {
          eventHeader: {
            createdAt,
            priority,
          },
          notificationId,
        },
      },
    } = notification
    const { color, icon } = priorityMap[priority]
    const isToday = differenceInCalendarDays(createdAt, new Date()) === 0

    return html`
      <li class="notif">
        <div class="header">
          ${
            getIconWithStyle(
              icon,
              {
                color,
              },
              {
                icon: true,
              },
            )
          }
          <h4>
            ${
              link
                ? html`
                    <a
                      href="${getDomainLink(link)}"
                      target="_self"
                      @click="${(e: Event) => this.handleLinkClick(e, fname)}"
                    >
                      ${title}
                    </a>
                  `
                : title
            }
          </h4>
        </div>
        <p class="message">${message}</p>
        <p
          title="${ifDefined(isToday ? format(createdAt, 'p') : undefined)}"
          class="createdAt"
        >
          ${
            isToday
              ? formatDistanceToNow(createdAt, { includeSeconds: true })
              : format(createdAt, 'p')
          }
        </p>
        ${
          notificationsDeleteApiUrl
            ? html`
                <button
                  type="button"
                  aria-label="${msg(str`Supprimer la notification - ${title}`)}"
                  class="btn-secondary circle small"
                  @click="${(_: Event) => this.delete([notificationId])}"
                >
                  ${getIcon(faTimes)}
                </button>
              `
            : nothing
        }
      </li>
    `
  }

  render(): TemplateResult {
    const groupedNotifications = $groupedNotifications.get()

    return html`
      <button
        type="button"
        class="btn-secondary circle close"
        aria-label="${msg(str`Fermer le tiroir de notification`)}"
        style="${styleMap({
          display: this.isExpanded ? undefined : 'none',
        })}"
        @click="${this.closeDrawer}"
      >
        ${getIcon(faTimes)}
      </button>
      <div
        ${ref(this.layoutRef)}
        id="notification-drawer"
        tabindex="-1"
        class="${classMap({
          expended: this.isExpanded,
        })}notification-drawer"
        aria-label="${msg(str`Tiroir de notification`)}"
      >
        ${
          groupedNotifications && groupedNotifications.size > 0
            ? html`
                <ul>
                  ${
                    repeat(
                      groupedNotifications,
                      ([key, value]) => `${key}-${value.size}`,
                      ([key, value]) => this.dayTemplate(key, value),
                    )
                  }
                </ul>
              `
            : html`
                <p class="empty">
                  ${getIconWithStyle(faBellSlash, undefined, { icon: true })}
                  <span class="text">
                    ${msg(str`Vous n'avez`)}
                    <span class="large">${msg(str`Aucune notification`)}</span>
                  </span>
                </p>
              `
        }
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('notification-drawer')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaNotificationDrawer)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaNotificationDrawer
  }
}
