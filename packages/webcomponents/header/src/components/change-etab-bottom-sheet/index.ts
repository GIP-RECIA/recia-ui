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

import type { ReciaBottomSheet } from 'bottom-sheet'
import type { TemplateResult } from 'lit'
import type { Ref } from 'lit/directives/ref.js'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { createRef, ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../../../common/config.ts'
import langHelper from '../../helpers/langHelper.ts'
import ChangeEtabService from '../../services/changeEtabService.ts'
import { $organizations, $settings, $soffit } from '../../stores/index.ts'
import { getIconWithStyle } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import 'favorite'

@localized()
@useStores($organizations)
export class ReciaChangeEtabBottomSheet extends LitElement {
  private bottomSheetRef: Ref<ReciaBottomSheet> = createRef()

  private selectedEtab?: string

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  open(): void {
    this.bottomSheetRef.value!.open()
  }

  close(): void {
    this.bottomSheetRef.value!.close()
  }

  handleFormChange(e: Event): void {
    const target = e.target as HTMLInputElement
    this.selectedEtab = target.value
  }

  async submitForm(e: Event): Promise<void> {
    e.preventDefault()
    const soffitObject = $soffit.get()
    const { switchOrgPortletUrl } = $settings.get()
    if (!soffitObject || !switchOrgPortletUrl)
      return

    // eslint-disable-next-line no-alert
    if (confirm(msg(str`Afin que le changement d'établissement soit effectif, vous devez vous déonnecter.\n\nAcceptez-vous de vous déconnecter maintenant ?`))) {
      this.close()
      const response = await ChangeEtabService.setEtab(
        soffitObject,
        `${switchOrgPortletUrl}/${this.selectedEtab}`,
      )
      if (response)
        location.replace(`${response}/Logout`)
    }
  }

  render(): TemplateResult {
    const { other } = $organizations.get() ?? {}

    return html`
      <r-bottom-sheet
        ${ref(this.bottomSheetRef)}
      >
        <form @change="${this.handleFormChange}" @submit="${this.submitForm}">
          <header>
            <h1>${msg(str`Changer d'établissement`)}</h1>
          </header>
          <div class="content">
            <fieldset>
              <legend class="sr-only">${msg(str`Établissement`)}</legend>
              <ul>
                ${
                  repeat(
                    other ?? [],
                    org => org,
                    (org, index) => html`
                        <li>
                          <input
                            id="${org.id}"
                            type="radio"
                            name="etab"
                            value="${org.id}"
                            ?checked="${index === 0}"
                          >
                          <label for="${org.id}">
                            ${getIconWithStyle(faHouse, undefined, { icon: true })}
                            <span>${org.displayName}</span>
                            <span class="small">(${org.code})</span>
                          </label>
                        </li>
                      `,
                  )
                }
              </ul>
            </fieldset>
          </div>
          <footer>
            <button
              type="button"
              class="btn-secondary close"
              @click="${() => this.close()}"
            >
              ${msg(str`Fermer`)}
            </button>
            <button type="submit" class="btn-primary">
              ${msg(str`Changer d'établissement`)}
            </button>
          </footer>
        </form>
      </r-bottom-sheet>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('change-etab-bottom-sheet')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaChangeEtabBottomSheet)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaChangeEtabBottomSheet
  }
}
