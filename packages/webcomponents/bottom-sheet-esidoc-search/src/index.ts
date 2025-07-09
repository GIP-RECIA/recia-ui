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

import type { ReciaBottomSheet } from 'bottom-sheet/src'
import type { TemplateResult } from 'lit'
import type { Ref } from 'lit/directives/ref.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { isArray } from 'lodash'
import { querySelectorDeep } from 'query-selector-shadow-dom'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'

import styles from './style.scss?inline'
import { getIcon } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'
import { getToken } from './utils/soffitUtils.ts'
import 'bottom-sheet/dist/r-bottom-sheet.js'
import 'regenerator-runtime/runtime.js'

const tagName = componentName(name)

export enum SearchMode {
  Pertinence = 'pertinence',
  Parution = 'date de parution',
}

@localized()
@customElement(tagName)
export class ReciaBottomSheetEsidocSearch extends LitElement {
  constructor() {
    super()
    library.add(
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  @property({ type: String })
  eventName: string = ''

  @property({ type: String })
  soffitUri: string = ''

  @property({ type: String })
  escouaicouranttest: string = ''

  @property({ type: Boolean })
  istest: boolean = false

  escouaicourant: string = ''

  @property({ type: String })
  esidocUriRecherche = ''

  private bottomSheetRef: Ref<ReciaBottomSheet> = createRef()

  connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener(this.eventName, this.handleEvent.bind(this))
    this.getESCOUAI()
  }

  async getESCOUAI() {
    const token = await getToken(this.soffitUri)
    const decoded = token.decoded
    const escouaicourantAny: any = decoded.ESCOUAICourant
    if (isArray(escouaicourantAny)) {
      const escouaicourantArray: Array<any> = escouaicourantAny
      const escouaicourant = escouaicourantArray[0]
      this.escouaicourant = escouaicourant
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    window.removeEventListener(this.eventName, this.handleEvent.bind(this))
  }

  open(): void {
    this.bottomSheetRef.value!.open()
  }

  close(): void {
    this.bottomSheetRef.value!.close()
  }

  handleEvent(e: Event): void {
    e.preventDefault()
    e.stopImmediatePropagation()
    this.open()
  }

  async search(): Promise<void> {
    const inputvalue: string = querySelectorDeep('#esidoc-search-input').value
    const uri: string = this.esidocUriRecherche.replace('{ESCOUAICourant}', this.istest ? this.escouaicouranttest : this.escouaicourant) + encodeURIComponent(inputvalue)
    window.open(uri, '_blank', 'noreferrer')
  }

  searchBar(): TemplateResult {
    return html`
    <div id="search-field">
    <input id="esidoc-search-input" type="text" placeholder="Nom du livre"
    }}" ></input><button type="button" @click="${() => this.search()}">${getIcon(faArrowUpRightFromSquare)}</button>
    </div>
    `
  }

  render(): TemplateResult {
    return html`
      <r-bottom-sheet
      ${ref(this.bottomSheetRef)}
      >
      <section class="slot-wrapper">
        <h2>Rechercher un document e-sidoc</h2>

      <form @submit="${(e: Event) => { e.preventDefault(); e.stopPropagation(); this.search() }}">
        ${this.searchBar()}
      </form>
      </section>
      </r-bottom-sheet>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaBottomSheetEsidocSearch
  }
}
