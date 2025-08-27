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

import type { ReadableAtom } from 'nanostores'
import type {
  FavoriteItem,
  FavoriteSection,
  HeaderProperties,
  LayoutApiResponse,
  Link,
  Organizations,
  SearchItem,
  SearchSection,
  Service,
  Soffit,
  UpdatedFavoriteSection,
  UserInfo,
  UserMenu,
  UserMenuConfig,
} from '../types/index.ts'
import { msg, str } from '@lit/localize'
import { atom, batched } from 'nanostores'
import DnmaService from '../services/dnmaService.ts'
import FavoritesService from '../services/favoritesService.ts'
import LayoutService from '../services/layoutService.ts'
import OrganizationService from '../services/organizationService.ts'
import ServicesService from '../services/servicesService.ts'
import SoffitService from '../services/soffitService.ts'
import TemplateService from '../services/templateService.ts'
import UserInfoService from '../services/userInfoService.ts'
import {
  LoadingState,
  UserMenuItem,
} from '../types/index.ts'
import { getDomainLink } from '../utils/linkUtils.ts'
import { difference } from '../utils/objectUtils.ts'
import { onDiff } from '../utils/storeUtils.ts'
import { alphaSort } from '../utils/stringUtils.ts'

const favoriteSectionId: string = 'services'

interface TmpSettings {
  search: boolean
  notifications: boolean
  infoEtab: boolean
}

interface otherSettings {
  orgIconUrl: string
}

const $debug = atom<boolean>(false)

const $settings = atom<Partial<HeaderProperties> & Partial<TmpSettings> & Partial<otherSettings>>({
  contextApiUrl: import.meta.env.VITE_PORTAL_BASE_URL,
  domain: window.location.hostname,
  search: true,
})

const $soffit = atom<Soffit | undefined>()

const $userInfo = atom<UserInfo | undefined>()

const $organizations = atom<Organizations | undefined>()

const $baseServices = atom<Array<Service> | undefined>()

const $baseServicesLoad = atom<LoadingState>(LoadingState.UNLOADED)

const $services = atom<Array<Service> | undefined>()

const $layout = atom<LayoutApiResponse | undefined>()

const $favoritesIds = atom<Array<number> | undefined>()

const $authenticated: ReadableAtom<boolean> = batched($soffit, (newValue) => {
  return newValue?.authenticated ?? false
})

const $userMenu: ReadableAtom<Partial<UserMenu> | undefined> = batched(
  [$userInfo, $settings, $organizations],
  (userInfo, settings, organizations) => {
    if (!userInfo || !settings)
      return undefined

    const { displayName, picture, hasOtherOrgs } = userInfo
    const {
      defaultAvatarUrl,
      userInfoPortletUrl,
      signOutUrl,
      switchOrgApiUrl,
      switchOrgPortletUrl,
    } = settings
    const { search, notifications, infoEtab, starter } = settings
    const { current, other } = organizations ?? {}

    let changeEtabLink: Link | null | undefined
    if (switchOrgPortletUrl) {
      changeEtabLink = {
        href: switchOrgPortletUrl,
        target: '_self',
      }
    }
    if (switchOrgApiUrl)
      changeEtabLink = null

    const config: UserMenuConfig = {
      [UserMenuItem.Search]: search ? undefined : false,
      [UserMenuItem.Notification]: notifications ? undefined : false,
      [UserMenuItem.Settings]: userInfoPortletUrl
        ? {
            link: {
              href: userInfoPortletUrl,
              target: '_self',
            },
          }
        : false,
      [UserMenuItem.InfoEtab]: infoEtab && current ? undefined : false,
      [UserMenuItem.ChangeEtab]: hasOtherOrgs && other && other.length > 0 && changeEtabLink !== undefined
        ? {
            link: changeEtabLink,
          }
        : false,
      [UserMenuItem.Starter]: starter ? undefined : false,
      [UserMenuItem.Logout]: signOutUrl
        ? {
            link: {
              href: signOutUrl,
              target: '_self',
            },
          }
        : false,
    }

    return {
      'picture': picture ?? defaultAvatarUrl,
      'display-name': displayName,
      config,
    }
  },
)

const $favorites: ReadableAtom<Array<Service> | undefined> = batched(
  [$baseServices, $favoritesIds],
  (services, favoriteIds) => {
    if (!services || !favoriteIds)
      return undefined

    let favorites: Array<Service> | undefined = favoriteIds
      ?.map(id => services?.find(service => service.id === id))
      .filter(service => service !== undefined)
    favorites = favorites && favorites?.length > 0 ? favorites : undefined

    let filterdServices: Array<Service> | undefined = services.map((service) => {
      return {
        ...service,
        favorite: favorites ? favorites.includes(service) : false,
      }
    })
    filterdServices = filterdServices && filterdServices.length > 0 ? filterdServices : undefined
    $services.set(filterdServices)

    if ($debug.get()) {
      // eslint-disable-next-line no-console
      console.info('Favorites', favorites)
    }
    return favorites
  },
)

