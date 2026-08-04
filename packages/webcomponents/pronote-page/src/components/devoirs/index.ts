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
import type { DevoirDto } from '../../types/pronoteType'
import { localized, msg } from '@lit/localize'
import { componentName } from 'common/config.js'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { formatter, parseXsdDate } from '../../helpers/dateHelper'
import styles from '../../style.scss?inline'
import '../pronoteDiscoverableSection/index.ts'

@localized()
export class Devoirs extends LitElement {
  @property({ type: Array, attribute: 'devoir-dto-list' })
  devoirDtoList?: DevoirDto[]

  constructor() {
    super()
  }

  render(): TemplateResult {
    if (this.devoirDtoList === undefined || this.devoirDtoList === null) {
      return html`
       <h2 class="widescreen">${msg('Devoir')}</h2>
      <div class="h2-wrapper">
        <h2>${msg('Devoir')}</h2>
      </div>
      <p>${('Impossible de récupérer les informations relatives aux derniers devoirs reçus')}</p>
      `
    }
    return html`


    <r-pronote-discoverable-section
      display-title='${(this.devoirDtoList?.length ?? 0) < 2 ? msg('Devoir') : msg('Devoirs')}'
      content-classes='devoirs-content'
      count=${this.devoirDtoList?.length ?? 0}
    >
       ${
          repeat(this.devoirDtoList?.sort((a, b) => {
            if (a === undefined || a === null) {
              return 1
            }
            if (b === undefined || b === null) {
              return -1
            }
            if (a === b) {
              return 0
            }

            return a.date < b.date ? -1 : 1
          }) ?? [], devoir => devoir, (devoir, indexDevoir) => {
            return html`
          ${indexDevoir > 0 ? html`<hr/>` : ''}
          <div class="grade">${devoir.matiere}${msg(' :')} ${devoir.note}/${devoir.bareme}</div>
          <div><span>${msg('Date : ')}</span>${devoir.date ? formatter.format(parseXsdDate(devoir.date)) : ''}</div>
          `
          })
        }
    </r-pronote-discoverable-section>




    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('devoirs')

if (!customElements.get(tagName)) {
  customElements.define(tagName, Devoirs)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: Devoirs
  }
}
