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
import type { TravailAfaireDto } from '../../types/pronoteType'
import { localized, msg } from '@lit/localize'
import { componentName } from 'common/config.js'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { formatter, parseXsdDate } from '../../helpers/dateHelper'
import { safeHtml } from '../../helpers/safeHtml'
import styles from '../../style.scss?inline'
import { titledLinkListTemplate } from '../../templates/titledLinkListTemplate'

@localized()
export class TravailAFaire extends LitElement {
  @property({ type: Array, attribute: 'travail-a-faire-dto-list' })
  travailAFaireDtoList?: TravailAfaireDto[]

  tabPannelPrefixTravailAFaire = 'tabpanel-travail-a-faire-'

  constructor() {
    super()
  }

  render(): TemplateResult {
    if (this.travailAFaireDtoList === undefined || this.travailAFaireDtoList === null) {
      return html`
       <h2 class="widescreen">${msg('Vie scolaire')}</h2>
      <div class="h2-wrapper">
        <h2>${msg('Devoir')}</h2>
      </div>
      <p>${(msg('Aucun travail à faire n\'a été assigné lors des 7 derniers jour. Tout travail assigné avant cette période ne sera visible que dans votre espace Pronote.'))}</p>
      `
    }

    const dateStringArray: Set<string> = new Set(this.travailAFaireDtoList?.map(x => x.pourLe))
    const dateMap: Map<string, Date> = new Map()

    this.travailAFaireDtoList?.map(x => x.pourLe).forEach((value) => {
      const dateParsed: Date = parseXsdDate(value)
      dateMap.set(value, dateParsed)
    })

    const sortedDates = Array.from(dateStringArray).sort()

    // sort dates

    return html`


      <r-pronote-discoverable-section
        display-title='${msg('Travail à faire')}'
        content-classes='taf-content'
        count=${this.travailAFaireDtoList?.length ?? 0}
      >

      <r-tablist
              class="r-tablist"

        id-prefix="${this.tabPannelPrefixTravailAFaire}"
        .tabs='${sortedDates.map(x => formatter.format(dateMap.get(x)))}'
        active-tab="0"
        switch-tabpanel
      ></r-tablist>

      ${
        repeat(sortedDates, unparsedDate => unparsedDate, (unparsedDate, index) => html`
          <r-tabpanel
        id-prefix="${this.tabPannelPrefixTravailAFaire}"
        index="${index}"
        ?active="${index === 0}"
      >
          ${
            repeat(this.travailAFaireDtoList?.filter(x => x.pourLe === unparsedDate) ?? [], taf => taf, (taf) => {
              return html`

            <h3 class="course">${taf.matiere}</h3>
                <p class="descriptif" >${unsafeHTML(safeHtml(taf.descriptif ?? ''))}</p>
                  ${
                    titledLinkListTemplate((taf.pieceJointeList?.length ?? 0) > 1 ? msg('Pièces jointes') : msg('Pièce jointe'), taf.pieceJointeList)
                  }

                ${
                  titledLinkListTemplate((taf.siteInternetList?.length ?? 0) > 1 ? msg('Sites internets') : msg('Site internet'), taf.siteInternetList)
                }
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

const tagName = componentName('travail-a-faire')

if (!customElements.get(tagName)) {
  customElements.define(tagName, TravailAFaire)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: TravailAFaire
  }
}
