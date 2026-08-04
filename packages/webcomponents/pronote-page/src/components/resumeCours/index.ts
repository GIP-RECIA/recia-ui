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
import type { ResumeDeCoursDto } from '../../types/pronoteType'
import { localized, msg } from '@lit/localize'
import { componentName } from 'common/config.js'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { TabPanelHandler } from '../../handlers/tabPanelHandler'
import { formatter, parseXsdDate } from '../../helpers/dateHelper'
import { safeHtml } from '../../helpers/safeHtml'
import styles from '../../style.scss?inline'
import { titledLinkListTemplate } from '../../templates/titledLinkListTemplate'
import '../pronoteDiscoverableSection/index.ts'

@localized()
export class ResumeCours extends LitElement {
  @property({ type: Array, attribute: 'resume-cours-dto-list' })
  resumeDeCoursDtoList?: ResumeDeCoursDto[]

  tabPannelHandlerResumeCours: TabPanelHandler

  selectedTabIdPrefixResumeCours: string = 'tab-resume-cours-id-'

  tabPannelPrefixResumeCours = 'tabpanel-resume-cours-'

  constructor() {
    super()
    this.tabPannelHandlerResumeCours = new TabPanelHandler(this.selectedTabIdPrefixResumeCours, this.tabPannelPrefixResumeCours, () => this.requestUpdate())
  }

  render(): TemplateResult {
    // todo if loading

    // todo if error

    const dateStringArray: Set<string> = new Set(this.resumeDeCoursDtoList?.map(x => x.date))
    const dateMap: Map<string, Date> = new Map()

    this.resumeDeCoursDtoList?.map(x => x.date).forEach((value) => {
      const dateParsed: Date = parseXsdDate(value)
      dateMap.set(value, dateParsed)
    })

    const sortedDates = Array.from(dateStringArray).sort()

    return html`

 <r-pronote-discoverable-section
      display-title='${this.resumeDeCoursDtoList?.length ?? 0 < 2 ? msg('Résumé de cours') : msg('Résumés de cours')}'
      content-classes='resume-content'
      count=${this.resumeDeCoursDtoList?.length ?? 0}
    >
         <!-- a devenir tabs selections de jours -->

      <div class="date-selector">
        ${
          repeat(sortedDates, item => item, (item, index) => html`
          <button
            id="${this.tabPannelHandlerResumeCours.getButtonId(index)}"
            role="tab"
            aria-selected=${this.tabPannelHandlerResumeCours.getAriaSelected(index)}
            aria-controls="${this.tabPannelHandlerResumeCours.getAriaControl(index)}"
            @keydown="${this.tabPannelHandlerResumeCours.onKeydown}"
            @click="${() => this.tabPannelHandlerResumeCours.setSelected(index)}"
            tabindex="${this.tabPannelHandlerResumeCours.getTabIndex(index)}"
            ${ref((el: Element | undefined) => {
              if (el instanceof HTMLButtonElement) {
                this.tabPannelHandlerResumeCours.addButton(el, index)
              }
            })}
       class="${this.tabPannelHandlerResumeCours.getAriaSelected(index) ? 'active tag' : 'tag'}"
          >
          ${formatter.format(dateMap.get(item))}
        </button>


          `)
        }
      </div>


      ${
        repeat(sortedDates, unparsedDate => unparsedDate, (unparsedDate, index) => html`
          <div
          id="${this.tabPannelHandlerResumeCours.getPanelId(index)}"
          role="tabpanel"
          tabindex="${this.tabPannelHandlerResumeCours.getTabIndex(index)}"
          class="${!this.tabPannelHandlerResumeCours.getAriaSelected(index) ? 'is-hidden tabpanel' : 'tabpanel'}"
          aria-labelledby="${this.tabPannelHandlerResumeCours.getButtonId(index)}">
          ${
            repeat(this.resumeDeCoursDtoList?.filter(x => x.date === unparsedDate) ?? [], cours => cours.id, (cours, indexCours) => {
              return html`
            <div

            >
               ${indexCours > 0 ? html`<hr/>` : ''}

            <h3>${cours.matiere}</h3>
            ${repeat(cours.contenuDeCoursList ?? [], cdc => cdc, cdc =>
              html`

                <h4>${cdc.titre}</h4>
                <p class="categorie tag">${cdc.categorie}</p>
                <p class="descriptif" >${unsafeHTML(safeHtml(cdc.descriptif ?? ''))}</p>
                  ${
                    titledLinkListTemplate(cdc.pieceJointeList?.length ?? 0 > 1 ? msg('Pièces jointes') : msg('Pièce jointe'), cdc.pieceJointeList)
                  }

                ${
                  titledLinkListTemplate(cdc.siteInternetList?.length ?? 0 > 1 ? msg('Sites internets') : msg('Site internet'), cdc.siteInternetList)
                }


              `)}
            </div>
            `
            })
          }
          </div>
        `)
      }
  </r-pronote-discoverable-section>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('resume-cours')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ResumeCours)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ResumeCours
  }
}
