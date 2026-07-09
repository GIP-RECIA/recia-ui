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

export class TabPanelHandler {
  prefixIdButtons: string
  prefixIdPanel: string

  countBtn: number = 0
  countPanel: number = 0

  index: number = 0

  buttonElementsRef: HTMLButtonElement[] = []

  constructor(prefixIdButtons: string, prefixIdPanel: string, private onChange: () => void) {
    this.prefixIdButtons = prefixIdButtons
    this.prefixIdPanel = prefixIdPanel
    this.onKeydown = this.onKeydown.bind(this)
  }

  public addButton(el: HTMLButtonElement, index: number): void {
    this.buttonElementsRef[index] = el
  }

  public getAriaSelected(index: number): boolean {
    return this.index === index
  }

  public getTabIndex(index: number): 0 | -1 {
    return this.index === index ? 0 : -1
  }

  public getAriaControl(index: number): string {
    return `${this.prefixIdPanel}${index}`
  }

  public getButtonId(index: number): string {
    return `${this.prefixIdButtons}${index}`
  }

  public getPanelId(index: number): string {
    return `${this.prefixIdPanel}${index}`
  }

  public setSelected(index: number): void {
    this.index = index
    this.buttonElementsRef[index]?.focus()
    this.onChange()
  }

  onKeydown(event: KeyboardEvent) {
    let flag = false

    const modulo: number = this.buttonElementsRef.length

    switch (event.key) {
      case 'ArrowLeft':
        // ((a % n ) + n ) % n for modulo, else it can return negative number
        this.index = ((this.index - 1 % modulo) + modulo) % modulo
        flag = true
        break

      case 'ArrowRight':
        this.index = (this.index + 1) % modulo
        flag = true
        break

      case 'Home':
        this.index = 0
        flag = true
        break

      case 'End':
        this.index = this.buttonElementsRef.length - 1
        flag = true
        break

      default:
        break
    }

    this.buttonElementsRef[this.index]?.focus()

    if (flag) {
      this.onChange()
      event.stopPropagation()
      event.preventDefault()
    }
  }
}
