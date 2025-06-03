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
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { setLocale } from './utils/localizationUtils.ts'
import 'widget/dist/r-widget.js'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaWidgetsWrapper extends LitElement {
  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  render(): TemplateResult {
    return html`
      <div class="widget">
        <header>
          <h2 class="sr-only">Accès rapides</h2>
        </header>
        <ul class="widget-tiles">
          <r-widget
            role="listitem"
            name="Favoris"
            link="#1"
            items='[
              {
                "name": "Carte mentale",
                "link": "#A"
              },
              {
                "name": "Capytale",
                "link": "#B"
              },
              {
                "name": "Espaces Nextcloud",
                "link": "#C"
              },
              {
                "name": "Platforme vidéo",
                "link": "#D"
              }
            ]'
          >
          </r-widget>
          <r-widget
            role="listitem"
            name="Médiacentre"
            subtitle="Consulté récement"
            link="/portail/p/Mediacentre"
            empty-text="Aucun favoris"
            empty-discover
          >
          </r-widget>
          <r-widget
            role="listitem"
            name="Documents"
            link="#3"
            empty-text="Aucun document"
          >
          </r-widget>
        </ul>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaWidgetsWrapper
  }
}
