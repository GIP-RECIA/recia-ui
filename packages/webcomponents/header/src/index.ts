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
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import langHelper from './helpers/langHelper.ts'
import styles from './style.scss?inline'
import { setLocale } from './utils/localizationUtils.ts'
import './components/navigation-drawer'
import './components/notification-drawer'
import './components/principal-container'
import './components/services-layout'

const tagName = componentName(name)

@localized()
@customElement(tagName)
export class ReciaHeader extends LitElement {
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
      <div class="header">
        <div class="mask" style="display: none;"></div>
        <r-navigation-drawer>
        </r-navigation-drawer>
        <div class="topbar">
          <r-principal-container>
          </r-principal-container>
        </div>
        <r-services-layout>
        </r-services-layout>
        <r-notification-drawer>
        </r-notification-drawer>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaHeader
  }
}
