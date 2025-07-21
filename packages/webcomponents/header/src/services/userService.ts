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

import type { Soffit } from '../types/SoffitType.ts'
import type { User } from '../types/UserType.ts'
import { get } from 'lodash-es'

export default class UserService {
  static getFromSoffit(
    soffit: Soffit,
    orgIdAttribute: string,
    orgIdsAttribute: string,
  ): User | undefined {
    const { name, picture, email } = soffit

    const userInfo: User = {
      displayName: name,
      picture,
      email,
      currentOrgId: get(soffit, orgIdAttribute) as string,
      orgIds: get(soffit, orgIdsAttribute, []) as Array<string>,
      hasOtherOrgs: (get(soffit, orgIdsAttribute, []) as Array<string>).length > 1,
    }

    if (!userInfo.displayName || !userInfo.currentOrgId) {
      console.info('Missing user information')
      return undefined
    }
    else {
      return userInfo
    }
  }
}
