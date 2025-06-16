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

import { register } from './plugings/fontawesome'
import 'ress/dist/ress.min.css'
import './assets/scss/main.scss'

register()

/**
 * Grid breakpoints
 */

const gridBreakpoints: Map<string, number> = new Map([
  ['xs', 0],
  ['sm', 576],
  ['md', 768],
  ['lg', 992],
  ['xl', 1200],
  ['xxl', 1400],
])

let currentBreakpoint = 0

function handleBreakpoints(): void {
  let breakpoint = 0
  for (const [_, value] of gridBreakpoints.entries()) {
    if (window.innerWidth >= value)
      breakpoint = value
  }
  currentBreakpoint = breakpoint
}

handleBreakpoints()

window.addEventListener('resize', () => handleBreakpoints())

/**
 * Bottom sheet
 */

// Bottom sheet info
const bottomSheetInfo = document.querySelector<HTMLElement>('#bottom-sheet-info')

let isBottomSheetInfo = false

function toggleBottomSheetInfo(): void {
  isBottomSheetInfo = !isBottomSheetInfo
  document.documentElement.style.overflowY = isBottomSheetInfo ? 'hidden' : ''
  bottomSheetInfo!.style.display = isBottomSheetInfo ? '' : 'none'
}

bottomSheetInfo?.querySelector<HTMLElement>('.dragable')?.addEventListener('click', () => toggleBottomSheetInfo())
bottomSheetInfo?.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => toggleBottomSheetInfo())

// Bottom sheet service more
const bottomSheetInfoServiceMore = document.querySelector<HTMLElement>('#bottom-sheet-service-more')

let isBottomSheetInfoServiceMore = false

function toggleBottomSheetInfoServiceMoreState(): void {
  if (!bottomSheetInfoServiceMore)
    return
  isBottomSheetInfoServiceMore = !isBottomSheetInfoServiceMore
  document.documentElement.style.overflowY = isBottomSheetInfoServiceMore ? 'hidden' : ''
  bottomSheetInfoServiceMore.style.display = isBottomSheetInfoServiceMore ? '' : 'none'
}

bottomSheetInfoServiceMore?.querySelector<HTMLElement>('.dragable')?.addEventListener('click', () => toggleBottomSheetInfoServiceMoreState())
bottomSheetInfoServiceMore?.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => toggleBottomSheetInfoServiceMoreState())
document.querySelector<HTMLButtonElement>('button.service-more')?.addEventListener('click', (e) => {
  e.preventDefault()
  toggleBottomSheetInfoServiceMoreState()
})

/**
 * Extended Uportal Header
 */

const extendedUportalHeader = document.querySelector<HTMLElement>('.extended-uportal-header')

// Dropdown info
const dropdownInfo = document.querySelector<HTMLElement>('.dropdown-info')
const dropdownInfoButton = dropdownInfo?.querySelector<HTMLButtonElement>('button.dropdown-info-button')

let isDropdownInfoExpended = false

function toggleDropdownInfo(): void {
  if (!dropdownInfo || !dropdownInfoButton)
    return
  isDropdownInfoExpended = !isDropdownInfoExpended
  dropdownInfoButton.ariaExpanded = isDropdownInfoExpended.toString()
  isDropdownInfoExpended ? dropdownInfoButton.classList.add('active') : dropdownInfoButton.classList.remove('active')
  const dropdownInfoMask = dropdownInfo?.querySelector<HTMLElement>('.dropdown-info-mask')
  dropdownInfoMask && (dropdownInfoMask.style.display = isDropdownInfoExpended ? '' : 'none')
  const dropdownInfoMenu = dropdownInfo?.querySelector<HTMLElement>('#dropdown-info-menu')
  dropdownInfoMenu && (dropdownInfoMenu.style.display = isDropdownInfoExpended ? '' : 'none')
}

dropdownInfoButton?.addEventListener('click', () => toggleDropdownInfo())

// Eyebrow
const eyebrow = document.querySelector<HTMLElement>('.eyebrow')
const eyebrowButton = eyebrow?.querySelector<HTMLButtonElement>('button.eyebrow-button')

let isEyebrowExpended = false

function toggleEyebrow(): void {
  if (!eyebrow || !eyebrowButton)
    return
  isEyebrowExpended = !isEyebrowExpended
  eyebrowButton.ariaExpanded = isEyebrowExpended.toString()
  const buttonIcon = eyebrowButton.querySelector<HTMLElement>('svg')
  buttonIcon && (buttonIcon.style.rotate = isEyebrowExpended ? '180deg' : '')
  const eyebrowMenu = eyebrow.querySelector<HTMLElement>('#eyebrow-menu')
  eyebrowMenu && (eyebrowMenu.style.display = isEyebrowExpended ? '' : 'none')
}

