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
import { library } from '@fortawesome/fontawesome-svg-core'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

const tagName = componentName('search')

@localized()
@customElement(tagName)
export class ReciaSearch extends LitElement {
  constructor() {
    super()
    library.add(
    )
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  render(): TemplateResult {
    return html`
      <div class="search">
        <div class="search-field">
          <div class="start">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <div class="middle">
            <input type="text" placeholder="Rechercher un service" title="Rechercher un service">
          </div>
          <div class="end">
            <button class="btn-tertiary circle" aria-label="Effacer la recherche" style="display: none;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        <ul class="search-results" style="display: none;">
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
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaSearch
  }
}
