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
  HeaderProperties,
  LayoutApiResponse,
  Organizations,
  Service,
  Soffit,
  UpdatedFavoriteSection,
  UserInfo,
  UserMenuConfig,
} from '../types/index.ts'
import { msg, str } from '@lit/localize'
import { atom, batched } from 'nanostores'
import FavoritesService from '../services/favoritesService.ts'
import LayoutService from '../services/layoutService.ts'
import OrganizationService from '../services/organizationService.ts'
import ServicesService from '../services/servicesService.ts'
import SoffitService from '../services/soffitService.ts'
import TemplateService from '../services/templateService.ts'
import UserInfoService from '../services/userInfoService.ts'
import { UserMenuItem } from '../types/index.ts'
import { difference } from '../utils/objectUtils.ts'
import { onDiff } from '../utils/storeUtils.ts'

const favoriteSectionId: string = 'services'

const $settings = atom<Partial<HeaderProperties>>({
  contextApiUrl: import.meta.env.VITE_PORTAL_BASE_URL,
  domain: window.location.hostname,
})

const $soffit = atom<Soffit | undefined>()

const $userInfo = atom<UserInfo | undefined>()

const $organizations = atom<Organizations | undefined>()

const $baseServices = atom<Array<Service> | undefined>()

const $services = atom<Array<Service> | undefined>()

const $layout = atom<LayoutApiResponse | undefined>()

const $favoritesIds = atom<Array<number> | undefined>()

const $debug: ReadableAtom<boolean> = batched($settings, (newValue) => {
  return newValue.debug ?? false
})

const $authenticated: ReadableAtom<boolean> = batched($soffit, (newValue) => {
  return newValue?.authenticated ?? false
})

const $userMenu = batched([$userInfo, $settings], (userInfo, settings) => {
  if (!userInfo || !settings)
    return undefined

  const { displayName, picture, hasOtherOrgs } = userInfo
  const { defaultAvatarUrl, userInfoPortletUrl, signOutUrl } = settings

  const config: UserMenuConfig = {
    [UserMenuItem.Search]: undefined,
    [UserMenuItem.Notification]: false,
    [UserMenuItem.Settings]: userInfoPortletUrl
      ? {
          link: {
            href: userInfoPortletUrl,
          },
        }
      : false,
    [UserMenuItem.InfoEtab]: false,
    [UserMenuItem.ChangeEtab]: hasOtherOrgs
      ? {
          link: null,
        }
      : false,
    [UserMenuItem.Starter]: false,
    [UserMenuItem.Logout]: signOutUrl
      ? {
          link: {
            href: signOutUrl,
          },
        }
      : false,
  }

  return {
    'picture': picture ?? defaultAvatarUrl,
    'display-name': displayName,
    config,
  }
})

const $favorites: ReadableAtom<Array<Service> | undefined> = batched(
  [$baseServices, $favoritesIds],
  (services, favoriteIds) => {
    if (!services || !favoriteIds)
      return undefined

    let favorites: Array<Service> | undefined = favoriteIds
      ?.map(id => services?.find(service => service.id === id))
      .filter(service => service !== undefined)
    favorites = favorites && favorites?.length > 0 ? favorites : undefined

    $services.set(services.map((service) => {
      return {
        ...service,
        favorite: favorites ? favorites.includes(service) : false,
      }
    }))

    if ($debug.get()) {
      // eslint-disable-next-line no-console
      console.info('Favorites', favorites)
    }
    return favorites
  },
)

const $favoriteMenu: ReadableAtom<Array<FavoritesService> | undefined> = batched(
  $favorites,
  (favorites) => {
    if (!favorites)
      return undefined

    return [
      {
        id: favoriteSectionId,
        name: msg(str`Services`),
        items: favorites,
        canDelete: true,
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
  if (userInfoDiff && diffs.get('authenticated') === true)
    updateUserInfo()
}))

$userInfo.listen(onDiff((diffs) => {
  if (diffs.has('orgIds') || diffs.has('currentOrgId'))
    updateOrganization()
}))

$favoritesIds.listen(() => {
  document.dispatchEvent(new CustomEvent('update-favorites'))
})

$authenticated.listen((value) => {
  if (value) {
    if (true)
      document.body.classList.add('navigation-drawer-visible')
  }
  else {
    document.body.classList.remove('navigation-drawer-visible')
    $userInfo.set(undefined)
    $organizations.set(undefined)
    $services.set(undefined)
    $layout.set(undefined)
  }
})

async function updateSettings(
  newValue: Partial<HeaderProperties>,
): Promise<void> {
  const diffs = difference(newValue, $settings.get())
  if (diffs.size === 0)
    return

  if (diffs.has('templateApiUrl')) {
    const config = await updateTemplate(
      diffs.get('templateApiUrl') as string | undefined,
      diffs.get('domain') as string | undefined ?? $settings.get().domain,
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

  const template = await TemplateService.get(templateApiUrl, domain)
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

  const response = await SoffitService.get(userInfoApiUrl)
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
    organizationApiUrl,
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

async function updateServices(): Promise<void> {
  const { layoutApiUrl, portletApiUrl, servicesInfoApiUrl } = $settings.get()
  const soffit = $soffit.get()
  if (!soffit || !layoutApiUrl || !portletApiUrl || !servicesInfoApiUrl)
    return

  const [services, layout] = await Promise.all([
    ServicesService.get(soffit, portletApiUrl, servicesInfoApiUrl),
    LayoutService.get(soffit, layoutApiUrl),
  ])

  const favoriteIds = layout
    ? [...new Set(FavoritesService.getFromLayout(layout)?.map(Number))]
    : undefined

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

async function updateFavoritesFromFavorites(newValue: Array<UpdatedFavoriteSection>): Promise<void> {
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
        FavoritesService.remove(soffit, favoriteApiUrl, id)
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

  const response = await FavoritesService.add(soffit, favoriteApiUrl, id)
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

  const response = await FavoritesService.remove(soffit, favoriteApiUrl, id)
  if (response) {
    const newFavoritesIds = [...favoritesIds]
    newFavoritesIds.splice(index, 1)
    $favoritesIds.set(newFavoritesIds)
  }
}

export {
  $authenticated,
  $debug,
  $favoriteMenu,
  $favorites,
  $organizations,
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
}
