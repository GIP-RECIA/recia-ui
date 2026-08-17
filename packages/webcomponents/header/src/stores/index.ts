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

import type { Link } from 'common/types/index.ts'
import type { Section } from 'filters/types/SectionType.ts'
import type { ReadableAtom } from 'nanostores'
import type {
  Category,
  FavoriteSection,
  HeaderFeatures,
  HeaderProperties,
  InfoEtabData,
  LayoutApiResponse,
  Notif,
  Organization,
  Organizations,
  ScriptLoad,
  SearchSection,
  Service,
  ServiceAndServiceResource,
  Soffit,
  Template,
  UpdatedFavoriteSection,
  UserInfo,
  UserMenu,
  UserMenuConfig,
} from '../types/index.ts'
import { msg, str } from '@lit/localize'
import { throttle } from 'lodash-es'
import { matchSorter } from 'match-sorter'
import { atom, batched } from 'nanostores'
import { defaultFilterKey } from '../config.ts'
import DnmaService from '../services/dnmaService.ts'
import FavoritesService from '../services/favoritesService.ts'
import LayoutService from '../services/layoutService.ts'
import MediacentreService from '../services/mediacentreService.ts'
import NotificationService from '../services/notificationService.ts'
import OrganizationService from '../services/organizationService.ts'
import scriptLoaderService from '../services/scriptLoaderService.ts'
import ServicesService from '../services/servicesService.ts'
import SessionService from '../services/sessionService.ts'
import SoffitService from '../services/soffitService.ts'
import TemplateService from '../services/templateService.ts'
import UserInfoService from '../services/userInfoService.ts'
import {
  FavoriteSectionId,
  InformationItem,
  LoadingState,
  UserMenuItem,
} from '../types/index.ts'
import { getDomainLink, removeProtocol } from '../utils/linkUtils.ts'
import { difference } from '../utils/objectUtils.ts'
import { onDiff } from '../utils/storeUtils.ts'
import { alphaSort } from '../utils/stringUtils.ts'
import { updateTheme } from '../utils/themeUtils.ts'

interface otherSettings {
  orgIconUrl: string
}

const $debug = atom<boolean>(false)

const $features = atom<HeaderFeatures>({
  infoEtab: true,
  search: true,
  notifications: true,
})

const $settings = atom<Partial<HeaderProperties> & Partial<otherSettings>>({
  contextApiUrl: import.meta.env.VITE_PORTAL_BASE_URL,
  domain: window.location.hostname,
  cacheBusterVersion: Math.floor(Date.now() / (24 * 60 * 60 * 1000)).toString(),
})

const $soffit = atom<Soffit | undefined>()

const $userInfo = atom<UserInfo | undefined>()

const $organizations = atom<Organizations | undefined>()

const $baseServices = atom<Service[] | undefined>()

const $baseServicesLoad = atom<LoadingState>(LoadingState.UNLOADED)

const $services = atom<Service[] | undefined>()

const $categories = atom<Category[] | undefined>()

const $layout = atom<LayoutApiResponse | undefined>()

const $favoritesIds = atom<number[] | undefined>()

const $mediacentreFavorites = atom<ServiceAndServiceResource[] | undefined>()

const $mediacentreFavoritesLoad = atom<LoadingState>(LoadingState.UNLOADED)

const $searchQueryString = atom<string>('')

const $selectedCategory = atom<string>(defaultFilterKey)

const $notifications = atom<Notif[] | undefined>()

const $authenticated: ReadableAtom<boolean> = batched(
  [$soffit],
  newValue => newValue?.authenticated ?? false,
)

const $unnreadNotifications: ReadableAtom<number> = batched(
  [$notifications],
  notifications => (
    !notifications
      ? 0
      : notifications.filter(({ read }) => !read).length

  ),
)

