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
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
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

  @state()
  selectedTabId: string = 'child-selector-id-0'

  errorMessage: string = msg('Impossible de charger le résumé')

  selectedTabIdPrefix: string = 'child-selector-id-'

  tabPannelPrefix = 'tabpanel-children-'

  buttonsRef: HTMLButtonElement[] = []

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

      if (response.ok) {
        const json = (await response.json()) as SummaryResponse

        this.summaries = new Map(Object.entries(json.data))
        this.summaryKey = this.summaries!.keys()!.next()!.value!
        this.isParent = json.profil === 'Parent'
        this.isError = false
      }
      else {
        this.isError = true
      }
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
    <h2>${msg('Résumé de Pronote')}</h2>
    <div id="summary-wrapper">
      <div  class="redirect">
        <a class="btn-tertiary small" href="${this.urlRedirect}" rel=“noopener noreferrer”>
          ${msg('Accéder au récapitulatif')}
              ${getIconWithStyle(faArrowRight, undefined, { icon: true })}
        </a>
      </div>
        ${this.content()}
      <div class="redirect mobile-only" >
        <a class="btn-tertiary small" href="${this.urlRedirect}" rel=“noopener noreferrer”>
          ${msg('Accéder au récapitulatif')}
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
    type Entry = [string, SummaryElement[]]

    const entries: Entry[] = [
      ...(this.summaries ?? new Map<string, SummaryElement[]>()),
    ]

    elements.push(html`<div>
      ${repeat<Entry>(
        entries,
        ([key]) => key,
        ([key, _value], index): TemplateResult => {
          const id: string = `child-selector-id-${index}`

          return html`
      <button
       id="${id}"
       role="tab"
       aria-selected=${this.selectedTabId === id}
       aria-controls="${this.tabPannelPrefix + index}"
       @keydown="${this.onKeydown}"
       @click="${() => this.setSelected(index)}"
       tabindex="${this.selectedTabId === id ? 0 : -1}"
       ${ref((el) => {
          if (el)
            this.buttonsRef[index] = el as HTMLButtonElement
        })}
       class="${this.selectedTabId === `child-selector-id-${index}` ? 'active tag' : 'tag'}"
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
            const idOfButton: string = `child-selector-id-${index}`
            const idPannel: string = `child-pannel-id-${index}`
            return html`
      <div
      id="${idPannel}"
      role="tabpanel"
      tabindex="${this.selectedTabId === idOfButton ? 0 : -1}"
      class="${this.selectedTabId !== idOfButton ? 'is-hidden' : ''}"
      aria-labelledby="${idOfButton}"

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
        <div class="cadre">
            ${repeat(summary, summaryElement => summaryElement.description, summaryElement =>
              html`
            <div class="case">
              <div class="numero">${summaryElement.count}</div>
              <div class="texte">
                ${this.conversionMap.get(summaryElement.description)}
              </div>
              <div class="numero mobile-only">${summaryElement.count}</div>
            </div>
            `)}
        </div>`,
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

  // TABS METHODS

  setSelected(index: number): void {
    this.selectedTabId = this.selectedTabIdPrefix + index
    this.buttonsRef[index]?.focus()
  }

  idToNumber(id: string): number {
    if (id.startsWith(this.selectedTabIdPrefix)) {
      const remaining: string = id.substring(this.selectedTabIdPrefix.length)
      const idNum: number = parseInt(remaining)
      return idNum
    }
    throw new Error('Invalid id')
  }

  numberToId(num: number): string {
    return this.selectedTabIdPrefix + num
  }

  onKeydown(event: KeyboardEvent) {
    let flag = false
    const idAsNum: number = this.idToNumber(this.selectedTabId)
    switch (event.key) {
      case 'ArrowLeft':
        this.selectedTabId = idAsNum === 0 ? this.numberToId(this.buttonsRef.length - 1) : this.numberToId(idAsNum - 1)
        flag = true
        break

      case 'ArrowRight':
        this.selectedTabId = idAsNum === this.buttonsRef.length - 1 ? this.numberToId(0) : this.numberToId(idAsNum + 1)
        flag = true
        break

      case 'Home':
        this.selectedTabId = this.numberToId(0)
        flag = true
        break

      case 'End':
        this.selectedTabId = this.numberToId(this.buttonsRef.length - 1)
        flag = true
        break

      default:
        break
    }

    this.buttonsRef[this.idToNumber(this.selectedTabId)]?.focus()

    if (flag) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  // END TABS METHODS

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
