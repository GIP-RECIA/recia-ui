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

import type { Link } from './linkType.ts'

export interface Widget {
  uid: string
  name: string
  subtitle?: string
  notifications?: number
  link?: Link
  items?: Array<WidgetItem>
  emptyIcon?: string
  emptyText?: string
  emptyDiscover?: boolean
  manage?: boolean
  deletable?: boolean
  noPrevious?: boolean
  noNext?: boolean
  loading?: boolean
  isError?: boolean
  errorMessage?: string
}

export interface WidgetItem {
  id: string
  name: string
  icon?: string
  link?: Link
  dispatchEvents?: { type: string, detail?: object }[]
}
