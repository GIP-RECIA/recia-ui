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
import type { Ref } from 'lit/directives/ref.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { css, html, LitElement, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { componentName } from '../../common/config.ts'
import { name } from '../package.json'
import styles from './style.scss?inline'
import { getIcon } from './utils/fontawesomeUtils.ts'

const tagName = componentName(name)

@customElement(tagName)
export class ReciaBottomSheet extends LitElement {
  @property({ type: Boolean })
  open = false

  @property({ type: Boolean, attribute: 'close-icon' })
  closeIcon = false

  @property({ type: Boolean, attribute: 'drag-icon' })
  dragIcon = false

  @property({ type: Boolean, attribute: 'no-padding' })
  noPadding = false

  @state()
  isOpen = false

  @state()
  closeRequested = false

  bottomSheetContainerRef: Ref<HTMLElement> = createRef()
  bottomSheetSheetRef: Ref<HTMLElement> = createRef()

  activeElement: HTMLElement | undefined

  constructor() {
    super()
    library.add(
      faTimes,
    )
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('keyup', this.handleKeyPress.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.handleClick.bind(this))
    this.removeEventListener('keyup', this.handleKeyPress.bind(this))
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('open')) {
      this.toogleBottomSheet(undefined, this.open)
    }
    return true
  }

  toogleBottomSheet(e: Event | undefined, open: boolean = false): void {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (open) {
      this.activeElement = document.activeElement as HTMLElement
      document.documentElement.style.overflowY = 'hidden'
      this.isOpen = true
      setTimeout(() => {
        this.bottomSheetContainerRef.value?.focus()
      }, 200)
    }
    else {
      const scrollTop = this.bottomSheetContainerRef.value?.scrollTop
      const timeout = (scrollTop ?? 0) > 0 ? 100 : 0
      this.bottomSheetContainerRef.value && (this.bottomSheetContainerRef.value.scrollTop = 0)
      setTimeout(() => {
        this.closeRequested = true
        setTimeout(() => {
          document.documentElement.style.overflowY = ''
          this.isOpen = false
          this.open = false
          this.activeElement?.focus()
          this.closeRequested = false
        }, 300)
      }, timeout)
    }
  }

  closeBottomSheet(e: Event): void {
    this.toogleBottomSheet(e)
  }

  handleClick(e: MouseEvent): void {
    if (
      this.isOpen
      && this.bottomSheetSheetRef.value
      && !e.composedPath().includes(this.bottomSheetSheetRef.value)
    ) {
      e.preventDefault()
      this.closeBottomSheet(e)
    }
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (this.isOpen && e.key === 'Escape') {
      e.preventDefault()
      this.closeBottomSheet(e)
    }
  }

  render(): TemplateResult {
    return html`
      <div
        id="bottom-sheet-service-more"
        class="bottom-sheet"
        style="${styleMap({ display: this.isOpen ? '' : 'none' })}"
      >
        <div
          ${ref(this.bottomSheetContainerRef)}
          tabindex="-1"
          class="${classMap({
            'scrollable-container': true,
            'slide-up': !this.closeRequested,
            'slide-down': this.closeRequested,
          })}"
        >
          <div class="grow-1"></div>
          <div
            ${ref(this.bottomSheetSheetRef)}
            role="dialog"
            aria-modal="true"
            class="${classMap({
              'sheet': true,
              'no-padding': this.noPadding,
            })}"
          >
            ${this.dragIcon ? html`<div class="dragable"></div>` : nothing}
            ${
              this.closeIcon
                ? html`
                  <button
                    class="btn-tertiary circle close"
                    aria-label="Fermer la modale"
                    @click="${this.closeBottomSheet}"
                  >
                    ${getIcon(faTimes)}
                  </button>
                `
                : nothing
            }
            <slot></slot>
          </div>
        </div>
      </div>
    `
  }

  static styles = css`${unsafeCSS(styles)}`
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: ReciaBottomSheet
  }
}
