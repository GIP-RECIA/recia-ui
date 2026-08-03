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
import type { ResponseEleveDto } from './types/pronoteType'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { componentName } from 'common/config.ts'
import DOMPurify from 'dompurify'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'

import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { name } from '../package.json'
import { TabPanelHandler } from './handlers/tabPanelHandler'
import { formatter, formatterDateTime, parseXsdDate, parseXsdDateTime } from './helpers/dateHelper'
import { getResponseEleveDto } from './services/apiService'
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
  isExpandedDevoirs: boolean = false

  @state()
  isExpandedMap: Map<AllowedValues, boolean> = new Map()

  tabPannelHandlerResumeCours: TabPanelHandler
  tabPannelHandlerTravailAFaire: TabPanelHandler

  constructor() {
    super()
    this.tabPannelHandlerResumeCours = new TabPanelHandler(this.selectedTabIdPrefixResumeCours, this.tabPannelPrefixResumeCours, () => this.requestUpdate())
    this.tabPannelHandlerTravailAFaire = new TabPanelHandler(this.selectedTabIdPrefixTravailAFaire, this.tabPannelPrefixTravailAFaire, () => this.requestUpdate())
    updateWhenLocaleChanges(this)
    this.isExpandedMap.set('absences', false)
    this.isExpandedMap.set('retards', false)
    this.isExpandedMap.set('infirmerie', false)
    this.isExpandedMap.set('punitions', false)
    this.isExpandedMap.set('sanctions', false)
    this.isExpandedMap.set('observations', false)
  }

  firstUpdated() {
    this.getSummary()
  }

  connectedCallback(): void {
    super.connectedCallback()
  }

  async getSummary(): Promise<void> {
    try {
      this.responseEleveDto = await getResponseEleveDto(this.urlPronoteApi, this.timeout)
    }
    catch {
      this.isError = true
    }
    finally {
      this.loading = false
    }
  }

  render(): TemplateResult {
    if (!this.responseEleveDto) {
      if (this.loading) {
        return html`<p>${msg('Chargement en cours')}</p>`
      }
      if (this.isError) {
        return html`<p>${msg('Une erreur est survenue')}</p>`
      }
    }

    return html`
    <div class="page-content">
      <div class="section-wrapper">${this.resumeCours()}</div>
      <div class="section-wrapper">${this.travailAFaire()}</div>
      <div class="section-wrapper">${this.vieScolaire()}</div>
      <div class="section-wrapper">${this.devoirs()}</div>
    </div>
  `
  }

  notificationsTemplate(count: number): TemplateResult | typeof nothing {
    return count > 0
      ? html`
          <span class="badge lg">
            ${count}
            <span class="sr-only">${msg(str`nombre`)}</span>
          </span>
        `
      : nothing
  }

  resumeCours(): TemplateResult {
    // todo if loading

    // todo if error

    const dateStringArray: Set<string> = new Set(this.responseEleveDto?.resumeDeCoursDtoList?.map(x => x.date))
    const dateMap: Map<string, Date> = new Map()

    this.responseEleveDto?.resumeDeCoursDtoList?.map(x => x.date).forEach((value) => {
      const dateParsed: Date = parseXsdDate(value)
      dateMap.set(value, dateParsed)
    })

    const sortedDates = Array.from(dateStringArray).sort()

    return html`
    <div>


     <div class="widescreen">
      <h2 >${this.responseEleveDto!.resumeDeCoursDtoList!.length < 2 ? msg('Résumé de cours') : msg('Résumés de cours')}</h2>
      ${this.notificationsTemplate(this.responseEleveDto?.resumeDeCoursDtoList?.length ?? 0)}
    </div>
      <button class="h2-wrapper" aria-expanded="${this.isExpandedResumeCours}" @click="${() => { this.isExpandedResumeCours = !this.isExpandedResumeCours }}" >
        <h2>${this.responseEleveDto!.resumeDeCoursDtoList!.length < 2 ? msg('Résumé de cours') : msg('Résumés de cours')}</h2>
        <div class="grow-1"></div>
        ${this.notificationsTemplate(this.responseEleveDto?.resumeDeCoursDtoList?.length ?? 0)}
        ${
          getIconWithStyle(
            faChevronDown,
            { rotate: this.isExpandedResumeCours ? '180deg' : undefined },
            { 'folded-indicator': true },
          )
        }
      </button>
      <!-- a devenir tabs selections de jours -->

       <div class="${this.isExpandedResumeCours ? 'resume-content' : 'not-expanded resume-content'}">
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
                    this.elementList(cdc.pieceJointeList?.length ?? 0 > 1 ? msg('Pièces jointes') : msg('Pièce jointe'), cdc.pieceJointeList)
                  }

                ${
                  this.elementList(cdc.siteInternetList?.length ?? 0 > 1 ? msg('Sites internets') : msg('Site internet'), cdc.siteInternetList)
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
      const dateParsed: Date = parseXsdDate(value)
      dateMap.set(value, dateParsed)
    })

    const sortedDates = Array.from(dateStringArray).sort()

    // sort dates

    return html`
    <div>


     <div class="widescreen">
     <h2>${msg('Travail à faire')}</h2>
      ${this.notificationsTemplate(this.responseEleveDto?.travailAFaireDtoList?.length ?? 0)}
    </div>
      <button class="h2-wrapper" aria-expanded="${this.isExpandedTravailAFaire}" @click="${() => { this.isExpandedTravailAFaire = !this.isExpandedTravailAFaire }}" >
        <h2>${msg('Travail à faire')}</h2>
        <div class="grow-1"></div>
        ${this.notificationsTemplate(this.responseEleveDto?.travailAFaireDtoList?.length ?? 0)}
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
            repeat(this.responseEleveDto?.travailAFaireDtoList?.filter(x => x.pourLe === unparsedDate) ?? [], taf => taf, (taf, tafIndex) => {
              return html`
            <div

            >
             ${tafIndex > 0 ? html`<hr/>` : ''}
            <h3>${taf.matiere}</h3>
                <p class="descriptif" >${unsafeHTML(this.safeHtml(taf.descriptif ?? ''))}</p>
                  ${
                    this.elementList(taf.pieceJointeList?.length ?? 0 > 1 ? msg('Pièces jointes') : msg('Pièce jointe'), taf.pieceJointeList)
                  }

                ${
                  this.elementList(taf.siteInternetList?.length ?? 0 > 1 ? msg('Sites internets') : msg('Site internet'), taf.siteInternetList)
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
      <div class="widescreen">
     <h2>${msg('Vie scolaire')}</h2>
      ${this.notificationsTemplate(this.vieScolaireEventCount() ?? 0)}
   </div>
      <button class="h2-wrapper" aria-expanded="${this.isExpandedVieScolaire}" @click="${() => { this.isExpandedVieScolaire = !this.isExpandedVieScolaire }}" >
      <h2>${msg('Vie scolaire')}</h2>
      <div class="grow-1"></div>
            ${this.notificationsTemplate(this.vieScolaireEventCount() ?? 0)}
      ${
        getIconWithStyle(
          faChevronDown,
          { rotate: this.isExpandedVieScolaire ? '180deg' : undefined },
          { 'folded-indicator': true },
        )
      }
      </button>
      <!-- a devenir tabs selections de jours -->

       <div class="${this.isExpandedVieScolaire ? 'vie-scolaire-content' : 'not-expanded vie-scolaire-content'}">




      ${this.absences()}
      ${this.retards()}
      ${this.infirmeries()}
      ${this.punitions()}
      ${this.sanctions()}
      ${this.observations()}
</div>
    `
  }

  devoirs(): TemplateResult {
    if (this.responseEleveDto?.devoirDtoList === undefined || this.responseEleveDto.devoirDtoList === null) {
      return html`
       <h2 class="widescreen">${msg('Devoir')}</h2>
      <div class="h2-wrapper">
        <h2>${msg('Devoir')}</h2>
      </div>
      <p>${('Impossible de récupérer les informations relatives aux derniers devoirs reçus')}</p>
      `
    }
    return html`
    <div>

    <div class="widescreen">
      <h2 >${this.responseEleveDto!.devoirDtoList!.length < 2 ? msg('Devoir') : msg('Devoirs')}</h2>
      ${this.notificationsTemplate(this.responseEleveDto?.devoirDtoList?.length ?? 0)}
    </div>

      <button class="h2-wrapper" aria-expanded="${this.isExpandedDevoirs}" @click="${() => { this.isExpandedDevoirs = !this.isExpandedDevoirs }}" >
        <h2>${this.responseEleveDto!.devoirDtoList!.length < 2 ? msg('Devoir') : msg('Devoirs')}
      </h2>
        <div class="grow-1"></div>
          ${this.notificationsTemplate(this.responseEleveDto?.devoirDtoList?.length ?? 0)}
        ${
          getIconWithStyle(
            faChevronDown,
            { rotate: this.isExpandedDevoirs ? '180deg' : undefined },
            { 'folded-indicator': true },
          )
        }
      </button>
             <div class="${this.isExpandedDevoirs ? 'devoirs-content' : 'not-expanded devoirs-content'}">

       ${
          repeat(this.responseEleveDto?.devoirDtoList?.sort((a, b) => {
            if (a === undefined || a === null) {
              return 1
            }
            if (b === undefined || b === null) {
              return -1
            }
            if (a === b) {
              return 0
            }

            return a.date < b.date ? -1 : 1
          }) ?? [], devoir => devoir, (devoir, indexDevoir) => {
            return html`
          ${indexDevoir > 0 ? html`<hr/>` : ''}
          <div><span>${msg('Matière : ')}</span>${devoir.matiere}</div>
          <div><span>${msg('Date : ')}</span>${devoir.date ? formatter.format(parseXsdDate(devoir.date)) : ''}</div>
          <div><span>${msg('Note : ')}</span>${devoir.note}/${devoir.bareme}</div>

          `
          })
        }
      </div>
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
      count < 2
        ? msg(str`Absence (${count})`)
        : msg(str`Absences (${count})`),
    )}

       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('absences') ? undefined : 'none',
        })}">

          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.absenceList ?? [], absence => absence, (absence, indexAbsence) => {
              return html`
                ${indexAbsence > 0 ? html`<hr/>` : ''}
                <p><span>${msg('Du : ')} </span>${formatterDateTime.format(parseXsdDateTime(absence.dateDebut))}</p>
                <p><span>${msg('Au : ')} </span>${formatterDateTime.format(parseXsdDateTime(absence.dateFin))}</p>
                <p><span>${msg('Justifiée : ')} </span>${absence.justifie ? msg('oui') : msg('non')}</p>
                <p><span>${msg('Motif : ')} </span>${absence.motif}</p>
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
      count < 2
        ? msg(str`Retard (${count})`)
        : msg(str`Retards (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('retards') ? undefined : 'none',
        })}">

          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.retardList ?? [], retard => retard.date, (retard, indexRetard) => {
              return html`
                ${indexRetard > 0 ? html`<hr/>` : ''}
                <p><span>${msg('Le : ')} </span>${formatterDateTime.format(parseXsdDateTime(retard.date))}</p>
                <p><span>${msg('Justifié : ')} </span>${retard.justifie ? msg('oui') : msg('non')}</p>
                <p><span>${msg('Motif : ')} </span>${retard.motif}</p>
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
      count < 2
        ? msg(str`Passage infirmerie (${count})`)
        : msg(str`Passages infirmerie (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('infirmerie') ? undefined : 'none',
        })}">

          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.passageInfirmerieList ?? [], infirmerie => infirmerie.date, (infirmerie, indexInfirmerie) => {
              return html`
                ${indexInfirmerie > 0 ? html`<hr/>` : ''}
                <p><span>${msg('Le : ')} </span>${formatterDateTime.format(parseXsdDateTime(infirmerie.date))}</p>
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
      count < 2
        ? msg(str`Punition (${count})`)
        : msg(str`Punitions (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('punitions') ? undefined : 'none',
        })}">

          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.punitionList ?? [], punition => punition.date + punition.nature + punition.matiere, (punition, indexPunition) => {
              return html`
                ${indexPunition > 0 ? html`<hr/>` : ''}
                <p><span>${msg('Le : ')} </span>${formatter.format(parseXsdDate(punition.date))}</p>
                <p><span>${msg('Nature : ')} </span>${punition.nature}</p>
                ${punition.matiere ? html`<p><span>${msg('Matière : ')} </span>${punition.matiere ?? ''}</p>` : ''}
                <p><span>${msg('Motif : ')} </span>${punition.motif}</p>
                <p><span>${msg('Circonstances : ')} </span>${punition.circonstances ?? ''}</p>
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
      count < 2
        ? msg(str`Sanction (${count})`)
        : msg(str`Sanctions (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('sanctions') ? undefined : 'none',
        })}">
          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.sanctionList ?? [], sanction => sanction.date + sanction.nature + sanction.motif, (sanction, indexSanction) => {
              return html`
                ${indexSanction > 0 ? html`<hr/>` : ''}
                <p><span>${msg('Le : ')} </span>${formatter.format(parseXsdDate(sanction.date))}</p>
                <p><span>${msg('Nature : ')} </span>${sanction.nature}</p>
                ${sanction.duree ? html` <p><span>${msg('Durée : ')} </span>${sanction.duree}</p>` : ''}
                <p><span>${msg('Motif : ')} </span>${sanction.motif}</p>
                <p><span>${msg('Circonstances : ')} </span>${sanction.circonstances ?? ''}</p>
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
      count < 2
        ? msg(str`Observation (${count})`)
        : msg(str`Observations (${count})`),
    )}
       <div class="vie-scolaire-categorie-content"
       style="${styleMap({
          display: this.isExpandedMap.get('observations') ? undefined : 'none',
        })}">
          ${
            repeat(this.responseEleveDto?.vieScolaireDto?.observationList ?? [], observation => observation, (observation, indexObservation) => {
              return html`
                ${indexObservation > 0 ? html`<hr/>` : ''}
                <p><span>${msg('Le : ')} </span>${formatter.format(parseXsdDate(observation.date))}</p>
                ${observation.matiere ? html`<p><span>${msg('Matière : ')} </span>${observation.matiere}</p>` : ''}
                <p><span>${msg('Demandeur : ')} </span>${observation.demandeur}</p>
                <p><span>${msg('Observation : ')} </span>${observation.observation}</p>

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
    <p>${title}</p>
     <ul>
                  ${repeat(values, value => value, value =>
                      html`
                    <li><a href=${value}>${value}</a></li>
                    `)

                  }
                </ul>`
  }

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
