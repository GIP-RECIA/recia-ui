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
import type { ResponseDto, ResponseEleveDto } from './types/pronoteType'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, updateWhenLocaleChanges } from '@lit/localize'
import { componentName } from 'common/config.ts'
import DOMPurify from 'dompurify'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'

import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { name } from '../package.json'
import { TabPanelHandler } from './handlers/tabPanelHandler'
import styles from './style.scss?inline'
import { getIconWithStyle } from './utils/fontawesomeUtils'

const _allowedValues = [
  'absences',
  'retards',
  'infirmerie',
  'punitions',
  'sanctions',
  'observations',
] as const

type AllowedValues = typeof _allowedValues[number]

@localized()
export class ReciaPronoteSummary extends LitElement {
  @property({ type: Number, attribute: 'max-elements' })
  maxElements: number = 5

  @property({ type: Number, attribute: 'timeout' })
  timeout: number = 30000

  @property({ type: String, attribute: 'url-pronote-api' })
  urlPronoteApi: string = ''

  @state()
  loading: boolean = true

  @state()
  isError: boolean = false

  @state()
  isParent: boolean = false

  @state()
  selectedTabId: string = 'tab-resume-cours-id-0'

  @state()
  responseEleveDto: ResponseEleveDto | undefined

  errorMessage: string = msg('Impossible de charger le résumé')

  selectedTabIdPrefixResumeCours: string = 'tab-resume-cours-id-'
  selectedTabIdPrefixTravailAFaire: string = 'tab-travail-a-faire-id-'

  tabPannelPrefixResumeCours = 'tabpanel-resume-cours-'
  tabPannelPrefixTravailAFaire = 'tabpanel-travail-a-faire-'

  buttonsRefResumeCours: HTMLButtonElement[] = []

  @state()
  isExpandedResumeCours: boolean = false

  @state()
  isExpandedTravailAFaire: boolean = false

  @state()
  isExpandedVieScolaire: boolean = false

  @state()
  isExpandedMap: Map<AllowedValues, boolean> = new Map()

  tabPannelHandlerResumeCours: TabPanelHandler
  tabPannelHandlerTravailAFaire: TabPanelHandler

  constructor() {
    super()
    this.tabPannelHandlerResumeCours = new TabPanelHandler(this.selectedTabIdPrefixResumeCours, this.tabPannelPrefixResumeCours, () => this.requestUpdate())
    this.tabPannelHandlerTravailAFaire = new TabPanelHandler(this.selectedTabIdPrefixTravailAFaire, this.tabPannelPrefixTravailAFaire, () => this.requestUpdate())
    updateWhenLocaleChanges(this)
    this.isExpandedMap.set('absences', true)
    this.isExpandedMap.set('retards', true)
    this.isExpandedMap.set('infirmerie', true)
    this.isExpandedMap.set('punitions', true)
    this.isExpandedMap.set('sanctions', true)
    this.isExpandedMap.set('observations', true)
  }

  firstUpdated() {
    this.getSummary()
  }

  connectedCallback(): void {
    super.connectedCallback()
  }

