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
import type { LangRef } from './helpers/langHelper.ts'
import type { DrawerItem, HeaderProperties, SettingsHeaderProperties } from './types/index.ts'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { debounce, throttle } from 'lodash-es'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import SessionService from './services/sessionService.ts'
import SoffitService from './services/soffitService.ts'
import {
  $authenticated,
  $debug,
  $infoEtabData,
  $organizations,
  $settings,
  updateServices,
  updateSettings,
  updateSoffit,
} from './stores/index.ts'
import styles from './style.scss?inline'
import { UserMenuItem } from './types/index.ts'
import { setLocale } from './utils/localizationUtils.ts'
import {
  addScrollbarWidthListeners,
  injectStyle,
  removeScrollbarWidthListeners,
} from './utils/styleUtils.ts'
import './components/navigation-drawer/index.ts'
import './components/notification-drawer/index.ts'
import './components/principal-container/index.ts'
import './components/services-layout/index.ts'
import './components/change-etab-bottom-sheet/index.ts'
import './components/info-etab/bottom-sheet/index.ts'
import './components/service-info/bottom-sheet/index.ts'
import 'regenerator-runtime/runtime.js'

const listenEvents: string[] = ['mousemove', 'click', 'keypress']

const settingsPropsKeys = [
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
  'casUrl',
  'userInfoPortletUrl',
  'switchOrgApiUrl',
  'switchOrgPortletUrl',
  'orgAttributeName',
  'userAllOrgsIdAttributeName',
  'orgTypeAttributeName',
  'orgLogoUrlAttributeName',
  'orgPostalCodeAttributeName',
  'orgStreetAttributeName',
  'orgCityAttributeName',
  'orgMailAttributeName',
  'orgPhoneAttributeName',
  'orgWebsiteAttributeName',
  'portletInfoApiUrl',
  'serviceInfoApiUrl',
  'servicesInfoApiUrl',
  'categoryClassMapping',
  'dnmaUrl',
  'fname',
  'drawerItems',
  'navigationDrawerVisible',
  'homePage',
  'starter',
  'cacheBusterVersion',
] as const satisfies readonly SettingsHeaderProperties[]

@localized()
@useStores($authenticated)
@useStores($infoEtabData)
@useStores($organizations)
@useStores($settings)
export class ReciaHeader extends LitElement {
  @property({ type: Array })
  messages?: LangRef[]

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

  @property({ type: String, attribute: 'template-api-path' })
  templateApiPath?: string

  @property({ type: String, attribute: 'sign-out-url' })
  signOutUrl?: string

  @property({ type: String, attribute: 'sign-in-url' })
  signInUrl?: string

  @property({ type: String, attribute: 'cas-url' })
  casUrl?: string

  @property({ type: String, attribute: 'user-info-portlet-url' })
  userInfoPortletUrl?: string

  @property({ type: String, attribute: 'switch-org-api-url' })
  switchOrgApiUrl?: string

  @property({ type: String, attribute: 'switch-org-portlet-url' })
  switchOrgPortletUrl?: string

  @property({ type: String, attribute: 'user-org-id-attribute-name' })
  orgAttributeName?: string

  @property({ type: String, attribute: 'user-all-orgs-id-attribute-name' })
  userAllOrgsIdAttributeName?: string

  @property({ type: String, attribute: 'org-type-attribute-name' })
  orgTypeAttributeName?: string

  @property({ type: String, attribute: 'org-logo-url-attribute-name' })
  orgLogoUrlAttributeName?: string

  @property({ type: String, attribute: 'org-postal-code-attribute-name' })
  orgPostalCodeAttributeName?: string

  @property({ type: String, attribute: 'org-street-attribute-name' })
  orgStreetAttributeName?: string

  @property({ type: String, attribute: 'org-city-attribute-name' })
  orgCityAttributeName?: string

  @property({ type: String, attribute: 'org-mail-attribute-name' })
  orgMailAttributeName?: string

  @property({ type: String, attribute: 'org-phone-attribute-name' })
  orgPhoneAttributeName?: string

  @property({ type: String, attribute: 'org-website-attribute-name' })
  orgWebsiteAttributeName?: string

  @property({ type: Boolean, attribute: 'disable-session-renew' })
  sessionRenewDisable: boolean = false

  @property({ type: String, attribute: 'portlet-info-api-url' })
  portletInfoApiUrl?: string

  @property({ type: String, attribute: 'service-info-api-url' })
  serviceInfoApiUrl?: string

  @property({ type: String, attribute: 'services-info-api-url' })
  servicesInfoApiUrl?: string

  @property({ type: Object, attribute: 'category-class-mapping' })
  categoryClassMapping?: Record<number, string>

  @property({ type: String, attribute: 'dnma-url' })
  dnmaUrl?: string

  @property({ type: String })
  fname?: string

  @property({ type: Array, attribute: 'drawer-items' })
  drawerItems?: DrawerItem[]

