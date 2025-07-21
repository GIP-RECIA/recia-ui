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
import type { FilteredOrganization } from './types/OrganizationType.ts'
import type { Service } from './types/ServiceType.ts'
import { faBookOpen, faMessage } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import injectedStyle from './assets/css/injectedStyle.css?inline'
import langHelper from './helpers/langHelper.ts'
import FavoritesService from './services/favoritesService.ts'
import InfoService from './services/infoService.ts'
import LayoutService from './services/layoutService.ts'
import OrganizationService from './services/organizationService.ts'
import PortletService from './services/portletService.ts'
import SessionService from './services/sessionService.ts'
import SoffitService from './services/soffitService.ts'
import TemplateService from './services/templateService.ts'
import UserService from './services/userService.ts'
import { settingsStore } from './stores/SettingsStore.ts'
import { userStore } from './stores/UserStore.ts'
import styles from './style.scss?inline'
import { Category } from './types/CategoryType.ts'
import { setLocale } from './utils/localizationUtils.ts'
import './components/navigation-drawer'
import './components/notification-drawer'
import './components/principal-container'
import './components/services-layout'
import 'regenerator-runtime/runtime.js'
import 'service-info'
import { ReciaBottomSheetServiceInfo } from 'service-info'
import { createRef, Ref, ref } from 'lit/directives/ref.js'

@localized()
export class ReciaHeader extends LitElement {
  data = {
    logo: './spritemap.svg#NOC-simple',
    name: 'Lycée international de Palaiseau',
    homeLink: {
      href: '#',
    },
    visible: true,
    items: [
      {
        name: msg(str`Médiacentre`),
        icon: faBookOpen,
        link: { href: '/portail/p/Mediacentre' },
      },
      {
        name: msg(str`Tutoriels`),
        icon: faMessage,
        link: { href: '/#' },
      },
    ],
    search: true,
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
    services: [
      {
        name: 'Espaces Nextcloud',
        category: Category.collaboratif,
        iconUrl: './spritemap.svg#nextcloud',
        link: {
          href: '#',
        },
        new: true,
        favorite: true,
      },
      {
        name: 'Actualités',
        category: Category.communication,
        iconUrl: './spritemap.svg#actualites',
        link: {
          href: '#',
        },
      },
      {
        name: 'Carte mentale',
        category: Category.apprentissage,
        iconUrl: './spritemap.svg#carte-mentale',
        link: {
          href: '#',
        },
        new: true,
        favorite: true,
      },
      {
        name: 'Capytale',
        category: Category.apprentissage,
        iconUrl: './spritemap.svg#capytale',
        link: {
          href: '#',
        },
        favorite: true,
        more: true,
      },
      {
        name: 'Messagerie',
        category: Category.communication,
        iconUrl: './spritemap.svg#mail',
        link: {
          href: '#',
        },
      },
      {
        name: 'Plateforme vidéo',
        category: Category.documentation,
        iconUrl: './spritemap.svg#POD',
        link: {
          href: '#',
        },
        favorite: true,
      },
      {
        name: 'MédiaCentre',
        category: Category.documentation,
        iconUrl: './spritemap.svg#mediacentre',
        link: {
          href: '#',
        },
      },
      {
        name: 'Kiosque de l\'orientation',
        category: Category.orientation,
        iconUrl: './spritemap.svg#orientation',
        link: {
          href: '#',
        },
      },
      {
        name: 'Mon compte ENT',
        category: Category.parametres,
        iconUrl: './spritemap.svg#MCE',
        link: {
          href: '#',
        },
      },
      {
        name: 'Menus du restaurant scolaire',
        category: Category.vieScolaire,
        iconUrl: './spritemap.svg#espace-vie-scolaire',
        link: {
          href: '#',
        },
      },
      {
        name: 'Orientation',
        category: Category.orientation,
        iconUrl: './spritemap.svg#orientation',
        link: {
          href: '#',
        },
      },
      {
        name: 'Aide du portail ENT',
        category: Category.parametres,
        iconUrl: './spritemap.svg#',
        link: {
          href: '#',
        },
      },
      {
        name: 'Documents',
        category: Category.documentation,
        iconUrl: './spritemap.svg#documentations',
        link: {
          href: '#',
        },
      },
    ],
  }