const $groupedNotifications: ReadableAtom<Map<string, Map<string, Notif[]>>> = batched(
  [$notifications],
  (notifications) => {
    if (!notifications) {
      return new Map<string, Map<string, Notif[]>>()
    }

    return notifications.reduce(
      (days, notif) => {
        const { createdAt, service } = notif.notification.header.eventHeader

        const day = createdAt.slice(0, 10)
        if (!days.has(day))
          days.set(day, new Map())

        const services = days.get(day)!
        if (!services.has(service))
          services.set(service, [])

        services.get(service)!.push(notif)

        return days
      },
      new Map<string, Map<string, Notif[]>>(),
    )
  },
)

const $userMenu: ReadableAtom<Partial<UserMenu> | undefined> = batched(
  [
    $userInfo,
    $settings,
    $organizations,
    $unnreadNotifications,
    $features,
  ],
  (
    userInfo,
    settings,
    organizations,
    unnreadNotifications,
    features,
  ) => {
    if (!userInfo || !settings)
      return undefined

    const { displayName, picture, hasOtherOrgs } = userInfo
    const {
      defaultAvatarUrl,
      userInfoPortletUrl,
      signOutUrl,
      switchOrgApiUrl,
      switchOrgPortletUrl,
      starter,
    } = settings
    const {
      infoEtab: featInfoEtab,
      search: featSearch,
      notifications: featNotifications,
    } = features
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
      [UserMenuItem.Search]: featSearch ? undefined : false,
      [UserMenuItem.Notification]: featNotifications ? undefined : false,
      [UserMenuItem.Account]: userInfoPortletUrl
        ? {
            link: {
              href: userInfoPortletUrl,
              target: '_self',
            },
          }
        : false,
      [UserMenuItem.InfoEtab]: featInfoEtab && current ? undefined : false,
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
      'notification': unnreadNotifications,
      config,
    }
  },
)

