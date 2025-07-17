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

export default class breakpointsHelper {
  static gridBreakpoints: Map<string, number> = new Map([
    ['xs', 0],
    ['sm', 576],
    ['md', 768],
    ['lg', 992],
    ['xl', 1200],
    ['xxl', 1400],
  ])

  static getCurrentBreakpoint(): number {
    let breakpoint = 0
    for (const [_, value] of breakpointsHelper.gridBreakpoints.entries()) {
      if (window.innerWidth >= value)
        breakpoint = value
    }
    return breakpoint
  }

  static getBreakpoint(breakpoint: 'xs' | 'sm' | 'md' | 'ls' | 'xl' | 'xxL'): number {
    return breakpointsHelper.gridBreakpoints.get(breakpoint) ?? 0
  }
}
