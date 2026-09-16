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

import type { Link } from 'common/types/index.ts'
import type { PropertyValues, TemplateResult } from 'lit'
import type { UserSummary } from '../../types/pronoteTypes.ts'
import {
  faArrowRight,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str } from '@lit/localize'
import { componentName } from 'common/config.ts'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { repeat } from 'lit/directives/repeat.js'
import { name } from '../../../package.json'
import langHelper from '../../helpers/langHelper.ts'
import PronoteService from '../../services/pronoteService.ts'
import { LoadingState } from '../../types/loadingStateTypes.ts'
import { SummaryItem } from '../../types/pronoteTypes.ts'
import { getIcon, getIconWithStyle } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import 'tabs'

@localized()
export class ReciaPronoteSummary extends LitElement {
  @property({ type: Object, attribute: 'detail-link' })
  detailLink?: Link

  @property({ type: String, attribute: 'pronote-api-url' })
  pronoteApiUrl?: string

  @state()
  loadingState: LoadingState = LoadingState.UNLOADED

  summary?: UserSummary[]

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
  }

  static i18n(count: number): Record<SummaryItem, string> {
    const plurial: boolean = count <= 1

    return {
      [SummaryItem.AbsencesEtRetards]: plurial
        ? msg(str`Absence ou retard`)
        : msg(str`Absences ou retards`),
      [SummaryItem.Devoirs]: plurial
        ? msg(str`Devoir à faire`)
        : msg(str`Devoirs à faire`),
      [SummaryItem.MessagesNonLu]: plurial
        ? msg(str`Message non lu`)
        : msg(str`Messages non lus`),
      [SummaryItem.PunitionsEtSanctions]: plurial
        ? msg(str`Punition ou sanction`)
        : msg(str`Punitions ou sanctions`),
      [SummaryItem.VisitesInfirmerie]: plurial
        ? msg(str`Visite à l'infirmerie`)
        : msg(str`Visites à l'infirmerie`),
      [SummaryItem.InformationsNonLues]: plurial
        ? msg(str`Information non lu`)
        : msg(str`Informations non lus`),
      [SummaryItem.EvaluationsDeCompetences]: plurial
        ? msg(str`Évaluation en cours`)
        : msg(str`Évaluations en cours`),
    }
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('pronoteApiUrl')) {
      this._getSummary()
      if (_changedProperties.size === 1)
        return false
    }
    return true
  }

  private async _getSummary(): Promise<void> {
    if (!this.pronoteApiUrl) {
      this.loadingState = LoadingState.ERROR

      return
    }

    this.loadingState = LoadingState.LOADING
    this.summary = await PronoteService.getSummary(this.pronoteApiUrl)
    this.loadingState = this.summary ? LoadingState.LOADED : LoadingState.ERROR
  }

  contentTemplate(): TemplateResult | typeof nothing {
    switch (this.loadingState) {
      case LoadingState.ERROR:
        return this.errorTemplate()

      case LoadingState.LOADED:
        return this.tabsTemplate()

      case LoadingState.UNLOADED:
      case LoadingState.LOADING:
      default:
        return this.emptyList('skeleton')
    }
  }

  emptyList(type: 'placeholder' | 'skeleton'): TemplateResult {
    return html`
        <ul inert>
          ${
            map(
              range(Object.entries(SummaryItem).length),
              () => html`
                  <li class="${type}">
                    <span>0</span>
                    <span>placeholder placeholder</span>
                  </li>
                `,
            )
          }
        </ul>
      `
  }

  errorTemplate(): TemplateResult {
    return html`
        ${this.emptyList('placeholder')}
        <div class="error">
          ${getIconWithStyle(faTriangleExclamation, undefined, { icon: true })}
          <span class="text">
            ${msg(str`Erreur`)}
            <span class="large">${msg(str`Impossible de charger le contenu`)}</span>
          </span>
        </div>
      `
  }

  tabsTemplate(): TemplateResult | typeof nothing {
    const tabPrefix = 'pronote-summary'
    const summary = this.summary ?? []

    if (summary.length === 1)
      return this.tilesTemplate(summary[0].slug, summary[0].items)

    const tabs: string[] = summary.map(({ displayName }) => displayName)
      .filter(item => item !== undefined)

    return html`
        <r-tablist
          id-prefix="${tabPrefix}"
          .tabs='${tabs}'
          active-tab="0"
          switch-tabpanel
        >
        </r-tablist>
        ${
          repeat(
            summary,
            ({ slug }) => slug,
            ({ slug, items }, index) => html`
                <r-tabpanel
                  id-prefix="${tabPrefix}"
                  index="${index}"
                  ?active="${index === 0}"
                >
                  ${this.tilesTemplate(slug, items)}
                </r-tabpanel>
              `,
          )
        }
      `
  }

  tilesTemplate(
    prefix: string,
    items: Record<SummaryItem, number>,
  ): TemplateResult | typeof nothing {
    return html`
        <ul>
          ${
            repeat(
              Object.entries(items),
              ([key, _]) => `${prefix}-${key}`,
              ([key, value]) => html`
                  <li>
                    <span>${value}</span>
                    <span>${ReciaPronoteSummary.i18n(value)[key as SummaryItem]}</span>
                  </li>
                `,
            )
          }
        </ul>
      `
  }

  render(): TemplateResult {
    const detailLink = (): TemplateResult | typeof nothing => this.detailLink
      ? html`
            <a
              href="${this.detailLink.href}"
              target="${this.detailLink.target ?? nothing}"
              rel="${this.detailLink.rel ?? nothing}"
              class="btn-tertiary"
              title="${ifDefined(this.detailLink.name)}"
            >
              ${msg(str`voir plus d'informations`)}
              ${getIcon(faArrowRight)}
            </a>
          `
      : nothing

    return html`
        <div class="pronote-summary">
          <div class="header">
            <h2>
              ${msg(str`Résumé Pronote`)}
              <span>${msg(str`7 derniers jours`)}</span>
            </h2>
            <div class="grow-1"></div>
            ${detailLink()}
          </div>

          <div class="content">
            ${this.contentTemplate()}
          </div>

          ${
            this.detailLink
              ? html`
                  <div class="footer">
                    <div class="grow-1"></div>
                    ${detailLink()}
                  </div>
                `
              : nothing
          }
        </div>
      `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(`${name}-summary`)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaPronoteSummary)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaPronoteSummary
  }
}