  @property({ type: String })
  domain: string = window.location.hostname

  @property({ type: String, attribute: 'portal-path' })
  portalPath: string = import.meta.env.VITE_PORTAL_BASE_URL

  @property({ type: String, attribute: 'template-api-url' })
  templateApiUrl?: string

  @property({ type: String, attribute: 'portlet-info-api-url' })
  portletInfoApiUrl?: string

  @property({ type: String, attribute: 'session-api-url' })
  sessionApiUrl?: string

  @property({ type: String, attribute: 'user-info-api-url' })
  userInfoApiUrl?: string

  @property({ type: String, attribute: 'layout-api-url' })
  layoutApiUrl?: string

  @property({ type: String, attribute: 'user-org-id-attribute-name' })
  orgAttributeName?: string

  @property({ type: String, attribute: 'user-all-orgs-id-attribute-name' })
  userAllOrgsIdAttributeName?: string

  @property({ type: String, attribute: 'organization-api-url' })
  organizationApiUrl?: string

  @property({ type: String, attribute: 'portlet-api-url' })
  portletApiUrl?: string

  @property({ type: String, attribute: 'favorite-api-url' })
  favoriteApiUrl?: string

  @property({ type: String, attribute: 'service-info-api-url' })
  serviceInfoApiUrl?: string

  @property({ type: String, attribute: 'services-info-api-url' })
  servicesInfoApiUrl?: string

  @state()
  loaded: boolean = false

  @state()
  services?: Array<Service>

  @state()
  organization?: FilteredOrganization

  @state()
  isNavigationDrawerExpended: boolean = false

  @state()
  isServicesLayout: boolean = false

  @state()
  isSearching: boolean = false

