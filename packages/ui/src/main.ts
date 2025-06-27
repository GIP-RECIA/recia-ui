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
import './assets/scss/main.scss'

register()

/**
 * Functions
 */

function toggleListener(elementSelector: string, menuSelector: string) {
  document.querySelectorAll<HTMLElement>(elementSelector).forEach((element) => {
    const button = element.querySelector<HTMLButtonElement>('button[aria-controls]')

    let isExpended = false

    function toggle() {
      if (!button)
        return
      isExpended = !isExpended
      button.ariaExpanded = isExpended.toString()
      const indicator = button.querySelector<HTMLElement>('.folded-indicator')
      indicator && (indicator.style.rotate = isExpended ? '180deg' : '')
      const menu = element.querySelector<HTMLElement>(menuSelector)
      menu && (menu.style.display = isExpended ? '' : 'none')
    }

    button?.addEventListener('click', () => toggle())
  })
}

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

function toggleBottomSheet(element: HTMLElement | null, state: boolean): boolean {
  if (!element)
    return state
  state = !state
  document.documentElement.style.overflowY = state ? 'hidden' : ''
  element.style.display = state ? '' : 'none'

  return state
}

// Bottom sheet info
const bottomSheetInfo = document.querySelector<HTMLElement>('#bottom-sheet-info')
let isBottomSheetInfo = false

bottomSheetInfo?.querySelector<HTMLElement>('.dragable')?.addEventListener('click', () => {
  isBottomSheetInfo = toggleBottomSheet(bottomSheetInfo, isBottomSheetInfo)
})
bottomSheetInfo?.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => {
  isBottomSheetInfo = toggleBottomSheet(bottomSheetInfo, isBottomSheetInfo)
})

// Bottom sheet service more
const bottomSheetInfoServiceMore = document.querySelector<HTMLElement>('#bottom-sheet-service-more')
let isBottomSheetInfoServiceMore = false

bottomSheetInfoServiceMore?.querySelector<HTMLElement>('.dragable')?.addEventListener('click', () => {
  isBottomSheetInfoServiceMore = toggleBottomSheet(bottomSheetInfoServiceMore, isBottomSheetInfoServiceMore)
})
bottomSheetInfoServiceMore?.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => {
  isBottomSheetInfoServiceMore = toggleBottomSheet(bottomSheetInfoServiceMore, isBottomSheetInfoServiceMore)
})
document.querySelectorAll<HTMLButtonElement>('button.service-more').forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault()
    isBottomSheetInfoServiceMore = toggleBottomSheet(bottomSheetInfoServiceMore, isBottomSheetInfoServiceMore)
  })
})

// Bottom sheet favorites
const bottomSheetFavorites = document.querySelector<HTMLElement>('#bottom-sheet-favorites')
let isBottomSheetFavorites = false
bottomSheetFavorites?.querySelector<HTMLElement>('.dragable')?.addEventListener('click', () => {
  isBottomSheetFavorites = toggleBottomSheet(bottomSheetFavorites, isBottomSheetFavorites)
})
bottomSheetFavorites?.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => {
  isBottomSheetFavorites = toggleBottomSheet(bottomSheetFavorites, isBottomSheetFavorites)
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
  dropdownInfoButton.classList.toggle('active')
  const dropdownInfoMask = dropdownInfo?.querySelector<HTMLElement>('.dropdown-info-mask')
  dropdownInfoMask && (dropdownInfoMask.style.display = isDropdownInfoExpended ? '' : 'none')
  const dropdownInfoMenu = dropdownInfo?.querySelector<HTMLElement>('#dropdown-info-menu')
  dropdownInfoMenu && (dropdownInfoMenu.style.display = isDropdownInfoExpended ? '' : 'none')
}

dropdownInfoButton?.addEventListener('click', () => toggleDropdownInfo())

// Eyebrow
const eyebrow = document.querySelector<HTMLElement>('.user-menu')
const eyebrowButton = eyebrow?.querySelector<HTMLButtonElement>('button')

let isEyebrowExpended = false

function toggleEyebrow(): void {
  if (!eyebrow || !eyebrowButton)
    return
  isEyebrowExpended = !isEyebrowExpended
  eyebrowButton.ariaExpanded = isEyebrowExpended.toString()
  const buttonIcon = eyebrowButton.querySelector<HTMLElement>('svg')
  buttonIcon && (buttonIcon.style.rotate = isEyebrowExpended ? '180deg' : '')
  const eyebrowMenu = eyebrow.querySelector<HTMLElement>('ul')
  eyebrowMenu && (eyebrowMenu.style.display = isEyebrowExpended ? '' : 'none')
}

