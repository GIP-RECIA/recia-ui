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

export type PublisherApiResponse = PublisherItem[]

export interface PublisherItem {
  article: Article
  type: string
  creator: string
  pubDate: string
  createdDate: string
  modifiedDate: string
  uuid: string
  rubriques: number[]
  visibility: Visibility
  source: string
}

export interface Article {
  'title': string
  'link': string
  'enclosure': any
  'description': string
  'pubDate': string
  'guid': number
  'categories': string[]
  'files': File[]
  'dc:creator': string
  'dc:date': string
}

export interface File {
  uri: string
  fileName: string
  contentType: string
}

export interface Visibility {
  allowed: any[]
  autoSubscribed: any[]
  obliged: Obliged[]
}

export interface Obliged {
  regular: {
    attribute: string
    value: string
  }
}
