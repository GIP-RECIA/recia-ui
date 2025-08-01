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

import type { ReciaBottomSheet } from 'bottom-sheet'
import type { PropertyValues, TemplateResult } from 'lit'
import type { Ref } from 'lit/directives/ref.js'
import type { ReciaInfoEtabBottomSheet } from './components/info-etab/bottom-sheet/index.ts'
import type { ReciaBottomSheetServiceInfo } from './components/service-info/bottom-sheet/index.ts'
import type { DrawerItem, HeaderProperties } from './types/index.ts'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import injectedStyle from './assets/css/injectedStyle.css?inline'
import langHelper from './helpers/langHelper.ts'
import {
  $authenticated,
  $debug,
  $organizations,
  $settings,
  updateServices,
  updateSettings,
  updateSoffit,
} from './stores/index.ts'
import styles from './style.scss?inline'
import { UserMenuItem } from './types/index.ts'
import { setLocale } from './utils/localizationUtils.ts'
import './components/navigation-drawer/index.ts'
import './components/notification-drawer/index.ts'
import './components/principal-container/index.ts'
import './components/services-layout/index.ts'
import './components/change-etab-bottom-sheet/index.ts'
import './components/info-etab/bottom-sheet/index.ts'
import './components/service-info/bottom-sheet/index.ts'
import 'regenerator-runtime/runtime.js'

const availablePropsKeys: Array<(keyof HeaderProperties)> = [
  'messages',
  'domain',
  'defaultOrgLogoUrl',
  'defaultOrgIconUrl',
  'defaultAvatarUrl',
  'contextApiUrl',
  'favoriteApiUrl',
  'layoutApiUrl',
  'portletApiUrl',
  'organizationApiUrl',
  'userInfoApiUrl',
  'sessionApiUrl',
  'templateApiUrl',
  'signOutUrl',
  'signInUrl',
  'userInfoPortletUrl',
  'switchOrgPortletUrl',
  'orgAttributeName',
  'orgLogoUrlAttributeName',
  'userAllOrgsIdAttributeName',
  'sessionRenewDisable',
  'portletInfoApiUrl',
  'serviceInfoApiUrl',
  'servicesInfoApiUrl',
  'fname',
  'drawerItems',
  'navigationDrawerVisible',
  'debug',
]

@localized()
@useStores($settings)
@useStores($organizations)
@useStores($authenticated)
export class ReciaHeader extends LitElement {
  data = {
    logo: './spritemap.svg#NOC-simple',
    visible: true,
    filters: [
      {
        id: 'category',
        name: 'Par catégorie :',
        type: 'radio',
        items: [
          {
            key: 'all',
            value: 'Tous les services',
          },
          {
            key: 'new',
            value: 'Nouveautés',
          },
          {
            key: 'collaboratif',
            value: 'Collaboratif',
          },
          {
            key: 'appresntissage',
            value: 'Apprentissage',
          },
          {
            key: 'communication',
            value: 'Communication',
          },
          {
            key: 'documentation',
            value: 'Documentation',
          },
          {
            key: 'vie-scolaire',
            value: 'Vie scolaire',
          },
          {
            key: 'parametres',
            value: 'Paramètres',
          },
          {
            key: 'orientation',
            value: 'Orientation',
          },
        ],
      },
    ],
  }

  @property({ type: Array })
  messages?: Array<any>

  @property({ type: String })
  domain: string = window.location.hostname

  @property({ type: String, attribute: 'default-org-logo-url' })
  defaultOrgLogoUrl?: string

  @property({ type: String, attribute: 'default-org-icon-url' })
  defaultOrgIconUrl?: string

  @property({ type: String, attribute: 'default-avatar-url' })
  defaultAvatarUrl?: string

  @property({ type: String, attribute: 'context-api-url' })
  contextApiUrl?: string

  @property({ type: String, attribute: 'favorite-api-url' })
  favoriteApiUrl?: string

  @property({ type: String, attribute: 'layout-api-url' })
  layoutApiUrl?: string

