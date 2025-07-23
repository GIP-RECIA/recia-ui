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

import type {
  HeaderProperties,
  Organizations,
  Service,
  Soffit,
  UserInfo,
  UserMenuConfig,
} from '../types/index.ts'
import { atom, computed } from 'nanostores'
import OrganizationService from '../services/organizationService.ts'
import SoffitService from '../services/soffitService.ts'
import TemplateService from '../services/templateService.ts'
import UserInfoService from '../services/userInfoService.ts'
import { UserMenuItem } from '../types/index.ts'
import { difference } from '../utils/objectUtils.ts'
import { onDiff } from '../utils/storeUtils.ts'

const settings = atom<Partial<HeaderProperties>>({
  contextApiUrl: import.meta.env.VITE_PORTAL_BASE_URL,
  domain: window.location.hostname,
})

const soffit = atom<Soffit | undefined>()

const userInfo = atom<UserInfo | undefined>()

const organization = atom<Organizations | undefined>()

const services = atom<Array<Service> | undefined>()

const debug = computed(settings, (newValue) => {
  return newValue.debug ?? false
})

const userMenu = computed([userInfo, settings], (userInfoObject, settingsObject) => {
  if (!userInfoObject || !settingsObject)
    return undefined

  const { displayName, picture, hasOtherOrgs } = userInfoObject
  const { defaultAvatarUrl, userInfoPortletUrl, signOutUrl } = settingsObject

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

settings.listen(onDiff((diffs) => {
  if (diffs.has('userInfoApiUrl'))
    updateSoffit()
}))

soffit.listen(onDiff((diffs) => {
  if (
    diffs.has('name')
    || diffs.has('picture')
    || diffs.has('ESCOSIRENCourant')
    || diffs.has('ESCOSIREN')
  ) {
    updateUserInfo()
  }
}))

userInfo.listen(onDiff((diffs) => {
  if (diffs.has('orgIds') || diffs.has('currentOrgId'))
    updateOrganization()
}))

async function updateSettings(newValue: Partial<HeaderProperties>): Promise<void> {
  const diffs = difference(newValue, settings.get())
  if (diffs.size === 0)
    return

  if (diffs.has('templateApiUrl')) {
    const config = await updateTemplate(
      diffs.get('templateApiUrl') as string | undefined,
      diffs.get('domain') as string | undefined ?? settings.get().domain,
    )
    settings.set({
      ...settings.get(),
      ...config,
      ...newValue,
    })
  }
  else {
    settings.set({
      ...settings.get(),
      ...newValue,
    })
  }
  if (debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Settings', settings.get())
  }
}

async function updateTemplate(templateApiUrl: string | undefined, domain: string | undefined): Promise<Partial<HeaderProperties> | undefined> {
  if (!templateApiUrl || !domain)
    return

  const template = await TemplateService.get(templateApiUrl, domain)
  if (debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Template', template)
  }
  return template?.config
}

async function updateSoffit(): Promise<void> {
  const { userInfoApiUrl } = settings.get()

  if (!userInfoApiUrl)
    return

  const response = await SoffitService.get(userInfoApiUrl)
  soffit.set(response)
  if (debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Soffit', response)
  }
}

function updateUserInfo(): void {
  const { orgAttributeName, userAllOrgsIdAttributeName } = settings.get()
  const soffitObject = soffit.get()

  if (!soffitObject || !orgAttributeName || !userAllOrgsIdAttributeName)
    return

  const response = UserInfoService.getFromSoffit(soffitObject, orgAttributeName, userAllOrgsIdAttributeName)
  userInfo.set(response)
  if (debug.get()) {
    // eslint-disable-next-line no-console
    console.info('UserInfo', response)
  }
}

async function updateOrganization(): Promise<void> {
  const { organizationApiUrl, userAllOrgsIdAttributeName } = settings.get()
  const soffitObject = soffit.get()
  const { orgIds, currentOrgId } = userInfo.get() ?? {}

  if (!soffitObject || !organizationApiUrl || !userAllOrgsIdAttributeName || !orgIds || !currentOrgId)
    return

  const response = await OrganizationService.get(
    soffitObject,
    organizationApiUrl,
    orgIds,
    currentOrgId,
    'otherAttributes.ESCOStructureLogo[0]',
  )
  organization.set(response)
  if (debug.get()) {
    // eslint-disable-next-line no-console
    console.info('Organization', response)
  }
}

export {
  debug,
  organization,
  services,
  settings,
  soffit,
  updateSettings,
  userInfo,
  userMenu,
}
