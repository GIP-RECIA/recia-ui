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
import { msg } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './style.scss?inline'

enum IdpIdType {
  ParentEleveEN = 'parentEleveEN-IdP',
  ElevesParents = 'eleves-parents',
  Catel = 'catel-IdP',
  Agri = 'agri-IdP',
  RCVL = 'RCVL-IdP',
  AutresPublics = 'autres-publics',
}

const config: Record<IdpIdType, { svg: string, i18n: string }> = {
  [IdpIdType.ParentEleveEN]: {
    svg: 'profile1',
    i18n: 'Élèves ou parent\n(éducation nationale)',
  },
  [IdpIdType.ElevesParents]: {
    svg: 'profile2',
    i18n: 'Élève ou parent\n(enseignement agricole)',
  },
  [IdpIdType.Catel]: {
    svg: 'profile3',
    i18n: 'Personnel\n(éducation nationale)',
  },
  [IdpIdType.Agri]: {
    svg: 'profile4',
    i18n: 'Personnel\n(enseignement agricole)',
  },
  [IdpIdType.RCVL]: {
    svg: 'profile5',
    i18n: 'Personnel\n(Région Centre-Val de Loire)',
  },
  [IdpIdType.AutresPublics]: {
    svg: 'profile6',
    i18n: 'Autre public\n(utilisateur local, entreprise,...)',
  },
}

@customElement('r-wayf')
export class ReciaWayf extends LitElement {
  @property({ attribute: 'cas-url', type: String })
  casUrl?: string

  @property({ type: String })
  service?: string

  @property({ type: String })
  token?: string

  @property({ attribute: 'idp-ids', type: Array })
  idpIds?: Array<IdpIdType>

  @property({ attribute: 'svg-url', type: String })
  svgUrl: string = '/spritemap.svg'

  tile(idpId: IdpIdType): TemplateResult {
    const { svg, i18n } = config[idpId]

    return html`
      <li>
        <a href="${this.casUrl}">
          <svg class="wayf-profile" aria-hidden="true">
            <use href="${this.svgUrl}#${svg}"></use>
          </svg>
          <span>${msg(i18n)}</span>
        </a>
      </li>
    `
  }

  render() {
    return html`
      <ul class="wayf-tiles">
        ${this.idpIds?.filter(idpId => Object.values(IdpIdType).includes(idpId)).map(idpId => this.tile(idpId))}
      </ul>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    'r-wayf': ReciaWayf
  }
}
