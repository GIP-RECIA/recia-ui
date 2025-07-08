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
import { customElement, state } from 'lit/decorators.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import { spreadAttributes } from './directives/spreadAttributesDirective.ts'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { setLocale } from './utils/localizationUtils.ts'
import 'dropdown-info/dist/r-dropdown-info.js'
import 'info-etab-layout/dist/r-info-etab-layout.js'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaDropdownInfoEtab extends LitElement {
  @state()
  data: any | null = null

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
      <r-dropdown-info
        no-padding
      >
        <r-info-etab-layout
          ${spreadAttributes(this.data as Record<string, unknown> | null, new Set(['data-', 'aria-', 'loading']))}
        >
        </r-info-etab-layout>
      </r-dropdown-info>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaDropdownInfoEtab
  }
}
