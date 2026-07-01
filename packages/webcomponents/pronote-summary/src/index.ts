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
import type { SummaryElement, SummaryResponse } from './types/pronoteSummaryType'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, updateWhenLocaleChanges } from '@lit/localize'
import { componentName } from 'common/config.ts'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { name } from '../package.json'
import styles from './style.scss?inline'
import { getIconWithStyle } from './utils/fontawesomeUtils'

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
  summary: SummaryElement[] | undefined = undefined

  @state()
  isError: boolean = false

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
      const response = await fetch(this.urlPronoteApi, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
        signal: AbortSignal.timeout(this.timeout),
        redirect: 'follow',
      })

      if (!response.ok) {
        const errorBody = await response.json()
        throw new Error(
          `HTTP error ${response.status}: ${errorBody}`,
        )
      }

      const summary: SummaryResponse = await response.json()

      this.summary = summary.data
      if (this.summary === undefined) {
        this.isError = true
      }
    }
    catch {
      this.isError = false
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
    const elements = []

    if (!this.loading) {
      if (this.summary) {
        for (let i = 0; i < this.summary.length; i++) {
          elements.push(
            html`
            <div class="case">
              <div class="numero">${this.summary[i].count}</div>
              <div class="texte">
                ${this.conversionMap.get(this.summary[i].description)}
              </div>
              <div class="numero mobile-only">${this.summary[i].count}</div>
            </div>
            `,
          )
        }
      }
      else {
        elements.push(html`
          <div>
            ${this.errorMessage}
          </div>
          `)
      }
    }
    else {
      elements.push(this.skeletonTemplates())
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

  skeletonTemplates(): TemplateResult[] {
    const elements = []

    for (let i = 0; i < this.maxElements; i++) {
      elements.push(
        html`
            <div class="case loading">
            </div>
            `,
      )
    }

    return elements
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
