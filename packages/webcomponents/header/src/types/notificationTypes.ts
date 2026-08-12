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

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { Service } from './serviceTypes.ts'
import {
  faExclamationCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
import { cssPrefix } from 'common/config.js'

export interface Notif {
  notification: {
    content: {
      link: string
      message: string
      title: string
    }
    header: {
      eventHeader: {
        channels: string[]
        createdAt: string
        eventId: string
        priority: Priority
        service: string
      }
      notificationId: string
      userId: string
    }
  }
  read: boolean
  service?: Pick<
    Service,
    'name'
    | 'iconUrl'
    | 'link'
  >
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

export const priorityMap: Record<
  Priority,
  {
    color: string
    icon: IconDefinition
  }
> = {
  [Priority.LOW]: {
    color: `var(--${cssPrefix}basic-black-lighter)`,
    icon: faInfoCircle,
  },
  [Priority.NORMAL]: {
    color: `var(--${cssPrefix}system-blue)`,
    icon: faInfoCircle,
  },
  [Priority.HIGH]: {
    color: `var(--${cssPrefix}system-red)`,
    icon: faExclamationCircle,
  },
}
