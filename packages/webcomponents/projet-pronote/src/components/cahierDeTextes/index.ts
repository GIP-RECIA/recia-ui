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
import type { ResumeDeCoursDto } from '../../types/pronoteType.ts'
import { localized, msg } from '@lit/localize'
import { componentName } from 'common/config.js'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { formatter, parseXsdDate } from '../../helpers/dateHelper.ts'
import { safeHtml } from '../../helpers/safeHtml.ts'
import styles from '../../style.scss?inline'
import { titledLinkListTemplate } from '../../templates/titledLinkListTemplate.ts'
import '../pronoteDiscoverableSection/index.ts'

@localized()
export class CahierDeTextes extends LitElement {
  @property({ type: Array, attribute: 'resume-cours-dto-list' })
  resumeDeCoursDtoList?: ResumeDeCoursDto[]

  tabPannelPrefixResumeCours = 'tabpanel-resume-cours-'

  constructor() {
    super()
  }

  render(): TemplateResult {
    if (this.resumeDeCoursDtoList === undefined || this.resumeDeCoursDtoList === null) {
      return html`
       <h2 class="widescreen">${msg('Cahier de textes')}</h2>
      <div class="h2-wrapper">
        <h2>${msg('Cahier de textes')}</h2>
      </div>
      <p>${(msg('Aucun cours n\'a eu lieu lors des 7 derniers jours.'))}</p>
      `
    }

    const dateStringArray: Set<string> = new Set(this.resumeDeCoursDtoList?.map(x => x.date))
    const dateMap: Map<string, Date> = new Map()

    this.resumeDeCoursDtoList?.map(x => x.date).forEach((value) => {
      const dateParsed: Date = parseXsdDate(value)
      dateMap.set(value, dateParsed)
    })

    const sortedDates = Array.from(dateStringArray).sort()

    return html`
 <r-pronote-discoverable-section
      display-title='${'Cahier de textes'}'
      content-classes='resume-content'
      count=${this.resumeDeCoursDtoList?.length ?? 0}
    >
      <r-tablist
              class="r-tablist"
        id-prefix="${this.tabPannelPrefixResumeCours}"
        .tabs='${sortedDates.map(x => formatter.format(dateMap.get(x)))}'
        active-tab="0"
        switch-tabpanel
      ></r-tablist>
      ${
        repeat(sortedDates, unparsedDate => unparsedDate, (unparsedDate, index) => html`
      <r-tabpanel
        id-prefix="${this.tabPannelPrefixResumeCours}"
        index="${index}"
        ?active="${index === 0}"
      >
          ${
            repeat(this.resumeDeCoursDtoList?.filter(x => x.date === unparsedDate) ?? [], cours => cours.id, (cours) => {
              return html`


            <h3 class="course">${cours.matiere}</h3>
            ${repeat(cours.contenuDeCoursList ?? [], cdc => cdc, cdc =>
              html`

                <h4>${cdc.titre}</h4>
                <p class="categorie tag">${cdc.categorie}</p>
                <p class="descriptif" >${unsafeHTML(safeHtml(cdc.descriptif ?? ''))}</p>
                  ${
                    titledLinkListTemplate((cdc.pieceJointeList?.length ?? 0) > 1 ? msg('Pièces jointes') : msg('Pièce jointe'), cdc.pieceJointeList)
                  }

                ${
                  titledLinkListTemplate((cdc.siteInternetList?.length ?? 0) > 1 ? msg('Sites internets') : msg('Site internet'), cdc.siteInternetList)
                }


              `)}
            </div>
            `
            })
          }
          </r-tabpanel>
        `)
      }
  </r-pronote-discoverable-section>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('cahier-de-textes')

if (!customElements.get(tagName)) {
  customElements.define(tagName, CahierDeTextes)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: CahierDeTextes
  }
}
