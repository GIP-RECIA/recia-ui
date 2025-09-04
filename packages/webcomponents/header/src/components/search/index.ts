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
import type { SearchSection, Service } from '../../types/index.ts'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { debounce } from 'lodash-es'
import { matchSorter } from 'match-sorter'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { $searchResults, updateServices } from '../../stores/index.ts'
import { getCategoryTranslation } from '../../utils/categoryUtils.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import { highlight } from '../../utils/stringUtils.ts'
import styles from './style.scss?inline'

@localized()
@useStores($searchResults)
export class ReciaSearch extends LitElement {
  @property({ type: Boolean, attribute: 'open' })
  isOpen: boolean = false

  @state()
  isExpanded: boolean = false

  @state()
  search: string = ''

  private inputRef: Ref<HTMLInputElement> = createRef()

  private parentNodeElement: ParentNode | null | undefined

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

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.parentNodeElement = this.shadowRoot?.host.parentNode?.parentNode
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('isOpen') && _changedProperties.get('isOpen') === false) {
      this.inputRef.value?.focus()
    }
    return true
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.preventDefault()
      this.close()
    }
  }

  handleOutsideEvents(e: KeyboardEvent | MouseEvent): void {
    const catchEvents: Array<EventTarget> = [
      this.parentNodeElement?.querySelector('.search-button') as EventTarget,
      this.parentNodeElement?.querySelector('r-user-menu')?.shadowRoot?.querySelector('button#search') as EventTarget,
    ]
    if (
      this.isOpen
      && e.target instanceof HTMLElement
      && !(
        this.contains(e.target)
        || e.composedPath().includes(this)
        || catchEvents?.some(event => e.composedPath().includes(event))
      )
    ) {
      this.close()
    }
  }

  emitEvent(detail: {
    open?: boolean
    mask?: boolean
  }): void {
    this.dispatchEvent(new CustomEvent('event', { detail }))
  }

  close(_: Event | undefined = undefined): void {
    const input = this.inputRef.value
    if (!input)
      return

    this.clear()
    this.emitEvent({ open: false })
    // TODO : Need to reset focus
  }

  handleInput(e: Event): void {
    if (!this.isOpen)
      this.emitEvent({ open: true })
    this.handleSearch(e)
  }

  handleSearch = debounce((_: Event) => {
    const value = this.inputRef.value?.value.trim() ?? ''
    if (value.length < 3) {
      this.search = ''
      this.hideResults()
      return
    }

    updateServices()
    this.search = value
    this.showResults()
  }, 500)

  showResults(): void {
    if (this.isExpanded)
      return

    document.documentElement.classList.add('search-results')
    this.isExpanded = true
    this.emitEvent({ mask: true })
  }

  hideResults(): void {
    if (!this.isExpanded)
      return

    document.documentElement.classList.remove('search-results')
    this.isExpanded = false
    this.emitEvent({ mask: false })
  }

  clear(_: Event | undefined = undefined, resetFocus: boolean = false): void {
    const input = this.inputRef.value
    if (!input)
      return

    input.value = ''
    this.hideResults()
    if (resetFocus)
      input.focus()
  }

  filteredResults(): Array<SearchSection> {
    let results = $searchResults.get() ?? []
    if (this.search !== '') {
      results = results.map((section) => {
        const items = matchSorter(
          section.items,
          this.search,
          {
            keys: ['name', 'description', 'keywords'],
            threshold: matchSorter.rankings.ACRONYM,
          },
        )

        return { ...section, items }
      })
    }

    return results
  }

  handleLinkClick(e: Event, fname: string | undefined): void {
    document.dispatchEvent(new CustomEvent('search-event', {
      detail: {
        event: e,
        fname,
      },
      bubbles: true,
      composed: true,
    }))
  }

  sectionTemplate(section: SearchSection): TemplateResult | typeof nothing {
    if (!section.loading && section.items.length === 0)
      return nothing

    return html`
      <li id="${section.id}">
        <header>
          <span>${section.name}</span>
        </header>
        <ul>
          ${
            !section.loading
              ? repeat(
                  section.items,
                  item => item.id,
                  item => this.itemTemplate(item),
                )
              : map(
                  range(section.loadingItems ?? 2),
                  () => html`<li class="skeleton"></li>`,
                )
          }
        </ul>
      </li>
    `
  }

  itemTemplate(item: Service): TemplateResult {
    return html`
        <li>
          <a
            href="${item.link.href}"
            target="${item.link.target ?? nothing}"
            rel="${item.link.rel ?? nothing}"
            @click="${(e: Event) => this.handleLinkClick(e, item.fname)}"
          >
            <div>
              <header>
                ${
                  item.category
                    ? html`
                        <span class="result-tag ${item.category}">
                          ${getCategoryTranslation(item.category)}
                        </span>
                      `
                    : nothing
                }
                <span class="result-title">
                  ${highlight(item.name, this.search)}
                </span>
              </header>
              ${
                item.description
                  ? html`<span>${highlight(item.description, this.search)}</span>`
                  : nothing
              }
            </div>
          </a>
        </li>
      `
  }

  render(): TemplateResult {
    const results = this.filteredResults()

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
                @input="${this.handleInput}"
              >
            </div>
            <div class="end">
              <button
                class="btn-tertiary circle"
                aria-label="${msg(str`Effacer la recherche`)}"
                style="${styleMap({
                  visibility: this.isExpanded ? undefined : 'hidden',
                })}"
                ?disabled="${!this.isExpanded}"
                @click="${(e: Event) => this.clear(e, true)}"
              >
                ${getIcon(faXmark)}
              </button>
            </div>
          </div>
          <div
            class="search-results"
            style="${styleMap({
              display: this.isExpanded ? undefined : 'none',
            })}"
          >
            ${
              results.some(section => section.items.length > 0 || section.loading)
                ? html`
                    <ul>
                      ${
                        repeat(
                          results,
                          section => section.id,
                          section => this.sectionTemplate(section),
                        )
                      }
                    </ul>
                  `
                : html`<div class="empty">${msg(str`Aucun résultats`)}</div>`
            }
          </div>
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