  serviceInfoRef: Ref<ReciaBottomSheetServiceInfo> = createRef()

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    settingsStore.setState({
      portalPath: this.portalPath,
      templateApiUrl: this.templateApiUrl,
      portletInfoApiUrl: this.portletInfoApiUrl,
      sessionApiUrl: this.sessionApiUrl,
      userInfoApiUrl: this.userInfoApiUrl,
      layoutApiUrl: this.layoutApiUrl,
      orgAttributeName: this.orgAttributeName,
      userAllOrgsIdAttributeName: this.userAllOrgsIdAttributeName,
      organizationApiUrl: this.organizationApiUrl,
      portletApiUrl: this.portletApiUrl,
      favoriteApiUrl: this.favoriteApiUrl,
    })
    if (_changedProperties.has('domain')) {
      if (!this.domain || this.domain === '') {
        this.domain = window.location.hostname
      }
    }
    if (_changedProperties.has('portalPath')) {
      if (!this.portalPath || this.portalPath === '') {
        this.portalPath = import.meta.env.VITE_PORTAL_BASE_URL
      }
    }
    if (!this.loaded) {
      this.devCalls()
    }
    this.injectStyle()
    document.body.classList.add(this.data.visible ? 'navigation-drawer-visible' : '', 'auto-margin-top')
    return true
  }

  async devCalls(): Promise<void> {
    if (
      !this.portletInfoApiUrl
      || !this.templateApiUrl
      || !this.sessionApiUrl
      || !this.userInfoApiUrl
      || !this.layoutApiUrl
      || !this.orgAttributeName
      || !this.userAllOrgsIdAttributeName
      || !this.organizationApiUrl
      || !this.portletApiUrl
      || !this.favoriteApiUrl
    ) {
      return
    }

    const fname = 'GLC'

    const template = await TemplateService.get(this.templateApiUrl, this.domain)
    console.log(template)

    const session = await SessionService.get(this.sessionApiUrl)
    console.log(session)

    const soffit = await SoffitService.get(this.userInfoApiUrl)
    settingsStore.setState({ soffit })
    console.log(soffit)

    if (!soffit)
      return

    const userInfo = UserService.getFromSoffit(soffit, this.orgAttributeName, this.userAllOrgsIdAttributeName)
    userStore.setState({ userInfo })
    console.log(userInfo)

    if (userInfo) {
      this.organization = await OrganizationService.get(
        soffit,
        this.organizationApiUrl,
        userInfo.orgIds ?? [],
        userInfo.currentOrgId ?? '',
        'ESCOStructureLogo[0]',
      )
      console.log(this.organization)
    }

    const layout = await LayoutService.get(soffit, this.layoutApiUrl)
    console.log(layout)

    const favorites = FavoritesService.getFromLayout(layout)
    console.log(favorites)

    // const favoriteAdd = await FavoritesService.add(soffit, this.favoriteApiUrl, 114)
    // console.log(favoriteAdd)

    // const favoriteRemove = await FavoritesService.remove(soffit, this.favoriteApiUrl, 114)
    // console.log(favoriteRemove)

    const currentPortlet = await PortletService.get(`${this.portletInfoApiUrl}/${fname}.json`)
    console.log(currentPortlet)

    const portlets = await PortletService.getAll(soffit, this.portletApiUrl)
    console.log(portlets)

    this.loaded = true
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

  async toggleServicesLayout(e: CustomEvent): Promise<void> {
    const { show } = e.detail
    this.isServicesLayout = show
    document.documentElement.style.overflowY = show ? 'hidden' : ''
    if (show) {
      const { userInfoApiUrl, portletApiUrl, soffit } = settingsStore.getState()
      if (!userInfoApiUrl || !portletApiUrl || !soffit)
        return

      const portlets = await PortletService.getAll(soffit, portletApiUrl)
      const portletsInfo = await InfoService.getAll(this.servicesInfoApiUrl ?? '')
      this.services = portlets?.map((portlet) => {
        const {
          id,
          fname,
          title,
          favorite,
          parameters: {
            iconUrl,
            alternativeMaximizedLink,
            alternativeMaximizedLinkTarget,
          },
        } = portlet
        const { categoriePrincipale, doesInfoExist } = portletsInfo?.find(el => el.fname === fname) ?? {}

        return {
          id,
          fname,
          name: title,
          category: categoriePrincipale,
          iconUrl: iconUrl?.value,
          link: {
            href: alternativeMaximizedLink?.value ?? `/portail/p/${fname}`,
            target: alternativeMaximizedLinkTarget?.value ?? '_self',
          },
          favorite,
          more: doesInfoExist,
        }
      })
    }
  }

  async openMore(e: CustomEvent) {
    const { fname } = e.detail
    if (!fname)
      return

    this.serviceInfoRef.value?.dispatchEvent(new CustomEvent('service-info', { detail: { fname }}))
  }

  render(): TemplateResult {
    return html`
      <div class="header">
        <div
          class="mask"
          style="${styleMap({
            display: this.isSearching ? '' : 'none',
          })}"
        >
        </div>
        <r-navigation-drawer
          logo="${this.data.logo}"
          name="${this.organization?.current.displayName ?? ''}"
          .homeLink="${this.data.homeLink}"
          ?visible="${this.data.visible}"
          .items="${this.data.items}"
          ?services-layout-state="${this.isServicesLayout}"
          @toggle-services-layout="${this.toggleServicesLayout}"
        >
        </r-navigation-drawer>
        <div class="topbar">
          <r-principal-container
            name="${this.organization?.current.displayName ?? ''}"
            search="${this.data.search}"
          >
          </r-principal-container>
        </div>
        <r-services-layout
          ?show="${this.isServicesLayout}"
          ?navigation-drawer-visible="${this.data.visible}"
          .filters="${this.data.filters}"
          .services="${this.services}"
          @close="${this.toggleServicesLayout}"
          @open-more="${this.openMore}"
        >
        </r-services-layout>
        <r-notification-drawer>
        </r-notification-drawer>
      </div>
      <div class="teleport">
        <r-service-info-bottom-sheet
          ${ref(this.serviceInfoRef)}
          portal-info-api-url="${this.portletInfoApiUrl ?? ''}"
          service-info-api-url="${this.serviceInfoApiUrl ?? ''}"
        >
        </r-service-info-bottom-sheet>
      </div>
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
