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
import type { SummaryElement } from '../../types/pronoteSummaryType'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, updateWhenLocaleChanges } from '@lit/localize'
import { componentName } from 'common/config.ts'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { repeat } from 'lit/directives/repeat.js'
import { getSummary } from '../../services/apiService'
import styles from '../../style.scss?inline'
import { getIconWithStyle } from '../../utils/fontawesomeUtils'
import 'tabs'

@localized()
export class ReciaPronoteSummary extends LitElement {
  @property({ type: Number, attribute: 'max-elements' })
  maxElements: number = 5

  @property({ type: Number, attribute: 'timeout' })
  timeout: number = 30000

  @property({ type: String, attribute: 'url-pronote-api' })
  urlPronoteApi: string = ''

  @property({ type: String, attribute: 'url-redirect' })
  urlRedirect: string = ''

  @property({ type: String, attribute: 'dnma-event-name' })
  dnmaEventName: string = ''

  @property({ type: String, attribute: 'fname' })
  fname: string = ''

  @state()
  loading: boolean = true

  @state()
  summaries: Map<string, SummaryElement[]> | undefined = undefined

  @state()
  isError: boolean = false

  @state()
  isParent: boolean = false

  @state()
  summaryKey: string = 'DEFAULT'

  errorMessage: string = msg('Impossible de charger le résumé')

  prefixChildrenPannel = 'shortSummaryTabPanel'

  constructor() {
    super()
    updateWhenLocaleChanges(this)
  }

  firstUpdated() {
    this.fetchSummary()
  }

  connectedCallback(): void {
    super.connectedCallback()
  }

  sendDnmaEvent() {
    const eventDNMA: CustomEvent = new CustomEvent(
      this.dnmaEventName,
      {
        detail:
      {
        fname: this.fname,
      },
      },
    )
    document.dispatchEvent(eventDNMA)
  }

  async fetchSummary(): Promise<void> {
    try {
      const summaryResponse = await getSummary(this.urlPronoteApi, this.timeout)

      this.summaries = new Map(Object.entries(summaryResponse.data))
      this.summaryKey = this.summaries!.keys()!.next()!.value!
      this.isParent = summaryResponse.profil === 'Parent'
      this.isError = false
    }
    catch {
      this.isError = true
    }
    finally {
      this.loading = false
    }
  }

  conversionMap = new Map<string, (count: number) => string>([
    [
      'devoirs',
      count => count <= 1
        ? msg('Devoir à faire')
        : msg('Devoirs à faire'),
    ],
    [
      'visites_infirmerie',
      count => count <= 1
        ? msg('Visite à l\'infirmerie')
        : msg('Visites à l\'infirmerie'),
    ],
    [
      'messages_non_lu',
      count => count <= 1
        ? msg('Message non lu')
        : msg('Messages non lus'),
    ],
    [
      'absences_et_retards',
      count => count <= 1
        ? msg('Absence ou retard')
        : msg('Absences ou retards'),
    ],
    [
      'punitions_et_sanctions',
      count => count <= 1
        ? msg('Punition ou sanction')
        : msg('Punitions ou sanctions'),
    ],
  ])

  render(): TemplateResult {
    return html`
    <div class="title-wrapper-summary"><h2>${msg('Résumé de Pronote (7 derniers jours)')}</h2>
    <a
      class="btn-tertiary small"
      @click="${this.sendDnmaEvent}"
      href="${this.urlRedirect}"
      rel=“noopener noreferrer”>
          ${msg('accéder au récapitulatif')}
              ${getIconWithStyle(faArrowRight, undefined, { icon: true })}
        </a>
      </div>

    <div id="summary-wrapper">
        ${this.content()}
      <div class="redirect mobile-only" >
        <a
        class="btn-tertiary small"
        @click="${this.sendDnmaEvent}"
        href="${this.urlRedirect}"
        rel=“noopener noreferrer”>
          ${msg('accéder au récapitulatif')}
          ${getIconWithStyle(faArrowRight, undefined, { icon: true })}
        </a>
      </div>
    </div>
  `
  }

  content(): TemplateResult | TemplateResult[] {
    if (this.loading) {
      return this.skeletonTemplates()
    }

    try {
      if (this.isParent) {
        return this.parentContent()
      }
      else {
        return this.studentContent()
      }
    }
    catch {
      return html`
        <div>
          ${this.errorMessage}
        </div>
      `
    }
  }

  parentContent(): TemplateResult {
    if (this.summaries === undefined) {
      return html`
        <div>
          ${this.errorMessage}
        </div>
      `
    }

    if (this.summaries.size === 1) {
      return html`<div>${this.studentContent(this.summaries.keys().next().value)}</div>`
    }

    const keys: (string | undefined)[] | undefined = Array.from(this.summaries.keys()).map(x => x.replace(/\$.+/, ''))

    return html`
       <r-tablist
        class="r-tablist"
        id-prefix="${this.prefixChildrenPannel}"
        .tabs='${keys}'
        active-tab="0"
        switch-tabpanel
      ></r-tablist>

      ${
        repeat(this.summaries.entries(), ([key]) => key, ([key, _value], index) => {
          return html`
          <r-tabpanel
        id-prefix="${this.prefixChildrenPannel}"
        index="${index}"
        ?active="${index === 0}"
      >
       ${this.studentContent(key)}
    </r-tabpanel>
    </div>
          `
        })
      }

      `
  }

  studentContent(key: string = 'DEFAULT'): TemplateResult[] {
    const summary: SummaryElement[] | undefined = this.summaries?.get(key)
    if (summary && !this.isError) {
      const elements = []
      elements.push(
        html`
        <ul class="cadre">
            ${repeat(summary, summaryElement => summaryElement.description, summaryElement =>
              html`
            <li class="case">
              <div class="numero">${summaryElement.count}</div>
              <div class="texte">
                ${this.conversionMap.get(summaryElement.description)?.(summaryElement.count)
                ?? summaryElement.description}
              </div>
            </li>
            `)}
            </ul>`,
      )
      return elements
    }

    throw new Error('_')
  }

  skeletonTemplates(): TemplateResult {
    return html`
    <div class="cadre">
      ${map(range(this.maxElements), () => html`
            <div class="case loading">
            </div>
            `)}
    </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('pronote-summary')

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
