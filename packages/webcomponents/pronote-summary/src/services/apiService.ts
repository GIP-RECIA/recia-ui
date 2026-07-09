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

import type { SummaryResponse } from '../types/pronoteSummaryType'

export async function getSummary(url: string, timeout: number): Promise<SummaryResponse> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
      signal: AbortSignal.timeout(timeout),
      redirect: 'follow',
    })

    if (response.ok) {
      const json = (await response.json()) as SummaryResponse

      return json
    }
    else {
      throw new Error('Fetch exception: invalid json')
    }
  }
  catch (e: unknown) {
    if (e instanceof Error) {
      throw e
    }
    throw new Error(String(e))
  }
}