  async getSummary(): Promise<void> {
    try {
      const response = await fetch(this.urlPronoteApi, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
        signal: AbortSignal.timeout(this.timeout),
        redirect: 'follow',
      })

      if (response.ok) {
        const json = (await response.json()) as ResponseDto

        if (json.profil === 'Eleve') {
          const jsonEleve = json as ResponseEleveDto
          this.responseEleveDto = jsonEleve
        }
      }
      else {
        this.isError = true
      }
    }
    catch {
      this.isError = true
    }
    finally {
      this.loading = false
    }
  }

  conversionMap = new Map<string, string>([
    ['devoirs', msg('Devoir(s) à faire')],
    ['visites_infirmerie', msg('Visite(s) à l\'infirmerie')],
    ['messages_non_lu', msg('Message(s) non lu')],
    ['absences_et_retards', msg('Absence(s) et retard(s)')],
    ['punitions_et_sanctions', msg('Punition(s) et sanction(s)')],
  ])

  render(): TemplateResult {
    return html`
    <div>
      ${this.resumeCours()}
      ${this.travailAFaire()}
      ${this.vieScolaire()}
    </div>
  `
  }

  resumeCours(): TemplateResult {
    // todo if loading

    // todo if error

    const dateStringArray: Set<string> = new Set(this.responseEleveDto?.resumeDeCoursDtoList?.map(x => x.date))
    const dateMap: Map<string, Date> = new Map()

    this.responseEleveDto?.resumeDeCoursDtoList?.map(x => x.date).forEach((value) => {
      const dateParsed: Date = this.parseXsdDate(value)
      dateMap.set(value, dateParsed)
    })

    const sortedDates = Array.from(dateStringArray).sort()

    return html`
    <div>

      <button class="h2-wrapper" aria-expanded="${this.isExpandedResumeCours}" @click="${() => { this.isExpandedResumeCours = !this.isExpandedResumeCours }}" >
        <h2>${msg('Résumés de cours')}</h2>
        <div class="grow-1"></div>
        ${
          getIconWithStyle(
            faChevronDown,
            { rotate: this.isExpandedResumeCours ? '180deg' : undefined },
            { 'folded-indicator': true },
          )
        }
      </button>
      <!-- a devenir tabs selections de jours -->

       <div class="resume-content"
       style="${styleMap({
          display: this.isExpandedResumeCours ? undefined : 'none',
        })}"

       >
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
          ${this.formatter.format(dateMap.get(item))}
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
            repeat(this.responseEleveDto?.resumeDeCoursDtoList?.filter(x => x.date === unparsedDate) ?? [], cours => cours.id, (cours, indexCours) => {
              return html`
            <div

            >
               ${indexCours > 0 ? html`<hr/>` : ''}

            <h3>${cours.matiere}</h3>
            ${repeat(cours.contenuDeCoursList ?? [], cdc => cdc, cdc =>
              html`

                <h4>${cdc.titre}</h4>
                <p class="categorie tag">${cdc.categorie}</p>
                <p class="descriptif" >${unsafeHTML(this.safeHtml(cdc.descriptif ?? ''))}</p>
                  ${
                    this.elementList(msg('Pièces jointes -- TODO PLURIEL'), cdc.pieceJointeList)
                  }

                ${
                  this.elementList(msg('Sites internets -- TODO PLURIEL'), cdc.siteInternetList)
                }


              `)}
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

  travailAFaire(): TemplateResult {
    // todo if loading

    // todo if error

    // const dates: Set<Date> = new Set()
    const dateStringArray: Set<string> = new Set(this.responseEleveDto?.travailAFaireDtoList?.map(x => x.pourLe))
    const dateMap: Map<string, Date> = new Map()

    this.responseEleveDto?.travailAFaireDtoList?.map(x => x.pourLe).forEach((value) => {
      const dateParsed: Date = this.parseXsdDate(value)
      dateMap.set(value, dateParsed)
    })

    const sortedDates = Array.from(dateStringArray).sort()

    // sort dates

    return html`
    <div>

      <button class="h2-wrapper" aria-expanded="${this.isExpandedTravailAFaire}" @click="${() => { this.isExpandedTravailAFaire = !this.isExpandedTravailAFaire }}" >
        <h2>${msg('Travail à faire')}</h2>
        <div class="grow-1"></div>
        ${
          getIconWithStyle(
            faChevronDown,
            { rotate: this.isExpandedTravailAFaire ? '180deg' : undefined },
            { 'folded-indicator': true },
          )
        }
      </button>
      <!-- a devenir tabs selections de jours -->

       <div class="taf-content"
       style="${styleMap({
          display: this.isExpandedTravailAFaire ? undefined : 'none',
        })}"
       >
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
          ${this.formatter.format(dateMap.get(item))}
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
            repeat(this.responseEleveDto?.travailAFaireDtoList?.filter(x => x.pourLe === unparsedDate) ?? [], taf => taf, (taf, tafIndex) => {
              return html`
            <div

            >
             ${tafIndex > 0 ? html`<hr/>` : ''}
            <h3>${taf.matiere}</h3>
                <p class="descriptif" >${unsafeHTML(this.safeHtml(taf.descriptif ?? ''))}</p>
                  ${
                    this.elementList(msg('Pièces jointes -- TODO PLURIEL'), taf.pieceJointeList)
                  }

                ${
                  this.elementList(msg('Sites internets -- TODO PLURIEL'), taf.siteInternetList)
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

  vieScolaire(): TemplateResult {
    // todo if loading

    // todo if error

    return html`
    <button class="h2-wrapper" aria-expanded="${this.isExpandedVieScolaire}" @click="${() => { this.isExpandedVieScolaire = !this.isExpandedVieScolaire }}" >
      <h2>${msg('Vie scolaire')} (${this.vieScolaireEventCount()})</h2>
      <div class="grow-1"></div>
      ${
        getIconWithStyle(
          faChevronDown,
          { rotate: this.isExpandedVieScolaire ? '180deg' : undefined },
          { 'folded-indicator': true },
        )
      }
      </button>
      <!-- a devenir tabs selections de jours -->

       <div class="vie-scolaire-content"
       style="${styleMap({
          display: this.isExpandedVieScolaire ? undefined : 'none',
        })}"
       >



      ${this.absences()}
      ${this.retards()}
      ${this.infirmeries()}
      ${this.punitions()}
      ${this.sanctions()}
      ${this.observations()}
</div>
    `
  }

  vieScolaireCategoryHeader(mapKey: AllowedValues, buttonValue: string) {
    return html`
    <button
         class="h3-wrapper"
         aria-expanded="${this.isExpandedMap.get(mapKey)!}"
         @click="${() => { this.isExpandedMap = new Map(this.isExpandedMap).set(mapKey, !this.isExpandedMap.get(mapKey)) }}" >
        <h3>${buttonValue}</h3>
        <div class="grow-1"></div>
        ${
          getIconWithStyle(
            faChevronDown,
            { rotate: this.isExpandedMap.get(mapKey) ? '180deg' : undefined },
            { 'folded-indicator': true },
          )
        }
      </button>`
  }

  absences(): TemplateResult {
    const count = this.responseEleveDto?.vieScolaireDto?.absenceList?.length ?? 0
    return html`

    ${this.vieScolaireCategoryHeader(
      'absences',
      msg(count < 2 ? `Absence (${count})` : `Absences (${count})`),
    )}

       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('absences') ? undefined : 'none',
        })}">

          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.absenceList ?? [], absence => absence, (absence, indexAbsence) => {
              return html`
                ${indexAbsence > 0 ? html`<hr/>` : ''}
                <p><span>Du : </span>${this.formatterDateTime.format(this.parseXsdDateTime(absence.dateDebut))}</p>
                <p><span>Au : </span>${this.formatterDateTime.format(this.parseXsdDateTime(absence.dateFin))}</p>
                <p><span>Justifiée : </span>${msg(absence.justifie ? 'oui' : 'non')}</p>
                <p><span>Motif : </span>${absence.motif}</p>
              `
            })
          }
      </div>
`
  }

  retards(): TemplateResult {
    const count = this.responseEleveDto?.vieScolaireDto?.retardList?.length ?? 0
    return html`

    ${this.vieScolaireCategoryHeader(
      'retards',
      msg(count < 2 ? `Retard (${count})` : `Retards (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('retards') ? undefined : 'none',
        })}">

          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.retardList ?? [], retard => retard.date, (retard, indexRetard) => {
              return html`
                ${indexRetard > 0 ? html`<hr/>` : ''}
                <p><span>Le : </span>${this.formatterDateTime.format(this.parseXsdDateTime(retard.date))}</p>
                <p><span>Justifié : </span>${msg(retard.justifie ? 'oui' : 'non')}</p>
                <p><span>Motif : </span>${retard.motif}</p>
              `
            })
          }
      </div>`
  }

  infirmeries(): TemplateResult {
    const count = this.responseEleveDto?.vieScolaireDto?.passageInfirmerieList?.length ?? 0
    return html`
    ${this.vieScolaireCategoryHeader(
      'infirmerie',
      msg(count < 2 ? `Passage infirmerie (${count})` : `Passages infirmerie (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('infirmerie') ? undefined : 'none',
        })}">

          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.passageInfirmerieList ?? [], infirmerie => infirmerie.date, (infirmerie, indexInfirmerie) => {
              return html`
                ${indexInfirmerie > 0 ? html`<hr/>` : ''}
                <p><span>Le : </span>${this.formatterDateTime.format(this.parseXsdDateTime(infirmerie.date))}</p>
              `
            })
          }
      </div>
`
  }

  punitions(): TemplateResult {
    const count = this.responseEleveDto?.vieScolaireDto?.punitionList?.length ?? 0
    return html`
    ${this.vieScolaireCategoryHeader(
      'punitions',
      msg(count < 2 ? `Punition (${count})` : `Punitions (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('punitions') ? undefined : 'none',
        })}">

          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.punitionList ?? [], punition => punition.date + punition.nature + punition.matiere, (punition, indexPunition) => {
              return html`
                ${indexPunition > 0 ? html`<hr/>` : ''}
                <p><span>Le : </span>${this.formatter.format(this.parseXsdDate(punition.date))}</p>
                <p><span>Nature : </span>${punition.nature}</p>
                ${punition.matiere ? html`<p><span>Matiere : </span>${punition.matiere ?? ''}</p>` : ''}
                <p><span>Motif : </span>${punition.motif}</p>
                <p><span>Circonstances : </span>${punition.circonstances ?? ''}</p>
              `
            })
          }
      </div>