eyebrowButton?.addEventListener('click', () => toggleEyebrow())
eyebrow?.querySelector<HTMLButtonElement>('button#info-etab')?.addEventListener('click', () => {
  toggleEyebrow()
  isBottomSheetInfo = toggleBottomSheet(bottomSheetInfo, isBottomSheetInfo)
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
  drawer.classList.toggle('expended')
}

function closeDrawer() {
  isDrawerExpended = true
  toggleDrawer()
}

extendedUportalHeader?.querySelector<HTMLButtonElement>('button.drawer-toggle')?.addEventListener('click', () => toggleDrawer())

// Dropdown favorite
const favorite = drawer?.querySelector<HTMLElement>('.dropdown-favorites')
const favoriteButton = favorite?.querySelector<HTMLButtonElement>('button')

let isDropdownFavorite = false

function toggleFavorites() {
  if (currentBreakpoint < gridBreakpoints.get('md')!) {
    closeDrawer()
    isBottomSheetFavorites = toggleBottomSheet(bottomSheetFavorites, isBottomSheetFavorites)
  }
  else {
    isDropdownFavorite = !isDropdownFavorite
    favoriteButton?.classList.toggle('active')
    const menu = drawer?.querySelector<HTMLElement>('.dropdown-favorites > div')
    menu && (menu.style.display = isDropdownFavorite ? '' : 'none')
  }
}

favoriteButton?.addEventListener('click', () => toggleFavorites())

document.querySelectorAll<HTMLElement>('.favorite-layout').forEach((layout) => {
  const actions = layout.querySelectorAll<HTMLElement>('.actions')
  const button = layout.querySelector<HTMLElement>('button')
  button?.addEventListener('click', () => {
    actions.forEach((action) => {
      action.classList.toggle('disabled')
    })
  })
})

// Dropdown services
const servicesButton = drawer?.querySelector<HTMLButtonElement>('.dropdown-services button')

let isDropdownServices = false

function toggleServices() {
  isDropdownServices = !isDropdownServices
  document.documentElement.style.overflowY = isDropdownServices ? 'hidden' : ''
  isDropdownServices ? servicesButton?.classList.add('active') : servicesButton?.classList.remove('active')
  const menu = extendedUportalHeader?.querySelector<HTMLElement>('#services-layout')
  menu && (menu.style.display = isDropdownServices ? '' : 'none')
}

servicesButton?.addEventListener('click', () => toggleServices())

/**
 * Notifications drawer
 */
const notificationButton = extendedUportalHeader?.querySelector<HTMLButtonElement>('.notification > button[aria-controls]')
const notificationDrawer = document.querySelector<HTMLElement>('#notification-drawer')

let isNotificationDrawer = false

function toggleNotifications() {
  isNotificationDrawer = !isNotificationDrawer
  notificationButton!.ariaExpanded = isNotificationDrawer.toString()
  notificationDrawer?.classList.toggle('expended')
}

eyebrow?.querySelector<HTMLButtonElement>('#notification')?.addEventListener('click', () => {
  toggleEyebrow()
  toggleNotifications()
})
notificationDrawer?.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => toggleNotifications())
notificationButton?.addEventListener('click', () => toggleNotifications())

/**
 * Widgets
 */

toggleListener('.widget', '.menu')

const widgetSection = document.querySelector<HTMLElement>('section.widget-layout')
widgetSection?.querySelector<HTMLButtonElement>('button')?.addEventListener('click', () => {
  widgetSection.querySelectorAll('.actions').forEach((action) => {
    action.classList.toggle('disabled')
  })
})

/**
 * Filters
 */

toggleListener('.filters', '.menu')

/**
 * Services
 */

// Favorite
document.querySelectorAll<HTMLButtonElement>('.service-favorite > button').forEach((button) => {
  button?.addEventListener('click', () => {
    const svg = button.firstElementChild as HTMLElement
    button.setAttribute('aria-label', button.getAttribute('aria-label') === 'Ajouter aux favoris' ? 'Retirer des favoris' : 'Ajouter aux favoris')
    svg.setAttribute('data-prefix', svg.getAttribute('data-prefix') === 'fas' ? 'far' : 'fas')
    svg.classList.toggle('marked')
  })
})

document.querySelectorAll<HTMLButtonElement>('button.tag').forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.toggle('active')
  })
})

/**
 * Dev tools
 */

const body = document.querySelector('body')
const devContainer = document.createElement('div')
devContainer.style = `
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 0 16px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 9999;
`

const buttonStyle = `
  padding: 16px;
  background-color: var(--recia-primary, bisque);
  border-radius: 50px;
  font-weight: bold;
  color: white;
`

const themes = ['lycee', 'agri', '18', '28', '36', '37', '41', '45']
let currentTheme = 0
const lsTheme = localStorage.getItem('theme')
if (lsTheme !== null)
  currentTheme = JSON.parse(lsTheme).currentTheme
body?.classList.add(`dom-${themes[currentTheme]}`)

const themeButton = document.createElement('button')
themeButton.textContent = themes[currentTheme]
themeButton.style = buttonStyle
themeButton.addEventListener('click', () => switchTheme())

const dupNews = document.createElement('button')
dupNews.textContent = 'Actualités x2'
dupNews.style = buttonStyle
dupNews.addEventListener('click', () => duplicate('.news-layout > div > ul'))

const dupSuggest = document.createElement('button')
dupSuggest.textContent = 'Suggestions x2'
dupSuggest.style = buttonStyle
dupSuggest.addEventListener('click', () => duplicate('.suggestions-layout > ul'))

devContainer.appendChild(themeButton)
devContainer.appendChild(dupNews)
devContainer.appendChild(dupSuggest)
body?.appendChild(devContainer)

function switchTheme(): void {
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
  localStorage.setItem('theme', JSON.stringify({ currentTheme }))
  body?.classList.replace(`dom-${oldTheme}`, `dom-${newTheme}`)
  themeButton.textContent = newTheme
}

function duplicate(selector: string): void {
  const items = document.querySelector<HTMLUListElement>(selector)
  if (items?.children) {
    const children = Array.from(items.children)
    for (const child of children) {
      const newChild = child.cloneNode(true)
      items.appendChild(newChild)
    }
  }
}