  @property({ type: Boolean, attribute: 'navigation-drawer-visible' })
  navigationDrawerVisible: boolean = false

  @property({ type: Boolean, attribute: 'home-page' })
  homePage: boolean = false

  @property({ type: Boolean, attribute: 'starter' })
  starter: boolean = false

  @property({ type: String, attribute: 'cache-buster-version' })
  cacheBusterVersion?: string

  @property({ type: Boolean })
  debug: boolean = false

  @state()
  isNavigationDrawerExpanded: boolean = false

  @state()
  isServicesLayout: boolean = false

  @state()
  isFavoriteDropdown: boolean = false

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

  connectedCallback(): void {
    super.connectedCallback()
    injectStyle()
    addScrollbarWidthListeners()
    listenEvents.every(event =>
      document.addEventListener(event, this.handleUserAction.bind(this)),
    )
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    removeScrollbarWidthListeners()
    listenEvents.every(event =>
      document.removeEventListener(event, this.handleUserAction.bind(this)),
    )
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('debug'))
      $debug.set(this.debug)
    if (_changedProperties.has('templateApiPath'))
      this.templateApiUrl = this.templateApiPath
    if (settingsPropsKeys.some(key => _changedProperties.has(key))) {
      const updatedSettings = Object.fromEntries(
        settingsPropsKeys.map(key => [key, this[key]]).filter(([_, value]) => value !== undefined),
      ) as Partial<HeaderProperties>

      updateSettings(updatedSettings)
    }
    return true
  }

  initDebugEventsListener(): void {
    $debug.listen((value) => {
      if (value === true)
        this.addEventListener('update-soffit', updateSoffit)
      else
        this.removeEventListener('update-soffit', updateSoffit)
    })
  }

  handleUserAction(): void {
    if (!$authenticated.value)
      return

    this.debounceRenewToken()
    if (!this.sessionRenewDisable)
      this.throttleRenewSession()
  }

  debounceRenewToken = debounce(SoffitService.renew.bind(this), 500)

  throttleRenewSession = throttle(SessionService.renew.bind(this), SessionService.timeout)

  toggleDrawer(e: CustomEvent): void {
    const { isExpanded } = e.detail
    if (!isExpanded === undefined || typeof isExpanded !== 'boolean')
      return

    this.isNavigationDrawerExpanded = isExpanded
  }

  async toggleServicesLayout(e: CustomEvent): Promise<void> {
    const { show } = e.detail
    if (!show === undefined || typeof show !== 'boolean')
      return

    if (show)
      updateServices()
    this.isServicesLayout = show
    document.documentElement.classList.toggle('services-layout', show)
  }

  toggleFavoriteDropdown(e: CustomEvent): void {
    const { show } = e.detail
    if (!show === undefined || typeof show !== 'boolean')
      return

    this.isFavoriteDropdown = show
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
        this.isSearchOpen = true
        break
      case UserMenuItem.Notification:
        break
      case UserMenuItem.Account:
        break
      case UserMenuItem.InfoEtab:
        this.infoEtabRef.value?.open()
        break
      case UserMenuItem.ChangeEtab:
        this.changeEtabRef.value?.open()
        break
      case UserMenuItem.Starter:
        break
      case UserMenuItem.Logout:
        break

      default:
        break
    }
  }

  handleSearchEvent(e: CustomEvent) {
    const { open, mask } = e.detail
    if (typeof open === 'boolean')
      this.isSearchOpen = open
    if (typeof mask === 'boolean')
      this.isSearching = mask
  }

  render(): TemplateResult {
    const authenticated = $authenticated.get()
    const infoEtabData = $infoEtabData.get()
    const orgName = $organizations.get()?.current.displayName ?? ''
    const { serviceInfoApiUrl, portletInfoApiUrl, navigationDrawerVisible } = $settings.get()
    const isNavigationDrawerVisible = navigationDrawerVisible || this.isServicesLayout || this.isFavoriteDropdown

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
                  name="${orgName}"
                  ?visible="${isNavigationDrawerVisible}"
                  ?services-layout-state="${this.isServicesLayout}"
                  @toggle="${this.toggleDrawer}"
                  @toggle-services-layout="${this.toggleServicesLayout}"
                  @toggle-favorite-dropdown="${this.toggleFavoriteDropdown}"
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
            ?navigation-drawer-visible="${isNavigationDrawerVisible}"
            name="${orgName}"
            ?search-open="${this.isSearchOpen}"
            ?searching="${this.isSearching}"
            ?services-open="${this.isServicesLayout}"
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
                  ?navigation-drawer-visible="${isNavigationDrawerVisible}"
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
                  .data="${infoEtabData}"
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
class ExtendedUportalHeader extends ReciaHeader {}

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaHeader)
}

if (!customElements.get('extended-uportal-header')) {
  customElements.define('extended-uportal-header', ExtendedUportalHeader)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaHeader
    'extended-uportal-header': ExtendedUportalHeader
  }
}
