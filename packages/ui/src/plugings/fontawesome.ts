/**
 * Copyright (C) 2023 GIP-RECIA, Inc.
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

import { dom, library } from '@fortawesome/fontawesome-svg-core'
import {
  faStar as farStar,
} from '@fortawesome/free-regular-svg-icons'
import {
  faArrowLeft,
  faArrowRight,
  faArrowRightFromBracket,
  faArrowRotateLeft,
  faBolt,
  faBullhorn,
  faChevronDown,
  faChevronUp,
  faCircleInfo,
  faEye,
  faEyeSlash,
  faGear,
  faHeart,
  faLockOpen,
  faPlay,
  faRightLeft,
  faStar,
  faStepForward,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

function register() {
  library.add(
    faArrowLeft,
    faArrowRight,
    faArrowRightFromBracket,
    faArrowRotateLeft,
    faBolt,
    faBullhorn,
    faChevronDown,
    faChevronUp,
    faCircleInfo,
    faEye,
    faEyeSlash,
    faGear,
    faHeart,
    faLockOpen,
    faPlay,
    faRightLeft,
    faStar,
    faStepForward,
    faXmark,
  )
  library.add(
    farStar,
  )

  dom.watch()
}

export { register }
