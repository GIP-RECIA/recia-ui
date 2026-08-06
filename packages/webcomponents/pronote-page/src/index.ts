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
import type { ResponseDto } from './types/pronoteType'
import { localized, msg, updateWhenLocaleChanges } from '@lit/localize'
import { componentName } from 'common/config.ts'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { name } from '../package.json'
import { getResponseEleveDto } from './services/apiService'
import styles from './style.scss?inline'
import './components/pronoteInformationGrid/index.ts'
import '../../tabs/src/components/tabpanel/index.ts'
import '../../tabs/src/components/tablist/index.ts'

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
  responseDto: ResponseDto | undefined

  errorMessage: string = msg('Impossible de charger le résumé')

  prefixChildrenPannel: string = 'children-selection-prefix'

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
      this.responseDto = await getResponseEleveDto(this.urlPronoteApi, this.timeout)
    }
    catch {
      this.isError = true
    }
    finally {
      this.loading = false
    }
  }

  render(): TemplateResult {
    if (!this.responseDto) {
      if (this.loading) {
        return html`<p>${msg('Chargement en cours')}</p>`
      }
      if (this.isError) {
        return html`<p>${msg('Une erreur est survenue')}</p>`
      }
    }

    if (this.responseDto === undefined) {
      return html`<p>${msg('Une erreur est survenue')}</p>`
    }

    if (this.responseDto?.profil === 'Eleve' || (this.responseDto?.profil === 'Parent' && this.responseDto.eleveDtoList.length === 1)) {
      return html`
        <r-pronote-information-grid
        .eleveDto=${this.responseDto?.eleveDtoList[0]}>
        </r-pronote-information-grid>
        `
    }
    else {
      const keys: (string | undefined)[] | undefined = this.responseDto.eleveDtoList.map(x => x.prenom?.replace(/\$.+/, ''))

      return html`
      <div>
       <r-tablist
        id-prefix="${this.prefixChildrenPannel}"
        .tabs='${keys}'
        active-tab="0"
        switch-tabpanel
      ></r-tablist>

      ${
        repeat(this.responseDto.eleveDtoList, dto => dto.prenom, (dto, index) => {
          return html`
          <r-tabpanel
        id-prefix="${this.prefixChildrenPannel}"
        index="${index}"
        ?active="${index === 0}"
      >
      <r-pronote-information-grid
        .eleveDto=${dto}>
        </r-pronote-information-grid>
    </r-tabpanel>
    </div>
          `
        })
      }

      `
    }

    return html``
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
