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
import type { PropertyValues, TemplateResult } from 'lit'
import type { Ref } from 'lit/directives/ref.js'
import type { ServiceInfoLayout } from '../../types/ServiceInfoLayoutType.ts'
import { localized, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { componentName } from '../../../../common/config.ts'
import { name } from '../../../package.json'
import { spreadAttributes } from '../../directives/spreadAttributesDirective.ts'
import langHelper from '../../helpers/langHelper.ts'
import pathHelper from '../../helpers/pathHelper.ts'
import infoService from '../../services/infoService.ts'
import portalService from '../../services/portalService.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import styles from './style.scss?inline'
import 'bottom-sheet/dist/r-bottom-sheet.js'
import '../layout/index.ts'

@localized()
export class ReciaBottomSheetServiceInfo extends LitElement {
  @property({ type: String })
  domain = window.location.hostname

  @property({ type: String, attribute: 'portal-path' })
  portalPath = ''

  @property({ type: String, attribute: 'portal-info-api-url' })
  portalInfoApiUrl?: string

  @property({ type: String, attribute: 'service-info-api-url' })
  serviceInfoApiUrl?: string

  @state()
  data: ServiceInfoLayout | null = null

  @state()
  loading = false

  lastfname?: string

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

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('portalPath')) {
      if (!this.portalPath || this.portalPath === '') {
        this.portalPath = import.meta.env.VITE_PORTAL_BASE_URL
      }
    }
    return true
  }

  open(): void {
    this.bottomSheetRef.value!.open()
  }

  close(): void {
    this.bottomSheetRef.value!.close()
  }

  async handleEvent(e: Event): Promise<void> {
    const { fname } = (e as CustomEvent).detail ?? {}
    if (!fname)
      return

    if (fname !== this.lastfname) {
      this.data = null
      this.lastfname = fname
      this.loading = true
      this.open()
    }
    else {
      this.open()
      return
    }

    const [portlet, info] = await Promise.all([
      portalService.get(
        pathHelper.getUrl(`${this.portalInfoApiUrl}/${fname}.json`, this.domain),
        this.domain,
        this.portalPath,
      ),
      infoService.get(pathHelper.getUrl(`${this.serviceInfoApiUrl}/${fname}`, this.domain)),
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
      >
        <r-service-info-layout
          ${spreadAttributes(this.data as Record<string, unknown> | null, new Set(['data-', 'aria-', 'loading']))}
          ?loading="${this.loading}"
          @close="${() => this.close()}"
        >
        </r-service-info-layout>
      </r-bottom-sheet>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName(`${name}-bottom-sheet`)

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaBottomSheetServiceInfo)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaBottomSheetServiceInfo
  }
}
