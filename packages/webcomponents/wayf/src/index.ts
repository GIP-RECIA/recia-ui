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
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import { IdpIdType } from './IdpIdType.ts'
import styles from './style.scss?inline'
import { setLocale } from './utils/localizationUtils.ts'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaWayf extends LitElement {
  @property({ attribute: 'cas-url', type: String })
  casUrl?: string

  @property({ attribute: 'idp-ids', type: Array })
  idpIds: Array<IdpIdType> = []

  @property({ attribute: 'svg-url', type: String })
  svgUrl: string = '/wayf.spritemap.svg'

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  static i18n(): Record<IdpIdType, string> {
    return {
      [IdpIdType.ParentEleveEN]: msg(str`Élèves ou parent\n(éducation nationale)`),
      [IdpIdType.ElevesParents]: msg(str`Élève ou parent\n(enseignement agricole)`),
      [IdpIdType.Catel]: msg(str`Personnel\n(éducation nationale)`),
      [IdpIdType.Agri]: msg(str`Personnel\n(enseignement agricole)`),
      [IdpIdType.RCVL]: msg(str`Personnel\n(Région Centre-Val de Loire)`),
      [IdpIdType.AutresPublics]: msg(str`Autre public\n(utilisateur local, entreprise,...)`),
    }
  }

  render(): TemplateResult {
    return html`
      <ul class="wayf-tiles">
        ${
          repeat(
            this.idpIds.filter(idpId => Object.values(IdpIdType).includes(idpId)),
            idpId => idpId,
            idpId => html`
              <li>
                <a id=${idpId} href="${this.casUrl}&idpId=${idpId}">
                  <svg class="wayf-profile" aria-hidden="true" >
                    <use href="${this.svgUrl}#${idpId}"></use>
                  </svg>
                  <span>${ReciaWayf.i18n()[idpId]}</span>
                </a>
              </li>
          `,
          )
        }
      </ul>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaWayf
  }
}
