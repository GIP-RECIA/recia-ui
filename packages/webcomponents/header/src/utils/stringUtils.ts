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

import type { TemplateResult } from 'lit'
import { html } from 'lit'

function slugify(value: string): string {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalize(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function alphaSort(a: string, b: string, order: 'asc' | 'desc'): 0 | 1 | -1 {
  const normalizedA = normalize(a)
  const normalizedB = normalize(b)

  if (normalizedA === normalizedB)
    return 0

  if (order === 'asc')
    return normalizedA > normalizedB ? 1 : -1
  else
    return normalizedA < normalizedB ? 1 : -1
}

function truncate(value: string): string {
  return value.split('   ')[0].trim()
}

function sanitize(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '_').trim()
}

function getAcronym(value: string): string {
  return value
    .split(/[\s,']+/)
    .map((word) => {
      return word.length >= 4 || word !== word.toLowerCase()
        ? word.split('')[0].toUpperCase()
        : ''
    })
    .join('')
}

function hashCode(value: string): string {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    hash = (hash << 5) - hash + code
    hash = hash & hash
  }

  return hash.toString()
}

function highlight(text: string, searchTerm: string): TemplateResult {
  if (!searchTerm)
    return html`${text}`

  const normalizedText = normalize(text)
  const normalizedSearch = normalize(searchTerm)

  const parts: (string | TemplateResult)[] = []
  let lastIndex = 0

  let index = normalizedText.indexOf(normalizedSearch)
  while (index !== -1) {
    if (index > lastIndex)
      parts.push(text.slice(lastIndex, index))

    const matched = text.slice(index, index + searchTerm.length)
    parts.push(html`<strong>${matched}</strong>`)

    lastIndex = index + searchTerm.length
    index = normalizedText.indexOf(normalizedSearch, lastIndex)
  }

  if (lastIndex < text.length)
    parts.push(text.slice(lastIndex))

  return html`${parts}`
}

export {
  alphaSort,
  getAcronym,
  hashCode,
  highlight,
  normalize,
  sanitize,
  slugify,
  truncate,
}
