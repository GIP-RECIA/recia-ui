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

import type { ReciaBottomSheet } from 'bottom-sheet/src'
import type { TemplateResult } from 'lit'
import type { Ref } from 'lit/directives/ref.js'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { createRef, ref } from 'lit/directives/ref.js'
import { componentName } from '../../../../common/config.ts'
import { name } from '../../../package.json'
import langHelper from '../../helpers/langHelper.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import 'bottom-sheet/dist/r-bottom-sheet.js'
import '../layout/index.ts'

@localized()
export class ReciaFavoriteBottomSheet extends LitElement {
  private bottomSheetRef: Ref<ReciaBottomSheet> = createRef()

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

  render(): TemplateResult {
    return html`
      <r-bottom-sheet
        ${ref(this.bottomSheetRef)}
      >
        <r-favorite-layout>
        </r-favorite-layout>
      </r-bottom-sheet>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(`${name}-bottom-sheet`)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaFavoriteBottomSheet)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaFavoriteBottomSheet
  }
}