`
  }

  sanctions(): TemplateResult {
    const count = this.responseEleveDto?.vieScolaireDto?.sanctionList?.length ?? 0
    return html`

    ${this.vieScolaireCategoryHeader(
      'sanctions',
      msg(count < 2 ? `Sanction (${count})` : `Sanctions (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('sanctions') ? undefined : 'none',
        })}">
          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.sanctionList ?? [], sanction => sanction.date + sanction.nature + sanction.motif, (sanction, indexSanction) => {
              return html`
                ${indexSanction > 0 ? html`<hr/>` : ''}
                <p><span>Le : </span>${this.formatter.format(this.parseXsdDate(sanction.date))}</p>
                <p><span>Nature : </span>${sanction.nature}</p>
                ${sanction.duree ? html` <p><span>Durée : </span>${sanction.duree}</p>` : ''}
                <p><span>Motif : </span>${sanction.motif}</p>
                <p><span>Circonstances : </span>${sanction.circonstances ?? ''}</p>
              `
            })
          }
      </div>
`
  }

  observations(): TemplateResult {
    const count = this.responseEleveDto?.vieScolaireDto?.observationList?.length ?? 0
    return html`

    ${this.vieScolaireCategoryHeader(
      'observations',
      msg(count < 2 ? `Observation (${count})` : `Observations (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('observations') ? undefined : 'none',
        })}">
          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.observationList ?? [], observation => observation, (observation, indexObservation) => {
              return html`
                ${indexObservation > 0 ? html`<hr/>` : ''}
                <p><span>Le : </span>${this.formatter.format(this.parseXsdDate(observation.date))}</p>
                ${observation.matiere ? html`<p><span>Matiere : </span>${observation.matiere}</p>` : ''}
                <p><span>Demandeur : </span>${observation.demandeur}</p>
                <p><span>Observation : </span>${observation.observation}</p>

              `
            })
          }
      </div>