eyebrowButton?.addEventListener('click', () => toggleEyebrow())
eyebrow?.querySelector<HTMLButtonElement>('button#info-etab')?.addEventListener('click', () => {
  toggleEyebrow()
  toggleBottomSheetInfo()
})

// Search
const search = extendedUportalHeader?.querySelector<HTMLElement>('.search-container .search')

let isExtendedUportalHeaderExpended = false

function toggleSearch(): void {
  if (!extendedUportalHeader)
    return
  isExtendedUportalHeaderExpended = !isExtendedUportalHeaderExpended
  document.documentElement.style.overflowY = isExtendedUportalHeaderExpended ? 'hidden' : ''
  const extendedUportalHeaderExpended = extendedUportalHeader?.querySelector<HTMLElement>('.search-container')
  extendedUportalHeaderExpended && (extendedUportalHeaderExpended.style.display = isExtendedUportalHeaderExpended ? '' : 'none')
}

extendedUportalHeader?.querySelector<HTMLButtonElement>(('.end > button.search-button'))?.addEventListener('click', () => toggleSearch())
search?.querySelector<HTMLButtonElement>('.search-field > .end > button')?.addEventListener('click', () => toggleSearch())

// Drawer
const drawer = extendedUportalHeader?.querySelector<HTMLElement>('.drawer')

let isDrawerExpended = false

function toggleDrawer() {
  if (!drawer)
    return
  isDrawerExpended = !isDrawerExpended
  isDrawerExpended ? drawer.classList.add('expended') : drawer.classList.remove('expended')
}

extendedUportalHeader?.querySelector<HTMLButtonElement>('button.drawer-toggle')?.addEventListener('click', () => toggleDrawer())

// Dropdown favorite
const favorite = drawer?.querySelector<HTMLElement>('.dropdown-favorites')
const favoriteButton = favorite?.querySelector<HTMLButtonElement>('button')

let isDropdownFavorite = false

function toggleFavorites() {
  isDropdownFavorite = !isDropdownFavorite
  isDropdownFavorite ? favoriteButton?.classList.add('active') : favoriteButton?.classList.remove('active')
  const menu = drawer?.querySelector<HTMLElement>('.dropdown-favorites > div')
  menu && (menu.style.display = isDropdownFavorite ? '' : 'none')
}

favoriteButton?.addEventListener('click', () => toggleFavorites())

// Widgets
document.querySelectorAll<HTMLElement>('.widget-tile')?.forEach((widget) => {
  const button = widget.querySelector<HTMLButtonElement>('button')

  let isExpended = false

  function toggleWidget() {
    if (!button)
      return
    isExpended = !isExpended
    button.ariaExpanded = isExpended.toString()
    const indicator = button.querySelector<HTMLElement>('.folded-indicator')
    indicator && (indicator.style.rotate = isExpended ? '180deg' : '')
    const menu = widget.querySelector<HTMLElement>('.widget-menu')
    menu && (menu.style.display = isExpended ? '' : 'none')
  }

  button?.addEventListener('click', () => toggleWidget())
})

// Favorite
document.querySelectorAll<HTMLButtonElement>('.service-favorite > button').forEach((button) => {
  button?.addEventListener('click', () => {
    const svg = button.firstElementChild as HTMLElement
    svg.setAttribute('data-prefix', svg.getAttribute('data-prefix') === 'fas' ? 'far' : 'fas')
    svg.classList.toggle('marked')
  })
})

// Theme
const themes = ['lycee', 'agri', '18', '28', '36', '37', '41', '45']
let currentTheme = 0
const body = document.querySelector('body')
body?.classList.add(`dom-${themes[currentTheme]}`)
const themeButton = document.createElement('button')
themeButton.style = `
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 0 16px 16px 0;
  padding: 16px;
  background-color: bisque;
  border-radius: 50px;
  z-index: 9999;
`
themeButton.textContent = themes[currentTheme]
themeButton.addEventListener('click', () => {
  let oldTheme, newTheme
  if (currentTheme + 1 < themes.length) {
    oldTheme = themes[currentTheme]
    currentTheme++
    newTheme = themes[currentTheme]
  }
  else {
    oldTheme = themes[currentTheme]
    currentTheme = 0
    newTheme = themes[currentTheme]
  }
  body?.classList.replace(`dom-${oldTheme}`, `dom-${newTheme}`)
  themeButton.textContent = newTheme
})
body?.appendChild(themeButton)
