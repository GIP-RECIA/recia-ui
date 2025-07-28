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

import type { PropertyValues, TemplateResult } from 'lit'
import type { Ref } from 'lit/directives/ref.js'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { debounce } from 'lodash-es'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

@localized()
export class ReciaSearch extends LitElement {
  @property({ type: Boolean, attribute: 'open' })
  isOpen: boolean = false

  @state()
  isExpanded: boolean = false

  private inputRef: Ref<HTMLInputElement> = createRef()

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('keyup', this.handleKeyPress.bind(this))
    window.addEventListener('keyup', this.handleOutsideEvents.bind(this))
    window.addEventListener('click', this.handleOutsideEvents.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keyup', this.handleKeyPress.bind(this))
    window.removeEventListener('keyup', this.handleOutsideEvents.bind(this))
    window.removeEventListener('click', this.handleOutsideEvents.bind(this))
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('isOpen') && _changedProperties.get('isOpen') === false) {
      this.inputRef.value?.focus()
    }
    return true
  }

  emitEvent(detail: { open: boolean, mask: boolean }): void {
    this.dispatchEvent(new CustomEvent('event', { detail }))
  }

  close(_: Event | undefined = undefined): void {
    const input = this.inputRef.value
    if (!input)
      return

    this.isExpanded = false
    input.value = ''
    this.emitEvent({ open: false, mask: false })
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.preventDefault()
      this.close()
    }
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    if (
      this.isOpen
      && e.target instanceof HTMLElement
      && !(this.contains(e.target) || e.composedPath().includes(this))
    ) {
      this.close()
    }
  }

  handleSearch = debounce((_: Event) => {
    const value = this.inputRef.value?.value ?? ''
    if (value.length < 3) {
      this.isExpanded = false
      this.emitEvent({ open: true, mask: false })
      return
    }

    this.isExpanded = true
    this.emitEvent({ open: true, mask: true })
  }, 300)

  clearSearch(_: Event | undefined = undefined) {
    const input = this.inputRef.value
    if (!input)
      return

    this.isExpanded = false
    input.value = ''
    this.emitEvent({ open: true, mask: false })
    input.focus()
  }

  render(): TemplateResult {
    return html`
      <div class="search-container">
        <div class="search">
          <div class="search-field">
            <div class="start">
              ${getIcon(faMagnifyingGlass)}
            </div>
            <div class="middle">
              <input
                ${ref(this.inputRef)}
                type="text"
                placeholder="${msg(str`Rechercher un service`)}"
                title="${msg(str`Rechercher un service`)}"
                @input="${(e: Event) => this.handleSearch(e)}"
              >
            </div>
            <div class="end">
              <button
                class="btn-tertiary circle"
                aria-label="${msg(str`Effacer la recherche`)}"
                style="${styleMap({
                  display: this.isExpanded ? undefined : 'none',
                })}"
                @click="${this.clearSearch}"
              >
                ${getIcon(faXmark)}
              </button>
            </div>
          </div>
          <ul
            class="search-results"
            style="${styleMap({
              display: this.isExpanded ? undefined : 'none',
            })}"
          >
            <li>
              <div class="section-name">
                <span>Services</span>
              </div>
              <ul>
                <li>
                  <a href="#">
                    <header>
                      <span class="result-tag collaboratif">Espace collaboratif</span><span class="result-title">Espaces Nextcloud</span>
                    </header>
                    <span>Espaces de <strong>stockage</strong> cloud de l'ENT</span>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div class="section-name">
                <span>Médiacentre</span>
              </div>
              <ul>
                <li>
                  <a href="#">
                    <header>
                      <span class="result-title">Apprendre tous les secrets de Nextcloud</span>
                    </header>
                    <span>Les espaces de <strong>stockage</strong> Nextcloud offrent bien plus de fonctionnalités que vous ne le pensiez : ...</span>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div class="section-name">
                <span>Actualités</span>
              </div>
              <ul>
                <li>
                  <a href="#">
                    <header>
                      <span class="result-tag">Collectivités</span>
                      <span class="result-title">Espaces de <strong>stockage</strong> Nextcloud inaccessibles du 13/04 au 15/04</span>
                    </header>
                    <span>Ce week-end, les espaces de <strong>stockage</strong> cloud de l'ENT subiront une interruption de maintenance l...</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <header>
                      <span class="result-tag">Etablissement</span>
                      <span class="result-title">Attention aux piratage des espaces de <strong>stockage</strong></span>
                    </header>
                    <span>Depuis le début de l'année scolaire, plus d'une dizaine de comptes étudiants ont été piratés, résul...</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('search')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaSearch)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaSearch
  }
}
