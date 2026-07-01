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
import type { SummaryResponse } from './types/pronoteSummaryType'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, updateWhenLocaleChanges } from '@lit/localize'
import { componentName } from 'common/config.ts'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { name } from '../package.json'
import styles from './style.scss?inline'
import { getIconWithStyle } from './utils/fontawesomeUtils'

@localized()
export class ReciaPronoteSummary extends LitElement {
  constructor() {
    super()
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
  }

  getSummary(): SummaryResponse {
    return {
      data: [
        { description: 'devoirs', count: 3 },
        { description: 'visites_infirmerie', count: 4 },
        { description: 'messages_non_lu', count: 143 },
        { description: 'absences_et_retards', count: 32 },
        { description: 'punitions_et_sanctions', count: 7 },
      ],
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
    const summary: SummaryResponse = this.getSummary()

    const elements = []

    for (let i = 0; i < summary.data.length; i++) {
      elements.push(html`
      <div class="case">
        <div class="numero">${summary.data[i].count}</div>
        <div class="texte">
          ${this.conversionMap.get(summary.data[i].description)}
        </div>
        <div class="numero mobile-only">${summary.data[i].count}</div>

        </div>`)
    }

    return html`
    <h2>Résumé de Pronote</h2>
    <div id="summary-wrapper">
      <div  class="redirect">
        <a class="btn-tertiary small">
          Redirection vers page
              ${getIconWithStyle(faArrowRight, undefined, { icon: true })}
        </a>
      </div>
      <div class="cadre">
        ${elements}
      </div>
      <div class="redirect mobile-only">
        <a class="btn-tertiary small">
          Redirection vers page
          ${getIconWithStyle(faArrowRight, undefined, { icon: true })}
        </a>
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
