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

import type { UserSummary } from '../types/pronoteTypes.ts'
import { SummaryItem } from '../types/pronoteTypes.ts'
import { alphaSort, slugify } from '../utils/stringUtils.ts'

export default class PronoteService {
  static async getSummary(
    pronoteApiUrl: string,
  ): Promise<UserSummary[] | undefined> {
    try {
      const response = await fetch(pronoteApiUrl, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow',
      })

      if (!response.ok)
        throw new Error(response.statusText)

      const summary: UserSummary[] = await response.json()

      return summary.map((userSummary) => {
        const slug: string = slugify(userSummary.displayName ?? 'DEFAULT')
        const items = Object.fromEntries(
          Object.entries(userSummary.items)
            .filter(([key, _]) => Object.values(SummaryItem).includes(key as SummaryItem))
            .sort((a, b) => alphaSort(a[0], b[0], 'asc')),
        ) as Record<SummaryItem, number>

        return { ...userSummary, slug, items }
      })
    }
    catch (err) {
      console.error(err, pronoteApiUrl)
      return undefined
    }
  }
}
