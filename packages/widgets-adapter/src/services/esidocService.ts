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
import type { EsidocApiResponse } from '../types/esidocTypes.ts'
import type { Widget, WidgetItem } from '../types/widgetTypes.ts'
import {
  faExclamationTriangle,
  faHourglassHalf,
  // faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { WidgetKey } from '../types/widgetTypes.ts'
import { getIconWithStyle } from '../utils/fontawesomeUtils.ts'

async function get(
  url: string,
  soffit: string,
  timeout: number,
): Promise<EsidocApiResponse> {
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
  response: EsidocApiResponse,
): WidgetItem[] {
  const items: WidgetItem[] = []
  // const buttonSearch: WidgetItem = {
  //   id: 'search-button',
  //   name: 'I18N$Rechercher$',
  //   icon: getIconWithStyle(faMagnifyingGlass, [], ['icon']),
  //   dispatchEvents: [
  //     {
  //       type: 'openSearchEsidoc',
  //     },
  //   ],
  // }
  // items.push(buttonSearch)
  items.push(...response.itemForResponseList.map((item) => {
    return {
      id: item.permalien,
      name: `${item.titre}`,
      description: `I18N$returnDate$${new Date(item.dateRetour).toLocaleDateString()}`,
      icon: item.retard
        ? getIconWithStyle(faExclamationTriangle, [], ['icon', 'warn'])
        : getIconWithStyle(faHourglassHalf, [], ['icon']),
      link: {
        href: `${config.global.context}/api/ExternalURLStats?fname=ESIDOC&service=${item.permalien}`,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      dispatchEvents: [
        {
          type: 'click-portlet-card',
          detail: {
            fname: WidgetKey.ESIDOC,
          },
        },
      ],
    }
  }))

  return items
}

async function getEsidocWidget(
  config: Config,
  soffit: string,
): Promise<Partial<Widget>> {
  const response = await get(
    config.esidoc.apiUri,
    soffit,
    config.global.timeout,
  )

  return {
    subtitle: response.itemForResponseList.length === 0
      ? undefined
      : `I18N$loan${response.itemForResponseList.length > 1 ? 's' : ''}$${response.itemForResponseList.length}`,
    notifications: response.itemForResponseList.filter(({ retard }) => retard).length,
    items: getItems(config, response),
  }
}

export {
  getEsidocWidget,
}
