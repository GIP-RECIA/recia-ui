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
import type { VieScolaireDto } from '../../types/pronoteType'
import { localized, msg, str } from '@lit/localize'
import { componentName } from 'common/config.js'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { formatter, formatterDateTime, parseXsdDate, parseXsdDateTime } from '../../helpers/dateHelper'
import styles from '../../style.scss?inline'
import '../vieScolaireCategory/index.ts'

@localized()
export class VieScolaire extends LitElement {
  @property({ type: Array, attribute: 'vie-scolaire-dto' })
  vieScolaireDto?: VieScolaireDto

  constructor() {
    super()
  }

  render(): TemplateResult {
    if (this.vieScolaireDto === undefined || this.vieScolaireDto === null || this.vieScolaireEventCount() === 0) {
      return html`
       <h2 class="widescreen">${msg('Vie scolaire')}</h2>
      <div class="h2-wrapper">
        <h2>${msg('Devoir')}</h2>
      </div>
      <p>${(msg('Aucun évènement de vie scolaire n\'est survenu lors des 7 derniers jours.'))}</p>
      `
    }

    return html`
    <r-pronote-discoverable-section
      display-title='${msg('Vie scolaire')}'
      content-classes='vie-scolaire-content'
      count=${this.vieScolaireEventCount() ?? 0}
    >
    <div class="vie-scolaire-subcategory-wrapper">
        ${this.absences()}
        ${this.retards()}
        ${this.infirmeries()}
        ${this.punitions()}
        ${this.sanctions()}
        ${this.observations()}
      </div>
    </r-pronote-discoverable-section>
    `
  }

  absences(): TemplateResult {
    const count = this.vieScolaireDto?.absenceList?.length ?? 0
    return html`

    <r-vie-scolaire-category
    display-title=${count < 2
      ? msg(str`Absence (${count})`)
      : msg(str`Absences (${count})`)}>
${
  repeat(this.vieScolaireDto?.absenceList ?? [], absence => absence, (absence, indexAbsence) => {
    return html`
      ${indexAbsence > 0 ? html`<hr/>` : ''}
      <p><span>${msg('Du : ')} </span>${formatterDateTime.format(parseXsdDateTime(absence.dateDebut))}</p>
      <p><span>${msg('Au : ')} </span>${formatterDateTime.format(parseXsdDateTime(absence.dateFin))}</p>
      <p><span>${msg('Justifiée : ')} </span>${absence.justifie ? msg('oui') : msg('non')}</p>
      <p><span>${msg('Motif : ')} </span>${absence.motif}</p>
    `
  })
}
    </r-vie-scolaire-category>

`
  }

  retards(): TemplateResult {
    const count = this.vieScolaireDto?.retardList?.length ?? 0
    return html`
    <r-vie-scolaire-category
    display-title=${count < 2
      ? msg(str`Retard (${count})`)
      : msg(str`Retards (${count})`)}>
${
  repeat(this.vieScolaireDto?.retardList ?? [], retard => retard.date, (retard, indexRetard) => {
    return html`
                ${indexRetard > 0 ? html`<hr/>` : ''}
                <p><span>${msg('Le : ')} </span>${formatterDateTime.format(parseXsdDateTime(retard.date))}</p>
                <p><span>${msg('Justifié : ')} </span>${retard.justifie ? msg('oui') : msg('non')}</p>
                <p><span>${msg('Motif : ')} </span>${retard.motif}</p>
              `
  })
}
    </r-vie-scolaire-category>
    `
  }

  infirmeries(): TemplateResult {
    const count = this.vieScolaireDto?.passageInfirmerieList?.length ?? 0
    return html`

<r-vie-scolaire-category
display-title=${count < 2
  ? msg(str`Passage infirmerie (${count})`)
  : msg(str`Passages infirmerie (${count})`)}>
          ${
            repeat(this.vieScolaireDto?.passageInfirmerieList ?? [], infirmerie => infirmerie.date, (infirmerie, indexInfirmerie) => {
              return html`
                ${indexInfirmerie > 0 ? html`<hr/>` : ''}
                <p><span>${msg('Le : ')} </span>${formatterDateTime.format(parseXsdDateTime(infirmerie.date))}</p>
              `
            })
          }
</r-vie-scolaire-category>
`
  }

  punitions(): TemplateResult {
    const count = this.vieScolaireDto?.punitionList?.length ?? 0
    return html`
      <r-vie-scolaire-category
      display-title=${count < 2
        ? msg(str`Punition (${count})`)
        : msg(str`Punitions (${count})`)}>
${
  repeat(this.vieScolaireDto?.punitionList ?? [], punition => punition.date + punition.nature + punition.matiere, (punition, indexPunition) => {
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
      </r-vie-scolaire-category>
`
  }

  sanctions(): TemplateResult {
    const count = this.vieScolaireDto?.sanctionList?.length ?? 0
    return html`

     <r-vie-scolaire-category
     display-title=${count < 2
        ? msg(str`Sanction (${count})`)
        : msg(str`Sanctions (${count})`)}>
${
  repeat(this.vieScolaireDto?.sanctionList ?? [], sanction => sanction.date + sanction.nature + sanction.motif, (sanction, indexSanction) => {
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
     </r-vie-scolaire-category>
`
  }

  observations(): TemplateResult {
    const count = this.vieScolaireDto?.observationList?.length ?? 0
    return html`

    <r-vie-scolaire-category display-title=${count < 2
      ? msg(str`Observation (${count})`)
      : msg(str`Observations (${count})`)}>
${
  repeat(this.vieScolaireDto?.observationList ?? [], observation => observation, (observation, indexObservation) => {
    return html`
                ${indexObservation > 0 ? html`<hr/>` : ''}
                <p><span>${msg('Le : ')} </span>${formatter.format(parseXsdDate(observation.date))}</p>
                ${observation.matiere ? html`<p><span>${msg('Matière : ')} </span>${observation.matiere}</p>` : ''}
                <p><span>${msg('Demandeur : ')} </span>${observation.demandeur}</p>
                <p><span>${msg('Observation : ')} </span>${observation.observation}</p>

              `
  })
}
    </r-vie-scolaire-category>
`
  }

  vieScolaireEventCount(): number {
    return this.vieScolaireDto
      ? (this.vieScolaireDto.absenceList?.length ?? 0)
      + (this.vieScolaireDto.retardList?.length ?? 0)
      + (this.vieScolaireDto.passageInfirmerieList?.length ?? 0)
      + (this.vieScolaireDto.punitionList?.length ?? 0)
      + (this.vieScolaireDto.sanctionList?.length ?? 0)
      + (this.vieScolaireDto.observationList?.length ?? 0)
      : 0
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('vie-scolaire')

if (!customElements.get(tagName)) {
  customElements.define(tagName, VieScolaire)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: VieScolaire
  }
}
