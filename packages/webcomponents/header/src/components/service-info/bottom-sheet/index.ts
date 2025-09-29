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
import type { ServiceInfoLayout } from '../../../types/index.ts'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { componentName } from '../../../../../common/config.ts'
import { preserveFromSpreading } from '../../../config.ts'
import { spreadAttributes } from '../../../directives/spreadAttributesDirective.ts'
import langHelper from '../../../helpers/langHelper.ts'
import InfoService from '../../../services/infoService.ts'
import PortletService from '../../../services/portletService.ts'
import { getDomainLink } from '../../../utils/linkUtils.ts'
import { setLocale } from '../../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import '../layout/index.ts'
import 'bottom-sheet'

@localized()
export class ReciaBottomSheetServiceInfo extends LitElement {
  @property({ type: String, attribute: 'portal-info-api-url' })
  portalInfoApiUrl?: string

  @property({ type: String, attribute: 'service-info-api-url' })
  serviceInfoApiUrl?: string

  @state()
  data?: ServiceInfoLayout

  @state()
  loading = false

  lastfname?: string

  lastData?: ServiceInfoLayout

  private bottomSheetRef: Ref<ReciaBottomSheet> = createRef()

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('service-info', this.handleEvent.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('service-info', this.handleEvent.bind(this))
  }

  open(): void {
    this.bottomSheetRef.value!.open()
  }

  close(): void {
    this.bottomSheetRef.value!.close()
  }

  reset(_: CustomEvent): void {
    this.lastData = this.data
    this.data = undefined
  }

  async handleEvent(e: Event): Promise<void> {
    const { fname } = (e as CustomEvent).detail ?? {}
    if (!fname)
      return

    if (fname !== this.lastfname) {
      this.lastfname = fname
      this.loading = true
      this.open()
    }
    else {
      this.data = this.lastData
      this.open()
      return
    }

    const [portlet, info] = await Promise.all([
      PortletService.get(getDomainLink(`${this.portalInfoApiUrl}/${fname}.json`), fname),
      InfoService.get(getDomainLink(`${this.serviceInfoApiUrl}/${fname}`)),
    ])

    if (!portlet || !info) {
      this.loading = false
      return
    }

    this.data = { ...portlet, ...info }
    this.loading = false
  }

  render(): TemplateResult {
    return html`
      <r-bottom-sheet
        ${ref(this.bottomSheetRef)}
        @close="${this.reset}"
      >
        <r-service-info-layout
          ${
            spreadAttributes(
              this.data as Record<string, unknown>,
              new Set(preserveFromSpreading),
            )
          }
          ?loading="${this.loading}"
          @close="${() => this.close()}"
        >
        </r-service-info-layout>
      </r-bottom-sheet>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('service-info-bottom-sheet')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaBottomSheetServiceInfo)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaBottomSheetServiceInfo
  }
}