  @property({ type: String, attribute: 'portlet-api-url' })
  portletApiUrl?: string

  @property({ type: String, attribute: 'organization-api-url' })
  organizationApiUrl?: string

  @property({ type: String, attribute: 'user-info-api-url' })
  userInfoApiUrl?: string

  @property({ type: String, attribute: 'session-api-url' })
  sessionApiUrl?: string

  @property({ type: String, attribute: 'template-api-url' })
  templateApiUrl?: string

  @property({ type: String, attribute: 'sign-out-url' })
  signOutUrl?: string

  @property({ type: String, attribute: 'sign-in-url' })
  signInUrl?: string

  @property({ type: String, attribute: 'user-info-portlet-url' })
  userInfoPortletUrl?: string

  @property({ type: String, attribute: 'switch-org-portlet-url' })
  switchOrgPortletUrl?: string

  @property({ type: String, attribute: 'user-org-id-attribute-name' })
  orgAttributeName?: string

  @property({ type: String, attribute: 'org-logo-url-attribute-name' })
  orgLogoUrlAttributeName?: string

  @property({ type: String, attribute: 'user-all-orgs-id-attribute-name' })
  userAllOrgsIdAttributeName?: string

  @property({ type: Boolean, attribute: 'disable-session-renew' })
  sessionRenewDisable: boolean = false

  @property({ type: String, attribute: 'portlet-info-api-url' })
  portletInfoApiUrl?: string

  @property({ type: String, attribute: 'service-info-api-url' })
  serviceInfoApiUrl?: string

  @property({ type: String, attribute: 'services-info-api-url' })
  servicesInfoApiUrl?: string

  @property({ type: String })
  fname?: string

  @property({ type: Array, attribute: 'drawer-items' })
  drawerItems?: Array<DrawerItem> = [
    {
      id: 'mediacentre',
      name: msg(str`Médiacentre`),
      icon: faBookOpen,
      link: { href: '/portail/p/Mediacentre' },
      autoDetectCurrent: true,
    },
  ]

  @property({ type: Boolean, attribute: 'navigation-drawer-visible' })
  navigationDrawerVisible: boolean = false

  @property({ type: Boolean })
  debug: boolean = false

  @state()
  isNavigationDrawerExpanded: boolean = false

  @state()
  isServicesLayout: boolean = false

  @state()
  isSearchOpen: boolean = false

  @state()
  isSearching: boolean = false

  serviceInfoRef: Ref<ReciaBottomSheetServiceInfo> = createRef()

  changeEtabRef: Ref<ReciaBottomSheet> = createRef()

