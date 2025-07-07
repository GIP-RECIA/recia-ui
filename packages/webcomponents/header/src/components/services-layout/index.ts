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

const tagName = componentName('services-layout')

@localized()
@customElement(tagName)
export class ReciaServicesLayout extends LitElement {
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
      <div id="services-layout" class="services-layout" style="display: none;">
        <div class="container page-layout">
          <header>
            <div class="heading">
              <button class="btn-tertiary circle"><i class="fa-solid fa-arrow-left"></i></button>
              <h1>Toutes les services</h1>
            </div>
            <div class="sort">
              <label for="services-sort">Trier par :</label>
              <select name="" id="services-sort">
                <button>
                  <selectedcontent></selectedcontent>
                </button>
                <option value="pop-up">Popularité<i class="fa-solid fa-arrow-up"></i></option>
                <option value="pop-down">Popularité<i class="fa-solid fa-arrow-down"></i></option>
                <option value="pop-up">Alphabétique<i class="fa-solid fa-arrow-up"></i></option>
                <option value="pop-down">Alphabétique<i class="fa-solid fa-arrow-down"></i></option>
              </select>
            </div>
          </header>
          <div class="filters">
            <header>
              <button aria-expanded="false" aria-controls="services-filters">
                <span class="heading">Filtres</span>
                <div class="grow-1"></div>
                <i class="folded-indicator fa-solid fa-chevron-down"></i>
              </button>
              <span class="heading">Filtres</span>
            </header>
            <ul id="services-filters" class="menu" style="display: none;">
              <li>
                <ul>
                  <li>
                    <button class="tag active">Tous les services</button>
                  </li>
                  <li>
                    <button class="tag">Nouveautés</button>
                  </li>
                  <li>
                    <button class="tag">Collaboratif</button>
                  </li>
                  <li>
                    <button class="tag">Apprentissage</button>
                  </li>
                  <li>
                    <button class="tag">Communication</button>
                  </li>
                  <li>
                    <button class="tag">Documentation</button>
                  </li>
                  <li>
                    <button class="tag">Vie scolaire</button>
                  </li>
                  <li>
                    <button class="tag">Paramètres</button>
                  </li>
                  <li>
                    <button class="tag">Orientation</button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <ul>
            <li>
              <div class="service collaboratif">
                <div class="new">
                  <span class="new">nouveau</span>
                </div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#nextcloud"></use>
                </svg>
                <a href="#" class="name">
                  <h3>Espaces Nextcloud</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Espace collaboratif</span>
                <div class="favorite">
                  <button aria-label="Retirer des favoris">
                    <i class="fa-solid fa-star marked"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service communication">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#actualites"></use>
                </svg>
                <a href="#" class="name">
                  <h3>Actualités</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Communication</span>
                <div class="favorite">
                  <button aria-label="Ajouter aux favoris">
                    <i class="fa-regular fa-star"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service apprentissage">
                <div class="new">
                  <span class="new">nouveau</span>
                </div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#carte-mentale"></use>
                </svg>
                <a href="./service.html?service=/wisemapping" class="name">
                  <h3>Carte mentale</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Apprentissage</span>
                <div class="favorite">
                  <button aria-label="Retirer des favoris">
                    <i class="fa-solid fa-star marked"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service apprentissage">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#capytale"></use>
                </svg>
                <a href="#" class="name">
                  <h3>Capytale</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Apprentissage</span>
                <div class="favorite">
                  <button aria-label="Retirer des favoris">
                    <i class="fa-solid fa-star marked"></i>
                  </button>
                </div>
                <button class="more">En savoir plus</button>
              </div>
            </li>
            <li>
              <div class="service communication">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#mail"></use>
                </svg>
                <a href="#" class="name">
                  <h3>Messagerie</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Communication</span>
                <div class="favorite">
                  <button aria-label="Ajouter aux favoris">
                    <i class="fa-regular fa-star"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service documentation">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#POD"></use>
                </svg>
                <a href="./service.html?service=/POD" class="name">
                  <h3>Plateforme vidéo</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Documentation</span>
                <div class="favorite">
                  <button aria-label="Retirer des favoris">
                    <i class="fa-solid fa-star marked"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service documentation">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#mediacentre"></use>
                </svg>
                <a href="#" class="name">
                  <h3>MédiaCentre</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Documentation</span>
                <div class="favorite">
                  <button aria-label="Ajouter aux favoris">
                    <i class="fa-regular fa-star"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service orientation">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#orientation"></use>
                </svg>
                <a href="#" class="name">
                  <h3>Kiosque de l'orientation</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Orientation</span>
                <div class="favorite">
                  <button aria-label="Ajouter aux favoris">
                    <i class="fa-regular fa-star"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service parametres">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#MCE"></use>
                </svg>
                <a href="./service.html?service=/MCE" class="name">
                  <h3>Mon compte ENT</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Paramètres</span>
                <div class="favorite">
                  <button aria-label="Ajouter aux favoris">
                    <i class="fa-regular fa-star"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service vie-scolaire">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#espace-vie-scolaire"></use>
                </svg>
                <a href="#" class="name">
                  <h3>Menus du restaurant scolaire</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Vie scolaire</span>
                <div class="favorite">
                  <button aria-label="Ajouter aux favoris">
                    <i class="fa-regular fa-star"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service orientation">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#orientation"></use>
                </svg>
                <a href="#" class="name">
                  <h3>Orientation</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Orientation</span>
                <div class="favorite">
                  <button aria-label="Ajouter aux favoris">
                    <i class="fa-regular fa-star"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service parametres">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#"></use>
                </svg>
                <a href="#" class="name">
                  <h3>Aide du portail ENT</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Paramètres</span>
                <div class="favorite">
                  <button aria-label="Ajouter aux favoris">
                    <i class="fa-regular fa-star"></i>
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div class="service documentation">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="./spritemap.svg#documentations"></use>
                </svg>
                <a href="#" class="name">
                  <h3>Documents</h3>
                  <span aria-hidden="true"></span>
                </a>
                <span class="category">Documentation</span>
                <div class="favorite">
                  <button aria-label="Ajouter aux favoris">
                    <i class="fa-regular fa-star"></i>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaServicesLayout
  }
}
