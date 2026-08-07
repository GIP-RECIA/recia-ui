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
import type { EleveDto } from '../../types/pronoteType'
import { localized } from '@lit/localize'
import { componentName } from 'common/config.js'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import styles from '../../style.scss?inline'
import '../cahierDeTextes/index.ts'
import '../travailAFaire/index.ts'
import '../vieScolaire/index.ts'
import '../releveDeNotes/index.ts'

@localized()
export class PronoteInformationGrid extends LitElement {
  @property({ type: Object })
  eleveDto: EleveDto | undefined

  constructor() {
    super()
  }

  render(): TemplateResult {
    return html`
    <div class="page-content">
      <div class="section-wrapper">
        <r-cahier-de-textes
          .resumeDeCoursDtoList='${this.eleveDto?.resumeDeCoursDtoList}'
        >
       </r-cahier-de-textes>
      </div>
      <div class="section-wrapper">
        <r-travail-a-faire
          .travailAFaireDtoList='${this.eleveDto?.travailAFaireDtoList}'
        >
       </r-travail-a-faire>
      </div>
      <div class="section-wrapper">
        <r-vie-scolaire
          .vieScolaireDto='${this.eleveDto?.vieScolaireDto}'
        >
       </r-vie-scolaire>
      </div>
      <div class="section-wrapper">
        <r-releve-de-notes
            .devoirDtoList='${this.eleveDto?.devoirDtoList}'
          >
        </r-releve-de-notes>
      </div>
    </div>
  `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('pronote-information-grid')

if (!customElements.get(tagName)) {
  customElements.define(tagName, PronoteInformationGrid)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: PronoteInformationGrid
  }
}