  infoEtabRef: Ref<ReciaInfoEtabBottomSheet> = createRef()

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
    this.initDebugEventsListener()
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (availablePropsKeys.some(key => _changedProperties.has(key))) {
      const updatedSettings = Object.fromEntries(
        availablePropsKeys.map(key => [key, this[key]]).filter(([_, value]) => value !== undefined),
      ) as Partial<HeaderProperties>

      updateSettings(updatedSettings)
    }
    this.injectStyle()
    document.body.classList.add('auto-margin-top')
    return true
  }

  initDebugEventsListener(): void {
    $debug.listen((value) => {
      if (value === true) {
        this.addEventListener('update-soffit', updateSoffit)
      }
      else {
        this.removeEventListener('update-soffit', updateSoffit)
      }
    })
  }

  injectStyle(): void {
    const id = name
    let style = document.head.querySelector<HTMLStyleElement>(`style#${id}`)
    if (style)
      return

    style = document.createElement('style')
    style.id = id
    style.textContent = injectedStyle
    document.head.appendChild(style)
    window.addEventListener('load', () => {
      document.body.classList.add('transition-active')
    })
  }

  toggleDrawer(e: CustomEvent): void {
    const { isExpanded } = e.detail
    if (!isExpanded === undefined || typeof isExpanded !== 'boolean')
      return

    this.isNavigationDrawerExpanded = isExpanded
  }

  async toggleServicesLayout(e: CustomEvent): Promise<void> {
    const { show } = e.detail
    if (show)
      updateServices()
    this.isServicesLayout = show
    document.documentElement.style.overflowY = show ? 'hidden' : ''
  }

  async openMore(e: CustomEvent) {
    const { fname } = e.detail
    if (!fname)
      return

    this.serviceInfoRef.value?.dispatchEvent(new CustomEvent('service-info', { detail: { fname } }))
  }

  handleUserMenuEvent(e: CustomEvent) {
    const { type } = e.detail
    switch (type as UserMenuItem) {
      case UserMenuItem.Search:
        this.isServicesLayout = false
        this.isSearchOpen = true
        break
      case UserMenuItem.Notification:
        break
      case UserMenuItem.Settings:
        break
      case UserMenuItem.InfoEtab:
        this.infoEtabRef.value?.open()
        break
      case UserMenuItem.ChangeEtab:
        this.changeEtabRef.value?.open()
        break
      case UserMenuItem.Starter:
        document.dispatchEvent(new CustomEvent('launch-starter', {
          bubbles: true,
          composed: true,
        }))
        break
      case UserMenuItem.Logout:
        break

      default:
        break
    }
  }

  handleSearchEvent(e: CustomEvent) {
    const { open, mask } = e.detail
    if (typeof open === 'boolean') {
      this.isSearchOpen = open
      if (open)
        this.isServicesLayout = false
    }
    if (typeof mask === 'boolean')
      this.isSearching = mask
  }

  render(): TemplateResult {
    const authenticated = $authenticated.get()
    const orgName = $organizations.get()?.current.displayName ?? ''
    const { serviceInfoApiUrl, portletInfoApiUrl, navigationDrawerVisible } = $settings.get()

    return html`
      <div class="header">
        <div
          class="mask"
          style="${styleMap({
            display: this.isSearching ? undefined : 'none',
          })}"
        >
        </div>
        ${
          authenticated
            ? html`
                <r-navigation-drawer
                  ?expanded="${this.isNavigationDrawerExpanded}"
                  logo="${this.data.logo}"
                  name="${orgName}"
                  ?visible="${navigationDrawerVisible}"
                  ?services-layout-state="${this.isServicesLayout}"
                  @toggle="${this.toggleDrawer}"
                  @toggle-services-layout="${this.toggleServicesLayout}"
                >
                </r-navigation-drawer>
              `
            : nothing
        }
        <div
          class="${classMap({
            'search-open': this.isSearchOpen,
          })}topbar"
        >
          <r-principal-container
            ?navigation-drawer-visible="${navigationDrawerVisible}"
            name="${orgName}"
            ?search-open="${this.isSearchOpen}"
            ?searching="${this.isSearching}"
            @user-menu-event="${this.handleUserMenuEvent}"
            @search-event="${this.handleSearchEvent}"
          >
          </r-principal-container>
        </div>
        ${
          authenticated
            ? html`
                <r-services-layout
                  ?show="${this.isServicesLayout}"
                  ?navigation-drawer-visible="${navigationDrawerVisible}"
                  @close="${this.toggleServicesLayout}"
                  @open-more="${this.openMore}"
                >
                </r-services-layout>
                <r-notification-drawer>
                </r-notification-drawer>
              `
            : nothing
        }
      </div>
      ${
        authenticated
          ? html`
              <div class="teleport">
                <r-service-info-bottom-sheet
                  ${ref(this.serviceInfoRef)}
                  portal-info-api-url="${portletInfoApiUrl ?? ''}"
                  service-info-api-url="${serviceInfoApiUrl ?? ''}"
                >
                </r-service-info-bottom-sheet>
                <r-change-etab-bottom-sheet
                  ${ref(this.changeEtabRef)}
                >
                </r-change-etab-bottom-sheet>
                <r-info-etab-bottom-sheet
                  ${ref(this.infoEtabRef)}
                >
                </r-info-etab-bottom-sheet>
              </div>
            `
          : nothing
      }
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(name)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaHeader)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaHeader
  }
}