const $favoriteMenu: ReadableAtom<Array<FavoriteSection> | undefined> = batched(
  [$favorites, $baseServicesLoad],
  (favorites, baseServicesLoad) => {
    return [
      {
        id: favoriteSectionId,
        name: msg(str`Services`),
        items: (favorites ?? []) as unknown as Array<FavoriteItem>,
        emptyText: msg(str`Aucun service favori`),
        canDelete: true,
        loading:
          baseServicesLoad === LoadingState.UNLOADED
          || baseServicesLoad === LoadingState.LOADING,
      },
    ]
  },
)

const $searchResults: ReadableAtom<Array<SearchSection> | undefined> = batched(
  [$baseServices, $baseServicesLoad],
  (services, baseServicesLoad) => {
    const servicesItems: Array<SearchItem> = services
      ?.map(({ id, name, category, link, description, keywords, fname }) => {
        return { id, name, category, link, description, keywords, fname }
      })
      .sort((a, b) => alphaSort(a.name, b.name, 'asc'))
      ?? []

    return [
      {
        id: 'services',
        name: msg(str`Services`),
        items: servicesItems,
        loading: baseServicesLoad === LoadingState.UNLOADED
          || baseServicesLoad === LoadingState.LOADING,
      },
    ]
  },
)

$settings.listen(onDiff((diffs) => {
  if (diffs.has('userInfoApiUrl'))
    updateSoffit()
}))

$soffit.listen(onDiff((diffs) => {
  const { orgAttributeName, userAllOrgsIdAttributeName } = $settings.get()
  let userInfoDiff = diffs.has('name')
  if (orgAttributeName)
    userInfoDiff = userInfoDiff || diffs.has(orgAttributeName)
  if (userAllOrgsIdAttributeName)
    userInfoDiff = userInfoDiff || diffs.has(userAllOrgsIdAttributeName)
  if (userInfoDiff && $authenticated.get())
    updateUserInfo()
}))

$userInfo.listen(onDiff((diffs) => {
  if (diffs.has('currentOrgId')) {
    $baseServicesLoad.set(LoadingState.UNLOADED)
    $baseServices.set(undefined)
    $services.set(undefined)
    $layout.set(undefined)
    $favoritesIds.set(undefined)
  }
  if (diffs.has('currentOrgId') || diffs.has('orgIds'))
    updateOrganization()
}))

$favoritesIds.listen(() => {
  document.dispatchEvent(new CustomEvent('update-favorites'))
})

$authenticated.listen((value) => {
  const { navigationDrawerVisible, dnmaUrl, fname } = $settings.get() ?? {}
  if (value) {
    if (navigationDrawerVisible === true)
      document.body.classList.add('navigation-drawer-visible')
    if (dnmaUrl)
      DnmaService.init(dnmaUrl, fname ?? 'Unknown')
  }
  else {
    document.body.classList.remove('navigation-drawer-visible')
    $userInfo.set(undefined)
    $organizations.set(undefined)
    $baseServicesLoad.set(LoadingState.UNLOADED)
    $baseServices.set(undefined)
    $services.set(undefined)
    $layout.set(undefined)
    $favoritesIds.set(undefined)
  }
})

async function updateSettings(
  newValue: Partial<HeaderProperties>,
): Promise<void> {
  const diffs = difference(newValue, $settings.get())
  if (diffs.size === 0)
    return

  if (diffs.has('domain')) {
    $settings.set({
      ...$settings.get(),
      domain: diffs.get('domain') as string | undefined,
    })
  }

  if (diffs.has('templateApiUrl')) {
    const config = await updateTemplate(
      diffs.get('templateApiUrl') as string | undefined,
      $settings.get().domain,
    )
    $settings.set({
      ...$settings.get(),
      ...config,
      ...newValue,
    })
  }
  else {
    $settings.set({
      ...$settings.get(),
      ...newValue,
    })
  }
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Settings', $settings.get())
  }
}

async function updateTemplate(
  templateApiUrl: string | undefined,
  domain: string | undefined,
): Promise<Partial<HeaderProperties> | undefined> {
  if (!templateApiUrl || !domain)
    return

  const templates = await TemplateService.get(getDomainLink(templateApiUrl))
  if (!templates)
    return undefined

  const template = TemplateService.getCurrent(templates, domain)
  if (!template)
    return

  $settings.set({
    ...$settings.get(),
    orgIconUrl: template.iconPath,
  })
  document.body.classList.forEach((cls) => {
    if (cls.startsWith('theme-'))
      document.body.classList.remove(cls)
  })
  document.body.classList.add(`theme-${template.id}`)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Template', template)
  }
  return template?.config
}

