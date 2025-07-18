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
import type { Section } from '../../types/SectionType.ts'
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
  manage: boolean = false

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
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

  toggleManage(save: boolean = false): void {
    if (!this.manage) {
      this.tmpData = this.data ? [...this.data] : undefined
    }
    else {
      if (save)
        this.data = this.tmpData ? [...this.tmpData] : undefined
      this.tmpData = undefined
    }
    this.manage = !this.manage
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
    return this.data
      ? html`
          <div class="grow-1"></div>
          ${
            this.manage
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
            ${!this.manage ? msg(str`Gérer`) : msg(str`Enregistrer`)}
            ${getIcon(!this.manage ? faGear : faFloppyDisk)}
          </button>
        `
      : nothing
  }

  itemTemplate(sectionId: string, item: Item): TemplateResult {
    const actionTemplate: TemplateResult | typeof nothing = this.manage
      ? html`
          <div class="actions">
            <div class="action-delete">
              <button
                aria-label="${msg(str`Supprimer le favori`)}"
                @click="${() => this.deleteItem(sectionId, item)}"
              >
                ${getIcon(faTimes)}
              </button>
            </div>
            <div class="action-back">
              <button
                aria-label="${msg(str`Réordonner vers la gauche`)}"
                @click="${() => this.moveItem(sectionId, item, '-1')}"
              >
                ${getIcon(faArrowLeft)}
              </button>
            </div>
            <div class="grow-1"></div>
            <div class="action-next">
              <button
                aria-label="${msg(str`Réordonner vers la droite`)}"
                @click="${() => this.moveItem(sectionId, item, '+1')}"
              >
                ${getIcon(faArrowRight)}
              </button>
            </div>
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
            tabindex="${this.manage ? -1 : nothing as any as number}"
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
              !this.manage ? this.data ?? [] : this.tmpData ?? [],
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
                        item => this.itemTemplate(section.id, item),
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