`
  }

  elementList(title: string, values: string[] | undefined | null): TemplateResult {
    if (values === undefined || values === null || values.length === 0) {
      return html``
    }
    return html`
    <p>${msg(title)}</p>
     <ul>
                  ${repeat(values, value => value, value =>
                      html`
                    <li><a href=${value}>${value}</a></li>
                    `)

                  }
                </ul>`
  }

  formatter = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  })

  formatterDateTime = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  })

  vieScolaireEventCount(): number {
    return this.responseEleveDto?.vieScolaireDto
      ? (this.responseEleveDto.vieScolaireDto.absenceList?.length ?? 0)
      + (this.responseEleveDto.vieScolaireDto.retardList?.length ?? 0)
      + (this.responseEleveDto.vieScolaireDto.passageInfirmerieList?.length ?? 0)
      + (this.responseEleveDto.vieScolaireDto.punitionList?.length ?? 0)
      + (this.responseEleveDto.vieScolaireDto.sanctionList?.length ?? 0)
      + (this.responseEleveDto.vieScolaireDto.observationList?.length ?? 0)
      : 0
  }

  safeHtml(htmlText: string): string {
    return DOMPurify.sanitize(htmlText, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'i', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    })
  }

  parseXsdDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  parseXsdDateTime(date: string): Date {
    const [year, month, day, hours, minutes, seconds] = date.split(/[\-T:]/).map(Number)
    return new Date(year, month - 1, day, hours, minutes, seconds)
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(name)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaPronoteSummary)
}

declare global {
  interface Window {
    WidgetAdapter: any
  }
  interface HTMLElementTagNameMap {
    [tagName]: ReciaPronoteSummary
  }
}
