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

import oidc from '@uportal/open-id-connect'
import { CustomError } from '../classes/CustomError'

// let soffit: JWT

async function getToken(apiUrl: string): Promise<string> {
  const { encoded, decoded } = await oidc({
    userInfoApiUrl: apiUrl,
  })
  if (decoded.sub.startsWith('guest')) {
    throw new CustomError('You are not logged', 401)
  }
  return encoded
}

export { getToken }
