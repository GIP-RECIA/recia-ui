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
import type { Item } from '../../types/ItemType.ts'
import type { Section, UpdatedSection } from '../../types/SectionType.ts'
import {
  faArrowLeft,
  faArrowRight,
  faFloppyDisk,
  faGear,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../../../common/config.ts'
import { name } from '../../../package.json'
import langHelper from '../../helpers/langHelper.ts'
import { Category } from '../../types/CategoryType.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

@localized()
export class ReciaFavoriteLayout extends LitElement {
  @property({ type: Array })
  data?: Array<Section>

  @state()
  tmpData?: Array<Section>

  @state()
  isManage: boolean = false

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('reset', this.reset.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('reset', this.reset.bind(this))
  }

  static i18nCategory(): Record<Category, string> {
    return {
      [Category.documentation]: msg(str`Documentation`),
      [Category.collaboratif]: msg(str`Collaboratif`),
      [Category.apprentissage]: msg(str`Apprentissage`),
      [Category.vieScolaire]: msg(str`Vie scolaire`),
      [Category.orientation]: msg(str`Orientation`),
      [Category.parametres]: msg(str`Paramètres`),
      [Category.communication]: msg(str`Communication`),
    }
  }

  reset(_: Event) {
    this.isManage = false
    this.tmpData = undefined
  }

  toggleManage(save: boolean = false): void {
    if (!this.isManage) {
      this.tmpData = this.data ? [...this.data] : undefined
    }
    else {
      if (save)
        this.dispatchEvent(new CustomEvent('updated', { detail: { newValue: this.getDiffs() } }))
      this.tmpData = undefined
    }
    this.isManage = !this.isManage
  }

  getDiffs(): Array<UpdatedSection> | undefined {
    if (!this.data || !this.tmpData)
      return undefined

    const changes: Array<UpdatedSection> = []

    this.tmpData.forEach((newData) => {
      const oldData = this.data?.find(({ id }) => id === newData.id)

      const deleted = oldData?.items.filter(item => !newData.items.includes(item)) ?? []
      const oldDataItemsNoDeleted = oldData?.items.filter(item => newData.items.includes(item))
      const orderHasChanged = oldDataItemsNoDeleted?.some((item, index) => {
        return newData.items.findIndex(({ id }) => id === item.id) !== index
      }) ?? false

      changes.push({
        ...newData,
        deleted,
        orderHasChanged,
      })
    })

    return changes
  }

  deleteItem(sectionId: string, item: Item): void {
    this.tmpData = this.tmpData!.map((section) => {
      if (section.id !== sectionId)
        return section

      const items = section.items.filter(el => el !== item)

      return { ...section, items }
    })
  }

  moveItem(sectionId: string, item: Item, newPosition: '-1' | '+1'): void {
    this.tmpData = this.tmpData!.map((section) => {
      if (section.id !== sectionId)
        return section

      const index = section.items.indexOf(item)
      if (index === -1)
        return section

      const newIndex = index + Number(newPosition)

      if (newIndex < 0 || newIndex >= section.items.length)
        return section

      const items = [...section.items]

      const [movedItem] = items.splice(index, 1)
      items.splice(newIndex, 0, movedItem)

      return { ...section, items }
    })
  }

  manageTemplate(): TemplateResult | typeof nothing {
    return this.data && this.data.some(({ canDelete, canMove }) => canDelete || canMove)
      ? html`
          <div class="grow-1"></div>
          ${
            this.isManage
              ? html`
                  <button
                    class="btn-secondary small"
                    @click="${() => this.toggleManage()}"
                  >
                    ${msg(str`Annuler`)}${getIcon(faTimes)}
                  </button>
                `
              : nothing
          }
          <button
            class="btn-secondary small"
            @click="${() => this.toggleManage(true)}"
          >
            ${!this.isManage ? msg(str`Gérer`) : msg(str`Enregistrer`)}
            ${getIcon(!this.isManage ? faGear : faFloppyDisk)}
          </button>
        `
      : nothing
  }

  itemTemplate(section: Section, item: Item): TemplateResult {
    const { id, canDelete, canMove } = section
    const actionTemplate: TemplateResult | typeof nothing = this.isManage
      ? html`
          <div class="actions">
            ${
              canDelete
                ? html`
                    <div class="action-delete">
                      <button
                        aria-label="${msg(str`Supprimer le favori`)}"
                        @click="${() => this.deleteItem(id, item)}"
                      >
                        ${getIcon(faTimes)}
                      </button>
                    </div>
                  `
                : nothing
            }
            ${
              canMove
                ? html`
                    <div class="action-back">
                      <button
                        aria-label="${msg(str`Réordonner vers la gauche`)}"
                        @click="${() => this.moveItem(id, item, '-1')}"
                      >
                        ${getIcon(faArrowLeft)}
                      </button>
                    </div>
                    <div class="grow-1"></div>
                    <div class="action-next">
                      <button
                        aria-label="${msg(str`Réordonner vers la droite`)}"
                        @click="${() => this.moveItem(id, item, '+1')}"
                      >
                        ${getIcon(faArrowRight)}
                      </button>
                    </div>
                  `
                : nothing
            }
          </div>
        `
      : nothing

    return html`
      <li>
        <div class="favorite">
          ${actionTemplate}
          <svg class="icon" aria-hidden="true">
            <use href="${item.iconUrl}"></use>
          </svg>
          <a
            href="${item.link.href}"
            target="${item.link.target ?? nothing}"
            rel="${item.link.rel ?? nothing}"
            class="name"
            tabindex="${this.isManage ? -1 : nothing as any as number}"
          >
            <span>${item.name}</span>
            <span aria-hidden="true"></span>
          </a>
          ${
            item.category
              ? html`
                  <span class="tag-category ${item.category}">
                    ${ReciaFavoriteLayout.i18nCategory()[item.category]}
                  </span>
                `
              : nothing
          }
        </div>
      </li>
    `
  }

  render(): TemplateResult {
    return html`
      <div class="favorite-layout">
        <header>
          <h2>${msg(str`Vos favoris`)}</h2>
          ${this.manageTemplate()}
        </header>
        <ul>
          ${
            repeat(
              !this.isManage ? this.data ?? [] : this.tmpData ?? [],
              section => section.id,
              section => html`
                <li id="${section.id}">
                  <header>
                    <span>${section.name}</span>
                  </header>
                  <ul>
                    ${
                      repeat(
                        section.items,
                        item => item.id,
                        item => this.itemTemplate(section, item),
                      )
                    }
                  </ul>
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

const tagName = componentName(`${name}-layout`)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaFavoriteLayout)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaFavoriteLayout
  }
}
