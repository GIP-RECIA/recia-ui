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
import type { EmailApiResponse } from '../types/emailTypes.ts'

import type { Widget, WidgetItem } from '../types/widgetTypes.ts'
import { WidgetKey } from '../types/widgetTypes.ts'

async function get(
  url: string,
  soffit: string,
  timeout: number,
): Promise<EmailApiResponse> {
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
  response: EmailApiResponse,
): WidgetItem[] {
  const items: WidgetItem[] = []
  items.push(...response.messageSummaryForWidgetList.map((item) => {
    return {
      id: item.id,
      name: item.subject ?? 'I18N$emailSubjectNull$',
      description: undefined,
      icon: undefined,
      link: {
        href: `${config.global.context}/api/ExternalURLStats?fname=CourrielEleves&service=${encodeURIComponent(`/roundcubemail/?_task=mail&_caps=pdf=1,flash=0,tiff=0,webp=1&_uid=${item.id}&_mbox=${response.inbox}&_action=show`)}`,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      isNew: !item.read,
      dispatchEvents: [
        {
          type: 'click-portlet-card',
          detail: {
            fname: WidgetKey.EMAIL,
          },
        },
      ],
    }
  }))

  return items
}

async function getEmailWidget(
  config: Config,
  soffit: string,
): Promise<Partial<Widget>> {
  const response = await get(
    config.email.apiUri,
    soffit,
    config.global.timeout,
  )

  return {
    notifications: response.messageNotReadCount,
    items: getItems(config, response),
  }
}

export {
  getEmailWidget,
}
