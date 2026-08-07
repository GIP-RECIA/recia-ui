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

import { get } from 'lodash-es'
import { allLocales, sourceLocale } from '../generated/locale-codes'

export interface LangRef {
  locales: string[]
  messages: {
    [section: string]: {
      [translation: string]: string
    }
  }
}

export default class langHelper {
  private static locale = 'en'
  private static reference: LangRef[]

  static setLocale(lang: string): void {
    this.locale = lang
  }

  static setReference(ref: LangRef[]): void {
    this.reference = ref
  }

  static getBrowserLocales(options = {}): string[] {
    const defaultOptions = {
      languageCodeOnly: true,
      defaultLanguage: sourceLocale,
    }

    const opt = {
      ...defaultOptions,
      ...options,
    }

    const browserLocales
      = navigator.languages === undefined
        ? [navigator.language]
        : navigator.languages

    if (!browserLocales) {
      return [opt.defaultLanguage]
    }

    return browserLocales.map((locale) => {
      const trimmedLocale = locale.trim()

      return opt.languageCodeOnly
        ? trimmedLocale.split(/-|_/)[0]
        : trimmedLocale
    })
  }

  static getPageLang(options = {}): string {
    const defaultOptions = {
      languageCodeOnly: true,
      availableLanguages: allLocales as unknown as string[],
      defaultLanguage: sourceLocale,
    }

    const opt = {
      ...defaultOptions,
      ...options,
    }

    const pageLang = document.documentElement.lang
    let allLangs: string[] = []
    if (pageLang) {
      allLangs = opt.languageCodeOnly ? [pageLang.split(/-|_/)[0]] : [pageLang]
    }
    else {
      const fOpts = {
        languageCodeOnly: opt.languageCodeOnly,
        defaultLanguage: opt.defaultLanguage,
      }
      allLangs = this.getBrowserLocales(fOpts)
    }

    const detectedLocale = allLangs.find(x =>
      opt.availableLanguages.includes(x),
    )

    return detectedLocale || opt.defaultLanguage
  }

  static localTranslation(stringId: string, defaultString: string): string {
    const currentRef = this.reference?.find(ref =>
      ref.locales.includes(this.locale),
    )
    const currentMessages = currentRef?.messages
    return currentMessages
      ? get(currentMessages as unknown, stringId, defaultString)
      : defaultString
  }
}
