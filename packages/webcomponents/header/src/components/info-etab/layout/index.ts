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

import type { PropertyValues, TemplateResult } from 'lit'
import type { Information, InformationConfig } from '../../../types/index.ts'
import {
  faEnvelope,
  faGlobe,
  faLocationDot,
  faPhone,
} from '@fortawesome/free-solid-svg-icons'
import { localized, msg, str, updateWhenLocaleChanges } from '@lit/localize'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { componentName } from '../../../../../common/config.ts'
import langHelper from '../../../helpers/langHelper.ts'
import { InformationItem } from '../../../types/index.ts'
import { getIcon } from '../../../utils/fontawesomeUtils.ts'
import { getSvgIcon } from '../../../utils/iconUtils.ts'
import { setLocale } from '../../../utils/localizationUtils.ts'
import styles from './style.scss?inline'

const defaultInformation: Partial<InformationConfig> = {
  [InformationItem.Adress]: {
    icon: faLocationDot,
  },
  [InformationItem.Mail]: {
    icon: faEnvelope,
  },
  [InformationItem.Phone]: {
    icon: faPhone,
  },
  [InformationItem.Website]: {
    icon: faGlobe,
  },
}

@localized()
export class ReciaInfoEtabLayout extends LitElement {
  @property({ type: String, attribute: 'image-url' })
  imageUrl?: string

  @property({ type: String, attribute: 'svg-url' })
  svgUrl?: string

  @property({ type: String, attribute: 'etab-name' })
  etabName?: string

  @property({ type: String, attribute: 'acad-name' })
  acadName?: string

  @property({ type: Object })
  information?: Partial<InformationConfig>

  @state()
  localInformation?: Partial<InformationConfig>

  constructor() {
    super()
    const lang = langHelper.getPageLang()
    setLocale(lang)
    langHelper.setLocale(lang)
    updateWhenLocaleChanges(this)
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('information')) {
      this.mergeConfig()
    }
    return true
  }

  mergeConfig(): void {
    if (!this.information)
      return

    this.localInformation = Object.fromEntries(
      Object.entries(this.information).map(([key, value]) => [
        key,
        {
          ...defaultInformation[key as InformationItem],
          ...value,
        },
      ]),
    )
  }

  static i18n(): Record<InformationItem, string> {
    return {
      [InformationItem.Adress]: msg(str`Adresse`),
      [InformationItem.Mail]: msg(str`Mail`),
      [InformationItem.Phone]: msg(str`Numéro de téléphone`),
      [InformationItem.Website]: msg(str`Site web`),
    }
  }

  imageTemplate(containerClass: string): TemplateResult | typeof nothing {
    return this.imageUrl
      ? html`
          <div class="${containerClass}">
            <img src="${this.imageUrl}" alt="${msg(str`Photo de l'établissement`)}">
          </div>
        `
      : nothing
  }

  itemTemplate(item: Information): TemplateResult {
    return html`
      <li>
        ${getIcon(item.icon!)}
        <span class="sr-only">${ReciaInfoEtabLayout.i18n()[item.id]}</span>
        ${
          item.link
            ? html`
                <a
                  id="${item.id}"
                  href="${item.link.href}"
                  target="${item.link.target ?? nothing}"
                  rel="${item.link.rel ?? nothing}"
                >
                  ${item.value}
                </a>
              `
            : item.value
        }
      </li>
    `
  }

  render(): TemplateResult {
    return html`
      <div class="info-etab-layout">
        ${this.imageTemplate('image-container')}
        <div class="content-container">
          <header>
            ${getSvgIcon(this.svgUrl)}
            <div class="heading">
              ${this.etabName ? html`<span class="etab">${this.etabName}</span>` : nothing}
              ${this.acadName ? html`<span class="acad">${this.acadName}</span>` : nothing}
            </div>
          </header>
          <div class="content">
            ${this.imageTemplate('image')}
            ${
              this.localInformation
                ? html`
                    <address>
                      <ul>
                        ${repeat(
                          Object.entries(this.localInformation)?.filter(([key, value]) => {
                            return Object.values(InformationItem).includes(key as InformationItem) && value.value
                          }),
                          ([key, _]) => key,
                          ([key, value]) => this.itemTemplate({ id: key as InformationItem, ...value }),
                        )}
                      </ul>
                    </address>
                  `
                : nothing
            }
          </div>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

const tagName = componentName('info-etab-layout')

if (!customElements.get(tagName)) {
  customElements.define(tagName, ReciaInfoEtabLayout)
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaInfoEtabLayout
  }
}
