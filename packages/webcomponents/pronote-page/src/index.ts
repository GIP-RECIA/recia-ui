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
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { name } from '../package.json'
import { formatter, formatterDateTime, parseXsdDate, parseXsdDateTime } from './helpers/dateHelper'
import { getResponseEleveDto } from './services/apiService'
import styles from './style.scss?inline'
import { notificationsTemplate } from './templates/notificationsTemplate'
import { getIconWithStyle } from './utils/fontawesomeUtils'
import './components/resumeCours/index.ts'
import './components/travailAFaire/index.ts'

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

  @state()
  isExpandedVieScolaire: boolean = false

  @state()
  isExpandedDevoirs: boolean = false

  @state()
  isExpandedMap: Map<AllowedValues, boolean> = new Map()

  constructor() {
    super()
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
      <div class="section-wrapper">
        <r-resume-cours
          .resumeDeCoursDtoList='${this.responseEleveDto?.resumeDeCoursDtoList}'
        >
       </r-resume-cours>
      </div>
      <div class="section-wrapper">
        <r-travail-a-faire
          .travailAFaireDtoList='${this.responseEleveDto?.travailAFaireDtoList}'
        >
       </r-travail-a-faire>
      </div>
      <div class="section-wrapper">${this.vieScolaire()}</div>
      <div class="section-wrapper">${this.devoirs()}</div>
    </div>
  `
  }

  vieScolaire(): TemplateResult {
    // todo if loading

    // todo if error

    return html`
      <div class="widescreen">
     <h2>${msg('Vie scolaire')}</h2>
      ${notificationsTemplate(this.vieScolaireEventCount() ?? 0)}
   </div>
      <button class="h2-wrapper" aria-expanded="${this.isExpandedVieScolaire}" @click="${() => { this.isExpandedVieScolaire = !this.isExpandedVieScolaire }}" >
      <h2>${msg('Vie scolaire')}</h2>
      <div class="grow-1"></div>
            ${notificationsTemplate(this.vieScolaireEventCount() ?? 0)}
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
      ${notificationsTemplate(this.responseEleveDto?.devoirDtoList?.length ?? 0)}
    </div>

      <button class="h2-wrapper" aria-expanded="${this.isExpandedDevoirs}" @click="${() => { this.isExpandedDevoirs = !this.isExpandedDevoirs }}" >
        <h2>${this.responseEleveDto!.devoirDtoList!.length < 2 ? msg('Devoir') : msg('Devoirs')}
      </h2>
        <div class="grow-1"></div>
          ${notificationsTemplate(this.responseEleveDto?.devoirDtoList?.length ?? 0)}
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
