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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBookOpen, faGrip, faHouse, faMessage } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { Category } from './types/CategoryType.ts'
import { setLocale } from './utils/localizationUtils.ts'
import './components/navigation-drawer'
import './components/notification-drawer'
import './components/principal-container'
import './components/services-layout'

const tagName = componentName(name)

@localized()
@customElement(tagName)
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
        name: msg(str`Mediacentre`),
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

  @state()
  isNavigationDrawerVisible: boolean = true

  @state()
  isNavigationDrawerExpended: boolean = false

  @state()
  isServicesLayout: boolean = false

  @state()
  isSearching: boolean = false

  constructor() {
    super()
    library.add(
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  toggleServicesLayout(e: CustomEvent) {
    const { show } = e.detail
    this.isServicesLayout = show
    document.documentElement.style.overflowY = show ? 'hidden' : ''
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
          name="${this.data.name}"
          .homeLink="${this.data.homeLink}"
          ?visible="${this.data.visible}"
          .items="${this.data.items}"
          ?services-layout-state="${this.isServicesLayout}"
          @toggle-services-layout="${this.toggleServicesLayout}"
        >
        </r-navigation-drawer>
        <div class="topbar">
          <r-principal-container
            name="${this.data.name}"
            search="${this.data.search}"
          >
          </r-principal-container>
        </div>
        <r-services-layout
          ?show="${this.isServicesLayout}"
          .filters="${this.data.filters}"
          .services="${this.data.services}"
          @close="${this.toggleServicesLayout}"
        >
        </r-services-layout>
        <r-notification-drawer>
        </r-notification-drawer>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaHeader
  }
}
