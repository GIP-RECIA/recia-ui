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
import type { SummaryElement } from './types/pronoteSummaryType'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, updateWhenLocaleChanges } from '@lit/localize'
import { componentName } from 'common/config.ts'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { name } from '../package.json'
import { TabPanelHandler } from './handlers/tabPanelHandler'
import { getSummary } from './services/apiService'
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

  @property({ type: String, attribute: 'url-redirect' })
  urlRedirect: string = ''

  @state()
  loading: boolean = true

  @state()
  summaries: Map<string, SummaryElement[]> | undefined = undefined

  @state()
  isError: boolean = false

  @state()
  isParent: boolean = false

  @state()
  summaryKey: string = 'default'

  errorMessage: string = msg('Impossible de charger le résumé')

  tabPannelHandler: TabPanelHandler

  constructor() {
    super()
    this.tabPannelHandler = new TabPanelHandler('child-selector-id-', 'tabpanel-children-', () => this.requestUpdate())
    updateWhenLocaleChanges(this)
  }

  firstUpdated() {
    this.fetchSummary()
  }

  connectedCallback(): void {
    super.connectedCallback()
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

  conversionMap = new Map<string, string>([
    ['devoirs', msg('Devoir(s) à faire')],
    ['visites_infirmerie', msg('Visite(s) à l\'infirmerie')],
    ['messages_non_lu', msg('Message(s) non lu')],
    ['absences_et_retards', msg('Absence(s) et retard(s)')],
    ['punitions_et_sanctions', msg('Punition(s) et sanction(s)')],
  ])

  render(): TemplateResult {
    return html`
    <div class="title-wrapper"><h2>${msg('Résumé de Pronote (7 derniers jours)')}</h2>
    <a class="btn-tertiary small" href="${this.urlRedirect}" rel=“noopener noreferrer”>
          ${msg('accéder au récapitulatif')}
              ${getIconWithStyle(faArrowRight, undefined, { icon: true })}
        </a>
      </div>

    <div id="summary-wrapper">
        ${this.content()}
      <div class="redirect mobile-only" >
        <a class="btn-tertiary small" href="${this.urlRedirect}" rel=“noopener noreferrer”>
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

  parentContent(): TemplateResult[] {
    const elements: TemplateResult[] = []

    if (this.summaries?.size === 1) {
      elements.push(html`<div>${this.studentContent(this.summaries.keys().next().value)}</div>`)
      return elements
    }

    type Entry = [string, SummaryElement[]]
    const entries: Entry[] = [
      ...(this.summaries ?? new Map<string, SummaryElement[]>()),
    ]

    elements.push(html`<div class="tab-btn-wrapper">
      ${repeat<Entry>(
        entries,
        ([key]) => key,
        ([key, _value], index): TemplateResult => {
          return html`
      <button
       id="${this.tabPannelHandler.getButtonId(index)}"
       role="tab"
       aria-selected=${this.tabPannelHandler.getAriaSelected(index)}
       aria-controls="${this.tabPannelHandler.getAriaControl(index)}"
       @keydown="${this.tabPannelHandler.onKeydown}"
       @click="${() => this.tabPannelHandler.setSelected(index)}"
       tabindex="${this.tabPannelHandler.getTabIndex(index)}"
       ${ref((el: Element | undefined) => {
          if (el instanceof HTMLButtonElement) {
            this.tabPannelHandler.addButton(el, index)
          }
        })}
       class="${this.tabPannelHandler.getAriaSelected(index) ? 'active tag' : 'tag'}"
       >
        ${key.replace(/\$.+/, '')}
      </button>
    `
        },
      ) as unknown as TemplateResult}
    </div>`)

    elements.push(html`
      <div>
        ${repeat<Entry>(
          entries,
          ([key]) => key,
          ([key, _value], index): TemplateResult => {
            return html`
      <div
      id="${this.tabPannelHandler.getPanelId(index)}"
      role="tabpanel"
      tabindex="${this.tabPannelHandler.getTabIndex(index)}"
      class="${!this.tabPannelHandler.getAriaSelected(index) ? 'is-hidden tabpanel' : 'tabpanel'}"
      aria-labelledby="${this.tabPannelHandler.getButtonId(index)}"

       >
        ${this.studentContent(key)}
      </div>
    `
          },
        ) as unknown as TemplateResult}
      </div>`)
    return elements
  }

  studentContent(key: string = 'default'): TemplateResult[] {
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
                ${this.conversionMap.get(summaryElement.description)}
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
