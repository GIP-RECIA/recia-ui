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
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { localized, msg } from '@lit/localize'
import { componentName } from 'common/config.js'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { TabPanelHandler } from '../../handlers/tabPanelHandler'
import { formatter, parseXsdDate } from '../../helpers/dateHelper'
import { safeHtml } from '../../helpers/safeHtml'
import styles from '../../style.scss?inline'
import { notificationsTemplate } from '../../templates/notificationsTemplate'
import { titledLinkListTemplate } from '../../templates/titledLinkListTemplate'
import { getIconWithStyle } from '../../utils/fontawesomeUtils'

@localized()
export class TravailAFaire extends LitElement {
  @property({ type: Array, attribute: 'travail-a-faire-dto-list' })
  travailAFaireDtoList?: TravailAfaireDto[]

  @state()
  isExpandedTravailAFaire: boolean = false

  tabPannelHandlerTravailAFaire: TabPanelHandler

  selectedTabIdPrefixTravailAFaire: string = 'tab-travail-a-faire-id-'

  tabPannelPrefixTravailAFaire = 'tabpanel-travail-a-faire-'

  constructor() {
    super()
    this.tabPannelHandlerTravailAFaire = new TabPanelHandler(this.selectedTabIdPrefixTravailAFaire, this.tabPannelPrefixTravailAFaire, () => this.requestUpdate())
  }

  render(): TemplateResult {
    // todo if loading

    // todo if error

    // const dates: Set<Date> = new Set()
    const dateStringArray: Set<string> = new Set(this.travailAFaireDtoList?.map(x => x.pourLe))
    const dateMap: Map<string, Date> = new Map()

    this.travailAFaireDtoList?.map(x => x.pourLe).forEach((value) => {
      const dateParsed: Date = parseXsdDate(value)
      dateMap.set(value, dateParsed)
    })

    const sortedDates = Array.from(dateStringArray).sort()

    // sort dates

    return html`
    <div>


     <div class="widescreen">
     <h2>${msg('Travail à faire')}</h2>
      ${notificationsTemplate(this.travailAFaireDtoList?.length ?? 0)}
    </div>
      <button class="h2-wrapper" aria-expanded="${this.isExpandedTravailAFaire}" @click="${() => { this.isExpandedTravailAFaire = !this.isExpandedTravailAFaire }}" >
        <h2>${msg('Travail à faire')}</h2>
        <div class="grow-1"></div>
        ${notificationsTemplate(this.travailAFaireDtoList?.length ?? 0)}
        ${
          getIconWithStyle(
            faChevronDown,
            { rotate: this.isExpandedTravailAFaire ? '180deg' : undefined },
            { 'folded-indicator': true },
          )
        }
      </button>
      <!-- a devenir tabs selections de jours -->

    <div class="${this.isExpandedTravailAFaire ? 'taf-content' : 'not-expanded taf-content'}">
      <div class="date-selector">
        ${
          repeat(sortedDates, item => item, (item, index) => html`
          <button
            id="${this.tabPannelHandlerTravailAFaire.getButtonId(index)}"
            role="tab"
            aria-selected=${this.tabPannelHandlerTravailAFaire.getAriaSelected(index)}
            aria-controls="${this.tabPannelHandlerTravailAFaire.getAriaControl(index)}"
            @keydown="${this.tabPannelHandlerTravailAFaire.onKeydown}"
            @click="${() => this.tabPannelHandlerTravailAFaire.setSelected(index)}"
            tabindex="${this.tabPannelHandlerTravailAFaire.getTabIndex(index)}"
            ${ref((el: Element | undefined) => {
              if (el instanceof HTMLButtonElement) {
                this.tabPannelHandlerTravailAFaire.addButton(el, index)
              }
            })}
       class="${this.tabPannelHandlerTravailAFaire.getAriaSelected(index) ? 'active tag' : 'tag'}"
          >
          ${formatter.format(dateMap.get(item))}
        </button>


          `)
        }
      </div>
      ${
        repeat(sortedDates, unparsedDate => unparsedDate, (unparsedDate, index) => html`
          <div
          id="${this.tabPannelHandlerTravailAFaire.getPanelId(index)}"
      role="tabpanel"
      tabindex="${this.tabPannelHandlerTravailAFaire.getTabIndex(index)}"
      class="${!this.tabPannelHandlerTravailAFaire.getAriaSelected(index) ? 'is-hidden tabpanel' : 'tabpanel'}"
      aria-labelledby="${this.tabPannelHandlerTravailAFaire.getButtonId(index)}">
          ${
            repeat(this.travailAFaireDtoList?.filter(x => x.pourLe === unparsedDate) ?? [], taf => taf, (taf, tafIndex) => {
              return html`
            <div

            >
             ${tafIndex > 0 ? html`<hr/>` : ''}
            <h3>${taf.matiere}</h3>
                <p class="descriptif" >${unsafeHTML(safeHtml(taf.descriptif ?? ''))}</p>
                  ${
                    titledLinkListTemplate(taf.pieceJointeList?.length ?? 0 > 1 ? msg('Pièces jointes') : msg('Pièce jointe'), taf.pieceJointeList)
                  }

                ${
                  titledLinkListTemplate(taf.siteInternetList?.length ?? 0 > 1 ? msg('Sites internets') : msg('Site internet'), taf.siteInternetList)
                }


            </div>
            `
            })
          }
          </div>

          `)
      }
      </div>
    </div>
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
