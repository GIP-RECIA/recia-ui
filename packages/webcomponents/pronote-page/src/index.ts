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
import { localized, msg, updateWhenLocaleChanges } from '@lit/localize'
import { componentName } from 'common/config.ts'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { name } from '../package.json'
import { getResponseEleveDto } from './services/apiService'
import styles from './style.scss?inline'
import './components/resumeCours/index.ts'
import './components/travailAFaire/index.ts'
import './components/vieScolaire/index.ts'
import './components/devoirs/index.ts'

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
  responseEleveDto: ResponseEleveDto | undefined

  errorMessage: string = msg('Impossible de charger le résumé')

  constructor() {
    super()
    updateWhenLocaleChanges(this)
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
      <div class="section-wrapper">
        <r-vie-scolaire
          .vieScolaireDto='${this.responseEleveDto?.vieScolaireDto}'
        >
       </r-vie-scolaire>
      </div>
      <div class="section-wrapper">
        <r-devoirs
            .devoirDtoList='${this.responseEleveDto?.devoirDtoList}'
          >
        </r-devoirs>
      </div>
    </div>
  `
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
