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
import type { Item } from './types/ItemType.ts'
import type { Section } from './types/SectionType.ts'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { isEqual } from 'lodash-es'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { getIconWithStyle } from './utils/fontawesomeUtils.ts'
import { setLocale } from './utils/localizationUtils.ts'

@localized()
export class ReciaFilters extends LitElement {
  @property({ type: Array })
  data: Array<Section> | null = null

  @property({ type: Boolean })
  loading: boolean = false

  @property({ type: Number, attribute: 'loding-sections' })
  loadingSections?: number

  @property({ type: Number, attribute: 'loding-sections-items' })
  loadingSectionsItems?: number

  @state()
  checked: Map<string, Array<string>> = new Map()

  @state()
  activeFilters?: number

  @state()
  isExpanded: boolean = false

  lastActiveFilters: { id: string, checked: string[] }[] = []

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('data')) {
      this.data?.forEach((section) => {
        let checkedItems = section.items.filter(item => item.checked)
        if (section.type === 'radio')
          checkedItems = checkedItems[0] ? [checkedItems[0]] : []
        const checked = checkedItems.length > 0 ? checkedItems.map(item => item.key) : [section.items[0].key]

        this.checked.set(section.id, checked)
        this.shadowRoot?.querySelectorAll('form').forEach(form => form.reset())
        this.updateActiveFilters()
      })
    }
    return true
  }

  toggle(_: Event): void {
    this.isExpanded = !this.isExpanded
  }

  updateActiveFilters(): void {
    const activeFilters = [...this.checked.entries()].map(([key, value]) => {
      const firstKey = this.data?.find(section => section.id === key)?.items[0].key

      return { id: key, checked: value.filter(it => it !== firstKey) }
    })
    if (!isEqual(this.lastActiveFilters, activeFilters)) {
      this.lastActiveFilters = activeFilters
      this.dispatchEvent(new CustomEvent('update-filters', { detail: { activeFilters } }))
      this.activeFilters = activeFilters.map(item => item.checked).flat().length
    }
  }

  handleFormChange(e: Event, section: Section): void {
    const target = e.target as HTMLInputElement

    if (section.type === 'radio') {
      this.checked.set(section.id, [target.value])
      this.updateActiveFilters()
      return
    }

    const form = target.closest('form')!
    const checkboxes = [...form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')]

    const firstCb = checkboxes[0]
    const otherCbs = checkboxes.slice(1)
    const isFirst = target === firstCb

    let newCheckedValues: string[] = []

    if (checkboxes.every(cb => !cb.checked)) { // No one checked
      firstCb.checked = true
      newCheckedValues = [section.items[0].key]
    }
    else if (otherCbs.every(cb => cb.checked)) { // All others checked
      firstCb.checked = true
      otherCbs.forEach(cb => cb.checked = false)
      newCheckedValues = [section.items[0].key]
    }
    else if (isFirst && otherCbs.some(cb => cb.checked)) { // First triggerd and other checked
      otherCbs.forEach(cb => cb.checked = false)
      newCheckedValues = [section.items[0].key]
    }
    else if (!isFirst) { // Other triggered
      firstCb.checked = false
      const currentChecked = this.checked.get(section.id)?.filter(k => k !== section.items[0].key) ?? []
      const index = currentChecked.indexOf(target.value)

      if (target.checked) {
        if (index === -1)
          currentChecked.push(target.value)
      }
      else {
        if (index > -1)
          currentChecked.splice(index, 1)
      }

      newCheckedValues = currentChecked
    }

    this.checked.set(section.id, newCheckedValues)
    this.updateActiveFilters()
  }

  itemTemplate(section: Section, item: Item): TemplateResult {
    const { key, value } = item
    const inputId = section.type === 'radio' ? `${section.id}-${key}` : key

    return html`
        <li>
          <input
            id="${inputId}"
            type="${section.type}"
            name="${section.type === 'radio' ? section.id : key}"
            value="${key}"
            class="tag"
            ?checked="${this.checked.get(section.id)?.includes(key) ?? false}"
          >
          <label for="${inputId}">${value}</label>
        </li>
      `
  }

  skeletonTemplate(): TemplateResult {
    return html`
        <div class="filters" inert>
          <header>
            <button>
               <span class="heading skeleton"></span>
            </button>
            <span class="heading skeleton"></span>
          </header>
          <ul class="menu" style="display: none;">
            ${
              map(
                range(this.loadingSections ?? 1),
                () => html`
                    <li>
                      ${
                        (this.loadingSections ?? 1) > 1
                          ? html`
                              <header>
                                <span class="skeleton"></span>
                              </header>
                            `
                          : nothing
                      }
                      <form>
                        <fieldset>
                          <legend class="sr-only"></legend>
                          <ul>
                            ${
                              map(
                                range(this.loadingSectionsItems ?? 6),
                                () => html`<li class="skeleton"></li>`,
                              )
                            }
                          </ul>
                        </fieldset>
                      </form>
                    </li>
                  `,
              )
            }
          </ul>
        </div>
      `
  }

  render(): TemplateResult {
    if (this.loading)
      return this.skeletonTemplate()

    return html`
      <div class="filters">
        <header>
          <button
            aria-expanded="${this.isExpanded}"
            aria-controls="filter-menu"
            @click="${this.toggle}"
          >
            <span class="heading">${msg(str`Filtres`)}</span>
            ${
              this.activeFilters && this.activeFilters > 0
                ? html`
                    <span class="badge">${this.activeFilters}</span>
                  `
                : nothing
            }
            <div class="grow-1"></div>
            ${getIconWithStyle(
                faChevronDown,
                { rotate: this.isExpanded ? '180deg' : undefined },
                { 'folded-indicator': true },
              )
            }
          </button>
          <span class="heading">${msg(str`Filtres`)}</span>
        </header>
        <ul
          id="filter-menu"
          class="menu"
          style="${styleMap({
            display: this.isExpanded ? undefined : 'none',
          })}"
        >
          ${
            repeat(
              this.data ?? [],
              section => section.id,
              section => html`
                <li>
                  ${
                    this.data && this.data.length > 1
                      ? html`
                          <header aria-hidden="true">
                            <span>${section.name}</span>
                          </header>
                        `
                      : nothing
                  }
                  <form @change="${(e: Event) => this.handleFormChange(e, section)}">
                    <fieldset>
                      <legend class="sr-only">${section.name}</legend>
                      <ul>
                        ${
                          repeat(
                            section.items,
                            item => item.key,
                            item => this.itemTemplate(section, item),
                          )
                        }
                      </ul>
                    </fieldset>
                  </form>
                </li>
              `,
            )
          }
        </ul>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(name)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaFilters)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaFilters
  }
}
