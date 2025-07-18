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

export default class textHelper {
  static truncate(string: string): string {
    if (string) {
      const text = string.split('   ');
      return text[0].trim();
    }
    return string;
  }
  static sanitize(string: string): string {
    if (string) {
      string = string.replace(/[^a-z0-9]/gim, '_');
      return string.trim();
    }
    return string;
  }

  static getAcronym(str: string): string {
    return str
      .split(/[\s,']+/)
      .map((word) => {
        return word.length >= 4 || word != word.toLowerCase()
          ? word.split('')[0].toUpperCase()
          : '';
      })
      .join('');
  }

  static hashCode(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      hash = (hash << 5) - hash + code;
      hash = hash & hash;
    }
    return hash.toString();
  }
}
