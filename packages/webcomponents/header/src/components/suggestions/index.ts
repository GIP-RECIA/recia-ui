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
import type { Service } from '../../types/serviceTypes.ts'
import { faArrowRight, faWarning } from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { useStores } from '@nanostores/lit'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../../../common/config.ts'
import { name } from '../../../package.json'
import langHelper from '../../helpers/langHelper.ts'
import {
  $authenticated,
  $baseServicesLoad,
  $services,
  updateServices,
} from '../../stores/index.ts'
import { LoadingState } from '../../types/loadingStateTypes.ts'
import { getIcon } from '../../utils/fontawesomeUtils.ts'
import { setLocale } from '../../utils/localizationUtils.ts'
import { onDiff } from '../../utils/storeUtils.ts'
import styles from './style.scss?inline'
import '../service/index.ts'

@localized()
@useStores($baseServicesLoad)
@useStores($services)
export class ReciaSuggestions extends LitElement {
  @state()
  services: Service[] = []

  fnames: string[] = []

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    $authenticated.listen(async (value) => {
      if (value) {
        updateServices()
        this.fnames = await this.getFnames()
      }
    })
    $services.listen(onDiff(() => {
      const services = $services.get() ?? []

      this.services = this.fnames
        .map(fname => services.find(service => service.fname === fname))
        .filter(service => service !== undefined)
    }))
  }

  openServices(_: Event): void {
    const headerTagName = componentName(name)
    const header = document.querySelector(headerTagName)
      || document.querySelector('extended-uportal-header')
    header?.dispatchEvent(new CustomEvent(headerTagName, {
      detail: {
        fun: 'toggleServicesLayout',
        attributes: [new CustomEvent('', { detail: { show: true } })],
      },
    }))
  }

  contentTemplate(): TemplateResult | typeof nothing {
    const loadingState = $baseServicesLoad.get()

    switch (loadingState) {
      case LoadingState.ERROR:
        return this.errorTemplate()

      case LoadingState.LOADED:
        return this.tilesTemplate()

      case LoadingState.UNLOADED:
      case LoadingState.LOADING:
      default:
        return this.skeletonTemplate()
    }
  }

  errorTemplate(): TemplateResult {
    return html`
        <div class="error">
          ${getIcon(faWarning)}
          <p>
            ${msg(str`Une erreur est survenue lors de la récupération des services.\nTentez de rafraichir la page.`)}
          </p>
        </div>
      `
  }

  skeletonTemplate(): TemplateResult {
    return html`
        <ul class="container">
          ${map(range(10), () => html`<li class="skeleton"></li>`)}
        </ul>
      `
  }

  async getFnames(): Promise<Array<string>> {
    try {
      const response = await fetch('/service-info-api/api/mostPopularServices/Everyone', {
        method: 'GET',
      })

      if (!response.ok)
        return []

      return await response.json()
    }
    catch (e) {
      console.error(e)
      return []
    }
  }

  tilesTemplate(): TemplateResult {
    return this.services.length > 0
      ? html`
          <ul class="container">
            ${
              repeat(
                this.services,
                service => service.id,
                service => html`
                    <li>
                      <r-service
                        id="${service.id}"
                        .fname="${service.fname}"
                        name="${service.name}"
                        category="${service.category ?? nothing}"
                        icon-url="${service.iconUrl ?? nothing}"
                        .link="${service.link}"
                        ?new="${service.new}"
                        ?favorite="${service.favorite}"
                        ?more="${service.more}"
                        @open-more="${(e: CustomEvent) => document.dispatchEvent(new CustomEvent('service-info', e))}"
                      >
                      </r-service>
                    </li>
                  `,
              )
            }
          </ul>
        `
      : html`
          <div class="empty">${msg(str`Aucun service`)}</div>
        `
  }

  render(): TemplateResult {
    return html`
      <div class="suggestions-layout">
        <header class="container">
          <h2>${msg(str`Populaire auprès de vos pairs`)}</h2>
          <div class="grow-1"></div>
          <button
            class="btn-tertiary"
            @click="${this.openServices}"
          >
            ${msg(str`voir tous les services`)}
            ${getIcon(faArrowRight)}
          </button>
        </header>
        ${this.contentTemplate()}
        <footer class="container">
          <div class="grow-1"></div>
          <button
            class="btn-tertiary"
            @click="${this.openServices}"
          >
            ${msg(str`voir tous les services`)}
            ${getIcon(faArrowRight)}
          </button>
        </footer>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('suggestions')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaSuggestions)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaSuggestions
  }
}