const $favorites: ReadableAtom<Service[] | undefined> = batched(
  [$baseServices, $favoritesIds],
  (services, favoriteIds) => {
    if (!services || !favoriteIds)
      return undefined

    let favorites: Service[] | undefined = favoriteIds
      ?.map(id => services?.find(service => service.id === id))
      .filter(service => service !== undefined)
    favorites = favorites && favorites?.length > 0 ? favorites : undefined

    let filterdServices: Service[] | undefined = services.map((service) => {
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

const $searchResultServices: ReadableAtom<Service[] | undefined> = batched(
  [$services, $searchQueryString],
  (services, search) => {
    if (!services)
      return

    let results = services
    if (search !== '') {
      results = matchSorter(
        results,
        search,
        {
          keys: ['name', 'description', 'keywords'],
          threshold: matchSorter.rankings.ACRONYM,
          sorter: rankedItems => rankedItems,
        },
      )
    }

    return results
  },
)

const $filteredServices: ReadableAtom<Service[] | undefined> = batched(
  [$searchResultServices, $selectedCategory],
  (services, category) => {
    if (!services)
      return

    let results = services
    if (category !== defaultFilterKey) {
      results = matchSorter(
        results,
        category,
        {
          keys: ['categories'],
          threshold: matchSorter.rankings.EQUAL,
          sorter: rankedItems => rankedItems,
        },
      )
    }

    return results
  },
)

const $mediacentreFavoritesAvailable: ReadableAtom<boolean> = batched(
  [$settings],
  (settings) => {
    const {
      groupsApiUrl,
      mediacentreConfigUrl,
      mediacentreFavoriteApiUrl,
      mediacentrePortalFavoriteApiUrlGet,
      mediacentreRedirectUrlPattern,
    } = settings

    return !(
      !groupsApiUrl
      || !mediacentreConfigUrl
      || !mediacentreFavoriteApiUrl
      || !mediacentrePortalFavoriteApiUrlGet
      || !mediacentreRedirectUrlPattern
    )
  },
)

const $favoriteMenu: ReadableAtom<FavoriteSection[]> = batched(
  [
    $settings,
    $favorites,
    $baseServicesLoad,
    $mediacentreFavoritesAvailable,
    $mediacentreFavorites,
    $mediacentreFavoritesLoad,
  ],
  (
    settings,
    favorites,
    baseServicesLoad,
    mediacentreFavoritesAvailable,
    mediacentreFavorites,
    mediacentreFavoritesLoad,
  ) => {
    const mediacentreActions = !!settings.mediacentrePortalFavoriteApiUrlPut

    return [
      {
        id: FavoriteSectionId.Services,
        name: msg(str`Services`),
        items: favorites ?? [],
        emptyText: msg(str`Aucun service favori`),
        canDelete: true,
        loading:
          baseServicesLoad === LoadingState.UNLOADED
          || baseServicesLoad === LoadingState.LOADING,
      },
      mediacentreFavoritesAvailable
        ? {
            id: FavoriteSectionId.Mediacentre,
            name: 'Médiacentre',
            items: mediacentreFavorites ?? [],
            emptyText: msg(str`Aucun favori ${'Médiacentre'}`),
            canDelete: mediacentreActions,
            canMove: mediacentreActions,
            loading:
          mediacentreFavoritesLoad === LoadingState.UNLOADED
          || mediacentreFavoritesLoad === LoadingState.LOADING,
          }
        : undefined,
    ].filter(item => item !== undefined)
  },
)

const $searchResults: ReadableAtom<SearchSection[] | undefined> = batched(
  [$searchResultServices, $baseServicesLoad],
  (services, baseServicesLoad) => {
    return [
      {
        id: 'services',
        name: msg(str`Services`),
        items: services ?? [],
        loading: baseServicesLoad === LoadingState.UNLOADED
          || baseServicesLoad === LoadingState.LOADING,
      },
    ]
  },
)

const $displayedCategories: ReadableAtom<Category[] | undefined> = batched(
  [$categories, $searchResultServices],
  (categories, services) => {
    const servicesCategories = [...new Set(services?.flatMap(({ categories }) => categories))]

    return categories?.filter(({ id }) => servicesCategories.includes(id))
  },
)

const $categoryFilters: ReadableAtom<Section[]> = batched(
  [$displayedCategories, $selectedCategory],
  (categories, selectedCategory) => {
    if (![...categories?.map(({ id }) => id.toString()) ?? [], defaultFilterKey].includes(selectedCategory))
      $selectedCategory.set(defaultFilterKey)

    return [
      {
        id: 'category',
        name: msg(str`Catégorie`),
        type: 'radio',
        items: [
          {
            key: defaultFilterKey,
            value: msg(str`Tous les services`),
            checked: defaultFilterKey === selectedCategory,
          },
          ...(categories?.map(({ id, name }) => {
            return {
              key: id.toString(),
              value: name,
              checked: id.toString() === selectedCategory,
            }
          })) ?? [],
        ],
      },
    ]
  },
)

const $infoEtabData: ReadableAtom<Partial<InfoEtabData> | undefined> = batched(
  [$organizations],
  (organizations) => {
    const { defaultOrgIconUrl, orgIconUrl } = $settings.get()
    if (!organizations)
      return undefined

    const {
      current: {
        displayName,
        source,
        logo,
        adress,
        mail,
        phone,
        website,
      },
    } = organizations
    return {
      'image-url': logo ? getDomainLink(logo) : undefined,
      'svg-url': orgIconUrl ?? defaultOrgIconUrl,
      'etab-name': displayName,
      'acad-name': source,
      'information': {
        [InformationItem.Adress]: {
          value: adress,
        },
        [InformationItem.Mail]: {
          value: mail,
          link: {
            href: `mailto:${mail}`,
          },
        },
        [InformationItem.Phone]: {
          value: phone,
          link: {
            href: `tel:${phone}`,
          },
        },
        [InformationItem.Website]: {
          value: website ? removeProtocol(website) : undefined,
          link: website
            ? {
                href: website,
              }
            : null,
        },
      },
    }
  },
)

$settings.listen(onDiff((diffs) => {
  const authenticated = $authenticated.get()
  const { fname } = $settings.get()
  if (diffs.has('userInfoApiUrl'))
    updateSoffit()
  if (authenticated && diffs.has('navigationDrawerVisible')) {
    if (diffs.get('navigationDrawerVisible') === true)
      document.body.classList.add('navigation-drawer-visible')
    else
      document.body.classList.remove('navigation-drawer-visible')
  }
  if (diffs.has('dnmaUrl'))
    DnmaService.init(diffs.get('dnmaUrl') as string | undefined, fname)
  if (diffs.has('scripts'))
    scriptLoaderService.load(diffs.get('scripts') as ScriptLoad[] | undefined)
  if (diffs.has('sessionApiUrl'))
    updateSession()
  if (diffs.has('notificationsRefreshDelay'))
    updateNotifications()
  updateFeatures()
}))

$soffit.listen(onDiff((diffs) => {
  if (!$authenticated.get())
    return

  const { orgAttributeName, userAllOrgsIdAttributeName } = $settings.get()
  let userInfoDiff = diffs.has('name')
  if (orgAttributeName)
    userInfoDiff = userInfoDiff || diffs.has(orgAttributeName)
  if (userAllOrgsIdAttributeName)
    userInfoDiff = userInfoDiff || diffs.has(userAllOrgsIdAttributeName)
  if (userInfoDiff)
    updateUserInfo()
}))

$userInfo.listen(onDiff((diffs) => {
  if (diffs.has('sub') || diffs.has('currentOrgId')) {
    $baseServicesLoad.set(LoadingState.UNLOADED)
    $baseServices.set(undefined)
    $services.set(undefined)
    $layout.set(undefined)
    $favoritesIds.set(undefined)
    $mediacentreFavoritesLoad.set(LoadingState.UNLOADED)
    $mediacentreFavorites.set(undefined)
    updateNotifications()
  }
  if (
    diffs.has('sub')
    || diffs.has('currentOrgId')
    || diffs.has('orgIds')
  ) {
    updateOrganization()
  }
}))

$organizations.listen(onDiff((diffs) => {
  const { uaiThemeMapping } = $settings.get()

  if (diffs.has('current') && uaiThemeMapping) {
    const theme: string | undefined = uaiThemeMapping[(diffs.get('current') as Organization)?.code]

    if (theme)
      updateTheme(theme)
  }
}))

$favoritesIds.listen(() => {
  if ($baseServicesLoad.value === LoadingState.LOADED)
    document.dispatchEvent(new CustomEvent('update-favorites'))
})

$mediacentreFavorites.listen(() => {
  if ($mediacentreFavoritesLoad.value === LoadingState.LOADED)
    document.dispatchEvent(new CustomEvent('update-mediacentre-favorites'))
})

$authenticated.listen((value) => {
  const { navigationDrawerVisible } = $settings.get()
  if (value) {
    if (navigationDrawerVisible === true)
      document.body.classList.add('navigation-drawer-visible')
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

  if (diffs.has('templateApiUrl')) {
    const template = await updateTemplate(
      diffs.get('templateApiUrl') as string | undefined,
      diffs.has('domain') ? diffs.get('domain') as string | undefined : $settings.get().domain,
    )
    $settings.set({
      ...$settings.get(),
      ...template?.config,
      orgIconUrl: template?.iconPath,
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
): Promise<Template | undefined> {
  if (!templateApiUrl || !domain)
    return

  const templates = await TemplateService.get(getDomainLink(templateApiUrl))
  if (!templates)
    return undefined

  const template = TemplateService.getCurrent(templates, domain)
  if (!template)
    return

  updateTheme(template.id)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Template', template)
  }
  return template
}

async function createPortalSession(): Promise<Soffit | undefined> {
  const { signInUrl, casUrl, userInfoApiUrl } = $settings.get()
  if (!signInUrl || !casUrl || !userInfoApiUrl)
    return

  const url = getDomainLink(casUrl) + getDomainLink(signInUrl)
  try {
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
    }).then(async () => {
      return await SoffitService.get(getDomainLink(userInfoApiUrl))
    })
  }
  catch (err) {
    console.error(err, url)
    return undefined
  }
}

async function updateSoffit(): Promise<void> {
  const { userInfoApiUrl } = $settings.get()
  if (!userInfoApiUrl)
    return

  let response = await SoffitService.get(getDomainLink(userInfoApiUrl))
  if (response) {
    if (!response.authenticated)
      response = await createPortalSession()
    else
      SoffitService.renew(updateSoffit)
  }

  $soffit.set(response)
  if ($debug.get()) {
    let complementary: object | undefined
    if (response) {
      complementary = {
        expire: new Date(response.exp * 1000).toLocaleString(),
      }
    }
    // eslint-disable-next-line no-console
    console.info('Soffit', response, complementary)
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
  const {
    organizationApiUrl,
    orgTypeAttributeName,
    orgLogoUrlAttributeName,
    orgPostalCodeAttributeName,
    orgStreetAttributeName,
    orgCityAttributeName,
    orgMailAttributeName,
    orgPhoneAttributeName,
    orgWebsiteAttributeName,
  } = $settings.get()
  const { orgIds, currentOrgId } = $userInfo.get() ?? {}
  if (!organizationApiUrl || !orgIds || !currentOrgId)
    return

  const response = await OrganizationService.get(
    getDomainLink(organizationApiUrl),
    orgIds,
    currentOrgId,
    orgTypeAttributeName ?? '',
    orgLogoUrlAttributeName ?? '',
    orgPostalCodeAttributeName ?? '',
    orgStreetAttributeName ?? '',
    orgCityAttributeName ?? '',
    orgMailAttributeName ?? '',
    orgPhoneAttributeName ?? '',
    orgWebsiteAttributeName ?? '',
  )
  $organizations.set(response)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Organization', response)
  }
}

async function updateServices(forceUpdate: boolean = false): Promise<void> {
  const { layoutApiUrl, portletApiUrl, servicesInfoApiUrl } = $settings.get()
  if (!layoutApiUrl || !portletApiUrl || !servicesInfoApiUrl)
    return

  if ($baseServicesLoad.get() === LoadingState.LOADING)
    return

  if (!forceUpdate && $services.get() !== undefined)
    return

  $baseServicesLoad.set(LoadingState.LOADING)
  const [servicesData, layout] = await Promise.all([
    ServicesService.get(getDomainLink(portletApiUrl), getDomainLink(servicesInfoApiUrl)),
    LayoutService.get(getDomainLink(layoutApiUrl)),
  ])
  const favoriteIds = layout
    ? [...new Set(FavoritesService.getFromLayout(layout)?.map(Number))]
    : undefined
  const { services, categories } = servicesData ?? {}

  $favoritesIds.set(favoriteIds)
  $baseServices.set(services?.sort((a, b) => alphaSort(a.name, b.name, 'asc')))
  $categories.set(categories?.sort((a, b) => alphaSort(a.name, b.name, 'asc')))
  $layout.set(layout)
  $baseServicesLoad.set(servicesData ? LoadingState.LOADED : LoadingState.ERROR)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Services', services)
    // eslint-disable-next-line no-console
    console.info('Categories', categories)
    // eslint-disable-next-line no-console
    console.info('Layout', layout)
  }
}

async function updateMediacentreFavorites(forceUpdate: boolean = false): Promise<void> {
  const {
    groupsApiUrl,
    mediacentreConfigUrl,
    mediacentreFavoriteApiUrl,
    mediacentrePortalFavoriteApiUrlGet,
    mediacentreRedirectUrlPattern,
  } = $settings.get()
  const soffit = $soffit.get()
  if (
    !soffit
    || !groupsApiUrl
    || !mediacentreConfigUrl
    || !mediacentreFavoriteApiUrl
    || !mediacentrePortalFavoriteApiUrlGet
    || !mediacentreRedirectUrlPattern
  ) {
    return
  }

  if ($mediacentreFavoritesLoad.get() === LoadingState.LOADING)
    return

  if (!forceUpdate && $mediacentreFavorites.get() !== undefined)
    return

  $mediacentreFavoritesLoad.set(LoadingState.LOADING)
  const mediacentreFavorites = await MediacentreService.getFavorites(
    soffit,
    getDomainLink(groupsApiUrl),
    getDomainLink(mediacentreConfigUrl),
    getDomainLink(mediacentreFavoriteApiUrl),
    getDomainLink(mediacentrePortalFavoriteApiUrlGet),
    mediacentreRedirectUrlPattern,
  )
  $mediacentreFavorites.set(mediacentreFavorites)
  $mediacentreFavoritesLoad.set(mediacentreFavorites ? LoadingState.LOADED : LoadingState.ERROR)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Mediacentre favorites', mediacentreFavorites)
  }
}

async function updateFavoritesFromFavorites(
  newValue: UpdatedFavoriteSection[],
): Promise<void> {
  const { favoriteApiUrl, mediacentrePortalFavoriteApiUrlPut } = $settings.get()

  newValue.forEach((section) => {
    const { id, deleted, items, orderHasChanged } = section
    const deletedIds = deleted.map(item => item.id)

    if (
      id === FavoriteSectionId.Services
      && (deletedIds.length > 0 || orderHasChanged)
      && favoriteApiUrl
    ) {
      deletedIds.forEach((id) => {
        FavoritesService.remove(getDomainLink(favoriteApiUrl), id)
      })
      const newFavoriteIds = items.map(item => Number(item.id))
      $favoritesIds.set(newFavoriteIds)
    }

    if (
      id === FavoriteSectionId.Mediacentre
      && (deletedIds.length > 0 || orderHasChanged)
      && mediacentrePortalFavoriteApiUrlPut
    ) {
      MediacentreService.putFavorites(getDomainLink(mediacentrePortalFavoriteApiUrlPut), items)
      $mediacentreFavorites.set(items)
    }
  })
}

async function addFavorite(id: number): Promise<void> {
  const { favoriteApiUrl } = $settings.get()
  const favoritesIds = $favoritesIds.get()
  if (!favoriteApiUrl)
    return

  if (favoritesIds && favoritesIds.findIndex(el => el === id) !== -1)
    return

  const response = await FavoritesService.add(getDomainLink(favoriteApiUrl), id)
  if (response)
    $favoritesIds.set([...(favoritesIds ?? []), id])
}

async function removeFavorite(id: number): Promise<void> {
  const { favoriteApiUrl } = $settings.get()
  const favoritesIds = $favoritesIds.get()
  if (!favoriteApiUrl || !favoritesIds)
    return

  const index = favoritesIds.findIndex(el => el === id)
  if (index === -1)
    return

  const response = await FavoritesService.remove(getDomainLink(favoriteApiUrl), id)
  if (response) {
    const newFavoritesIds = [...favoritesIds]
    newFavoritesIds.splice(index, 1)
    $favoritesIds.set(newFavoritesIds)
  }
}

async function updateSession(): Promise<void> {
  const { sessionApiUrl, sessionRenewDisable } = $settings.get()
  if (!sessionApiUrl || !!sessionRenewDisable)
    return

  const response = await SessionService.get(getDomainLink(sessionApiUrl))
  if (response?.isConnected)
    SessionService.renew(updateSession)

  if ($debug.get()) {
    let complementary: object | undefined
    if (response) {
      complementary = {
        expire: new Date(Date.now() + response.timeout).toLocaleString(),
      }
    }
    // eslint-disable-next-line no-console
    console.info('Session', response, complementary)
  }
}

async function updateNotifications(): Promise<void> {
  const {
    notificationsApiUrl,
    notificationsRefreshDelay,
  } = $settings.get()
  const soffit = $soffit.get()
  const {
    notifications: featNotifications,
  } = $features.get()
  if (
    notificationsRefreshDelay
    && notificationsRefreshDelay > 0
    && notificationsRefreshDelay !== NotificationService.timeoutDelay
  ) {
    NotificationService.timeoutDelay = notificationsRefreshDelay
  }
  if (!featNotifications || !soffit || !notificationsApiUrl)
    return

  const response = await NotificationService.getAll(
    soffit,
    getDomainLink(notificationsApiUrl),
  )
  if (response)
    NotificationService.refresh(updateNotifications)

  $notifications.set(response)
  if ($debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Notifications', response)
  }
}

function readNotifications(notifIds: string[]): void {
  let notifications = $notifications.get()
  if (!notifications)
    return

  notifications = notifications.map(
    (notif) => {
      return notifIds.includes(notif.notification.header.notificationId)
        ? { ...notif, read: true }
        : notif
    },
  )
  $notifications.set(notifications)
}

function deleteNotifications(notifIds: string[]): void {
  let notifications = $notifications.get()
  if (!notifications)
    return

  notifications = notifications.filter(
    notif => !notifIds.includes(notif.notification.header.notificationId),
  )
  $notifications.set(notifications ?? [])
}

function getNotifications(
  day: string,
  service?: string,
): Notif[] {
  const notifications = $notifications.get()
  if (!notifications)
    return []

  return notifications
    .filter((notif) => {
      const {
        createdAt,
        service: notificationService,
      } = notif.notification.header.eventHeader

      const notificationDay = createdAt.slice(0, 10)

      return (
        (!day || notificationDay === day)
        && (!service || notificationService === service)
      )
    })
}

function getNotificationsIds(
  day: string,
  service?: string,
): string[] {
  const notifications = $notifications.get()
  if (!notifications)
    return []

  return getNotifications(day, service)
    .map(notif => notif.notification.header.notificationId)
}

const renewSoffitAndSession = throttle(() => {
  if (!SoffitService.timeout) {
    if (!NotificationService.timeout)
      updateSoffit().then(() => updateNotifications())
    else
      updateSoffit()
  }
  else {
    if (!NotificationService.timeout)
      updateNotifications()
  }
  if (!SessionService.timeout)
    updateSession()
}, 5000)

function updateFeatures() {
  const {
    userInfoApiUrl,
    orgAttributeName,
    organizationApiUrl,
    notificationsApiUrl,
    disableInfoEtab,
    disableSearch,
    disableNotifications,
  } = $settings.get()
  const features = $features.get()
  const newFeatures: HeaderFeatures = {
    infoEtab: !disableInfoEtab
      && userInfoApiUrl !== undefined
      && orgAttributeName !== undefined
      && organizationApiUrl !== undefined,
    search: !disableSearch,
    notifications: !disableNotifications
      && notificationsApiUrl !== undefined,
  }

  const diffs = difference(newFeatures, features)
  if (diffs.size > 0) {
    $features.set(newFeatures)
    if ($debug.get()) {
    // eslint-disable-next-line no-console
      console.info('Features', newFeatures)
    }
  }
}

export {
  $authenticated,
  $baseServicesLoad,
  $categories,
  $categoryFilters,
  $debug,
  $favoriteMenu,
  $favorites,
  $features,
  $filteredServices,
  $groupedNotifications,
  $infoEtabData,
  $organizations,
  $searchQueryString,
  $searchResults,
  $searchResultServices,
  $selectedCategory,
  $services,
  $settings,
  $soffit,
  $unnreadNotifications,
  $userInfo,
  $userMenu,
  addFavorite,
  deleteNotifications,
  getNotificationsIds,
  readNotifications,
  removeFavorite,
  renewSoffitAndSession,
  updateFavoritesFromFavorites,
  updateMediacentreFavorites,
  updateNotifications,
  updateServices,
  updateSession,
  updateSettings,
  updateSoffit,
}
