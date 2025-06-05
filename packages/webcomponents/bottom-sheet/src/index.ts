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
  @property({ type: Boolean, attribute: 'open', reflect: true })
  isOpen = false

  @property({ type: Boolean, attribute: 'close-icon' })
  closeIcon = false

  @property({ type: Boolean, attribute: 'drag-icon' })
  dragIcon = false

  @property({ type: Boolean, attribute: 'no-padding' })
  noPadding = false

  show = false

  @state()
  closeRequested = false

  containerRef: Ref<HTMLElement> = createRef()
  growRef: Ref<HTMLElement> = createRef()
  sheetRef: Ref<HTMLElement> = createRef()

  startY = 0
  currentY = 0
  growHeight = 0
  isDragging = false

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
    this.addEventListener('touchstart', this.handleTouchStart.bind(this))
    this.addEventListener('touchmove', this.handleTouchMove.bind(this))
    this.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.handleClick.bind(this))
    this.removeEventListener('keyup', this.handleKeyPress.bind(this))
    this.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    this.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    this.removeEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has('isOpen') && _changedProperties.get('isOpen') !== this.isOpen)
      this.isOpen ? this.open() : this.close()
    return true
  }

  open(e: Event | undefined = undefined): void {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    this.activeElement = document.activeElement as HTMLElement
    document.documentElement.style.overflowY = 'hidden'
    this.show = true
    setTimeout(() => {
      this.containerRef.value!.focus()
    }, 200)
  }

  close(e: Event | undefined = undefined): void {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    const scrollTop = this.containerRef.value?.scrollTop ?? 0
    const timeout = scrollTop > 0 ? 100 : 0
    scrollTop > 0 && (this.containerRef.value!.scrollTop = 0)
    setTimeout(() => {
      this.closeRequested = true
      setTimeout(() => {
        document.documentElement.style.overflowY = ''
        this.show = false
        this.isOpen = false
        this.activeElement?.focus()
        this.closeRequested = false
        this.growRef.value!.style.marginTop = ''
      }, 300)
    }, timeout)
  }

  handleClick(e: MouseEvent): void {
    if (this.show && !e.composedPath().includes(this.sheetRef.value!)) {
      e.preventDefault()
      this.close(e)
    }
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (this.show && e.key === 'Escape') {
      e.preventDefault()
      this.close(e)
    }
  }

  handleTouchStart(e: TouchEvent): void {
    if (!this.show || !(this.containerRef.value!.scrollTop === 0))
      return

    this.startY = e.touches[0].clientY
    this.growHeight = this.growRef.value!.offsetHeight
    this.isDragging = true
  }

  handleTouchMove(e: TouchEvent): void {
    if (!this.isDragging)
      return

    this.currentY = e.touches[0].clientY
    const diffY = this.currentY - this.startY

    if (diffY > 0) {
      e.preventDefault()
      const newHeight = diffY
      this.growRef.value!.style.marginTop = `${this.growHeight + newHeight}px`
    }
  }

  handleTouchEnd(_: TouchEvent): void {
    if (!this.isDragging)
      return

    this.isDragging = false
    const diffY = this.currentY - this.startY
    const requiredScoll = this.sheetRef.value!.offsetHeight > 180
      ? 180
      : this.sheetRef.value!.clientHeight * 0.3

    if (diffY > requiredScoll) {
      this.close()
    }
    else {
      this.growRef.value!.style.transition = 'margin-top .3s ease-in-out'
      this.growRef.value!.style.marginTop = ''
      setTimeout(() => {
        this.growRef.value!.style.transition = ''
      }, 300)
    }
  }

  render(): TemplateResult {
    return html`
      <div
        id="bottom-sheet-service-more"
        class="bottom-sheet"
        style="${styleMap({ display: this.show ? undefined : 'none' })}"
      >
        <div ${ref(this.containerRef)} tabindex="-1" class="scrollable-container">
          <div ${ref(this.growRef)} class="grow-1" ></div>
          <div
            ${ref(this.sheetRef)}
            role="dialog"
            aria-modal="true"
            class="sheet${classMap({
              'slide-down': this.closeRequested,
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
                    @click="${this.close}"
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
