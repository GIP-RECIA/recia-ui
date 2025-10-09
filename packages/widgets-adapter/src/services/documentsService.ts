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

import type { Config } from '../types/configTypes.ts'
import type { PublisherApiResponse } from '../types/publisherTypes.ts'
import type { Widget, WidgetItem } from '../types/widgetTypes.ts'

async function getDocuments(
  url: string,
  soffit: string,
  timeout: number,
): Promise<PublisherApiResponse> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(timeout),
      headers: {
        Authorization: `Bearer ${soffit}`,
      },
    })

    if (!response.ok)
      throw new Error(response.statusText)

    return await response.json()
  }
  catch (error) {
    console.error(error, url)
    throw error
  }
}

function getItems(
  config: Config,
  response: PublisherApiResponse,
): WidgetItem[] {
  return response.map((item) => {
    return {
      id: item.article.guid.toString(),
      name: item.article.title,
      icon: '/images/portlet_icons/Documents.svg',
      dispatchEvents: [
        {
          type: config.publisher.eventName ?? '',
          detail: {
            uuid: item.uuid ?? '',
          },
        },
      ],
    }
  })
}

async function getDocumentsWidget(
  config: Config,
  soffit: string,
): Promise<Partial<Widget>> {
  const response = await getDocuments(
    config.publisher.resourcesUri,
    soffit,
    config.global.timeout,
  )

  return {
    items: getItems(config, response),
  }
}

export {
  getDocumentsWidget,
}