async function updateSoffit(): Promise<void> {
  const { userInfoApiUrl } = $settings.get()
  if (!userInfoApiUrl)
    return

  const response = await SoffitService.get(getDomainLink(userInfoApiUrl))
  $soffit.set(response)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Soffit', response)
  }
}

function updateUserInfo(): void {
  const soffit = $soffit.get()
  const { orgAttributeName, userAllOrgsIdAttributeName } = $settings.get()
  if (!soffit || !orgAttributeName || !userAllOrgsIdAttributeName)
    return

  const response = UserInfoService.getFromSoffit(
    soffit,
    orgAttributeName,
    userAllOrgsIdAttributeName,
  )
  $userInfo.set(response)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('UserInfo', response)
  }
}

async function updateOrganization(): Promise<void> {
  const soffit = $soffit.get()
  const { organizationApiUrl, orgLogoUrlAttributeName } = $settings.get()
  const { orgIds, currentOrgId } = $userInfo.get() ?? {}
  if (!soffit || !organizationApiUrl || !orgIds || !currentOrgId)
    return

  const response = await OrganizationService.get(
    soffit,
    getDomainLink(organizationApiUrl),
    orgIds,
    currentOrgId,
    orgLogoUrlAttributeName ?? '',
  )
  $organizations.set(response)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Organization', response)
  }
}

async function updateServices(forceUpdate: boolean = false): Promise<void> {
  const { layoutApiUrl, portletApiUrl, servicesInfoApiUrl } = $settings.get()
  const soffit = $soffit.get()
  if (!soffit || !layoutApiUrl || !portletApiUrl || !servicesInfoApiUrl)
    return

  if ($baseServicesLoad.get() === LoadingState.LOADING)
    return

  if (!forceUpdate && $services.get() !== undefined)
    return

  $baseServicesLoad.set(LoadingState.LOADING)
  const [services, layout] = await Promise.all([
    ServicesService.get(soffit, getDomainLink(portletApiUrl), getDomainLink(servicesInfoApiUrl)),
    LayoutService.get(soffit, getDomainLink(layoutApiUrl)),
  ])

  const favoriteIds = layout
    ? [...new Set(FavoritesService.getFromLayout(layout)?.map(Number))]
    : undefined

  $baseServicesLoad.set(services ? LoadingState.LOADED : LoadingState.ERROR)

  $favoritesIds.set(favoriteIds)
  $baseServices.set(services)
  $layout.set(layout)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Services', services)
    // eslint-disable-next-line no-console
    console.info('Layout', layout)
  }
}

async function updateFavoritesFromFavorites(
  newValue: Array<UpdatedFavoriteSection>,
): Promise<void> {
  const soffit = $soffit.get()
  const layout = $layout.get()
  const { favoriteApiUrl } = $settings.get()
  if (!soffit || !favoriteApiUrl || !layout)
    return

  newValue.forEach((section) => {
    const { id, deleted, items } = section
    const deletedIds = deleted.map(item => item.id)

    if (id === favoriteSectionId) {
      deletedIds.forEach((id) => {
        FavoritesService.remove(soffit, getDomainLink(favoriteApiUrl), id)
      })
      const newFavoriteIds = items.map(item => Number(item.id))
      $favoritesIds.set(newFavoriteIds)
    }
  })
}

async function addFavorite(id: number): Promise<void> {
  const soffit = $soffit.get()
  const { favoriteApiUrl } = $settings.get()
  const favoritesIds = $favoritesIds.get()
  if (!soffit || !favoriteApiUrl)
    return

  if (favoritesIds && favoritesIds.findIndex(el => el === id) !== -1)
    return

  const response = await FavoritesService.add(soffit, getDomainLink(favoriteApiUrl), id)
  if (response)
    $favoritesIds.set([...(favoritesIds ?? []), id])
}

async function removeFavorite(id: number): Promise<void> {
  const soffit = $soffit.get()
  const { favoriteApiUrl } = $settings.get()
  const favoritesIds = $favoritesIds.get()
  if (!soffit || !favoriteApiUrl || !favoritesIds)
    return

  const index = favoritesIds.findIndex(el => el === id)
  if (index === -1)
    return

  const response = await FavoritesService.remove(soffit, getDomainLink(favoriteApiUrl), id)
  if (response) {
    const newFavoritesIds = [...favoritesIds]
    newFavoritesIds.splice(index, 1)
    $favoritesIds.set(newFavoritesIds)
  }
}

export {
  $authenticated,
  $baseServicesLoad,
  $debug,
  $favoriteMenu,
  $favorites,
  $organizations,
  $searchResults,
  $services,
  $settings,
  $soffit,
  $userInfo,
  $userMenu,
  addFavorite,
  removeFavorite,
  updateFavoritesFromFavorites,
  updateServices,
  updateSettings,
  updateSoffit,
}
