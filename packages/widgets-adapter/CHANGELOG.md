# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.0.1](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/compare/widgets-to-endpoints-adapter/v2.0.0...widgets-to-endpoints-adapter/v2.0.1) (2025-10-01)


### Bug Fixes

* favorite order ([180bf85](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/180bf8508ae76bb81fa9480cffee34a61ea9149d))

## [2.0.0](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/compare/widgets-to-endpoints-adapter/v1.0.2...widgets-to-endpoints-adapter/v2.0.0) (2025-09-29)


### ⚠ BREAKING CHANGES

* use widgetHandlers for getting complementary widget information
* return available widgets in config
* remove unnecessary empty text
* change item event system
* remove unnecessary json transformation

### Features

* change item event system ([910d51c](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/910d51c1d43a2f9f6a9f1b23e6ce64df886bfb15))
* disable e-sidoc search button ([f288cff](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/f288cff7e9d60f25f8fe3fb5d749eff92e211a89))
* new esidoc presentation ([f2ceb7f](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/f2ceb7f463a018b8777fa7c62be8b6a5d6f2a94c))
* remove unnecessary empty text ([ffdd183](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/ffdd1834d36a201a9019a923dea70627b790e1c1))
* remove unnecessary json transformation ([adf844f](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/adf844f8b28b8d19c6c8b561f7f18f4df863281b))
* return available widgets in config ([9e55584](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/9e555849f3664f54dc1111f908a020726bc483e3))
* use fontawsome ([2928b69](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/2928b6943517e55caf98ce15a77cc2f04fbf828e))
* use same portlet service as header widget (except soffit) ([87e8329](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/87e8329e53473a7a7193e537094585a4f2c9cfb9))
* use widgetHandlers for getting complementary widget information ([e328ccc](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/e328cccd7c509eecde42f64ab20764435e9d9f95))


### Bug Fixes

* introduced bug due to refactor ([b623c3d](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/b623c3d04a357073e6bc63ca851e42a1a30aa12e))

## [1.0.2](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/compare/widgets-to-endpoints-adapter/v1.0.1...widgets-to-endpoints-adapter/v1.0.2) (2025-08-27)


### Features

* add default icon based on the fname for documents and mediacentre favorites ([5dc51ea](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/5dc51ea0f0dd4672f763e00b162fda730be0a428))


### Bug Fixes

* check undefined of iconUrl in getFavorisPortail ([91d684e](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/91d684ebbd7247337d02eefc8883ce9949582d69))
* remove icon tag from farovis, set item icon url without transformation ([0835464](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/0835464cfcc4539d2feb6093b42d125b6b871b86))
* use config value instead of litteral '/portail' ([6aa7e53](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/6aa7e536e4119a300969e12a440ac2a2fff6387c))

## 1.0.1 (2025-08-01)


### Features

* add conf fetching and keys by population fetching and add id to items ([40e7c96](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/40e7c96542488bc89a8b741fba0802b449e62848))
* add context to config global and use it in portletFromApiService ([b8f9a36](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/b8f9a3678736dec8eef32b4346dba7f4b4759ebe))
* add DNMA for portail service ([b6e5d7f](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/b6e5d7f0a4309414487f41f7544839957eb4b582))
* add dnma to mediacentre favoris ([28124a6](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/28124a699f5f171b283a9fe4b9373332b8f021d9))
* add dnma values for favoris and esidoc ([a0748ae](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/a0748ae8264e33ac51f618bd7f53992a634089fb))
* add empty discover to json creation ([e1bc876](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/e1bc876cb9acf1b4a06b43c139d35ab9e448eaee))
* add esidoc service ([c7b29fb](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/c7b29fb573bde6433bb76e1a6e17103f561ffa78))
* add events variable to Item and make Documents' Item fire events ([d975d3d](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/d975d3d992bd6f8114dbd64bd1357f73327ee802))
* add method to get all supported fnames/keys ([d80f537](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/d80f53769105a46c206466b00c5fe3175d6edc03))
* add optional target and rel in Item ([c36634c](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/c36634ca49381a2b1cb6568aa1250db8b9e409f9))
* add subtitle for esidoc ([5955eb7](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/5955eb77bd86be14fdb8a253e9bb6f0df79c8da7))
* create and expose WidgetAdapter ([5c54e86](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/5c54e865023070c1942a83136c0df5dec9ab5aec))
* create axiosUtils ([9dabbff](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/9dabbff20cb634d635d0f3a04b646c3c4529966d))
* create documentsPublisherService ([c910170](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/c9101709ee474bcf1b99987343e950b5abea3e96))
* create favorisMediacentreService and required classes ([f36fdf3](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/f36fdf38bf497fcbedd850de35f3fbb8f32e871f))
* create favorisPortailService ([e86fe77](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/e86fe774f8271287cb3d1c8208f9bcddfc9474b8))
* create Item class that will be returned ([5d0b5d3](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/5d0b5d31316170b0a4016ae43d3de7b8c0b761e7))
* create json with more informations for widgets ([40783aa](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/40783aa31a89c4ce55f164a9c8cf066556220236))
* encode resource names with special chars in B64 for redirection url ([05163f7](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/05163f71b4495e6d5c2bc8f00c2cd97618b313db))
* export functions in index.ts ([9a9e009](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/9a9e009ce3ce105800f92ba7d718bf8a9fb7c346))
* expose app version ([0eec8b6](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/0eec8b63d33aa03563e601799eeeae7ffd3fa154))
* fetch portletRegistry use it to filter allowed fname, and make favoris service use it ([fa0ae14](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/fa0ae1451210449f29073f0853d41d190b68277b))
* make soffit provided by caller, and json returned instead of an array ([675357e](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/675357e704b937882d92cffa1487127540911c25))


### Bug Fixes

* add missing env var ([34fb2a2](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/34fb2a23e2b30d4044097be497546d3ed26fcb02))
* add target and rel for mediacentre links to force opening in new tab ([ab37a5d](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/ab37a5dcd0f71a8390f278aef2fc4f63d240d4ca))
* fix async of getAllNames, use allowed keys from entpersonprofils to filter ([1463313](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/146331306f3c3181f6ed755cdd1069c89a43b94a))
* fix context uri interpolation ([4de8f32](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/4de8f32af415ae25653e8745abef6732952ea2e8))
* fix portlet url ([00bce2c](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/00bce2c5f9a80f93b50de2450783393b1b70aec6))
* get correct uri for portal favorites and corresponding target and rel ([f1afa3f](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/f1afa3fa234a88ddec1c8d9b3e4d0a35beb96abb))
* remove dev var from prod env ([ee9c666](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/ee9c6663cffeeddca37751393bc60085701adb05))
* remove string tag interpolation from Item constructor ([ed685f0](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/ed685f0b1f31a440f622d018ac09d3f93c8cb32f))
* remove temp test keys from enum ([d558e6d](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/d558e6d9f7609032a6f2924415729cabe1a5f8c1))
* remove unused var from env ([132f796](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/132f79627cb147850d1da52c2092a209e51828eb))
* rename documents key to new fname ([89994aa](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/89994aaea012393bc8b11bbf2bb48bf992f89312))
* replace icon uri with html svg tag in json produced ([f71b298](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/f71b298a34f263973f01fe7f6d31814243ca542a))

## 1.0.0 (2025-08-01)


### Features

* add conf fetching and keys by population fetching and add id to items ([40e7c96](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/40e7c96542488bc89a8b741fba0802b449e62848))
* add context to config global and use it in portletFromApiService ([b8f9a36](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/b8f9a3678736dec8eef32b4346dba7f4b4759ebe))
* add DNMA for portail service ([b6e5d7f](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/b6e5d7f0a4309414487f41f7544839957eb4b582))
* add dnma to mediacentre favoris ([28124a6](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/28124a699f5f171b283a9fe4b9373332b8f021d9))
* add dnma values for favoris and esidoc ([a0748ae](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/a0748ae8264e33ac51f618bd7f53992a634089fb))
* add empty discover to json creation ([e1bc876](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/e1bc876cb9acf1b4a06b43c139d35ab9e448eaee))
* add esidoc service ([c7b29fb](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/c7b29fb573bde6433bb76e1a6e17103f561ffa78))
* add events variable to Item and make Documents' Item fire events ([d975d3d](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/d975d3d992bd6f8114dbd64bd1357f73327ee802))
* add method to get all supported fnames/keys ([d80f537](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/d80f53769105a46c206466b00c5fe3175d6edc03))
* add optional target and rel in Item ([c36634c](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/c36634ca49381a2b1cb6568aa1250db8b9e409f9))
* add subtitle for esidoc ([5955eb7](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/5955eb77bd86be14fdb8a253e9bb6f0df79c8da7))
* create and expose WidgetAdapter ([5c54e86](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/5c54e865023070c1942a83136c0df5dec9ab5aec))
* create axiosUtils ([9dabbff](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/9dabbff20cb634d635d0f3a04b646c3c4529966d))
* create documentsPublisherService ([c910170](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/c9101709ee474bcf1b99987343e950b5abea3e96))
* create favorisMediacentreService and required classes ([f36fdf3](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/f36fdf38bf497fcbedd850de35f3fbb8f32e871f))
* create favorisPortailService ([e86fe77](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/e86fe774f8271287cb3d1c8208f9bcddfc9474b8))
* create Item class that will be returned ([5d0b5d3](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/5d0b5d31316170b0a4016ae43d3de7b8c0b761e7))
* create json with more informations for widgets ([40783aa](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/40783aa31a89c4ce55f164a9c8cf066556220236))
* encode resource names with special chars in B64 for redirection url ([05163f7](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/05163f71b4495e6d5c2bc8f00c2cd97618b313db))
* export functions in index.ts ([9a9e009](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/9a9e009ce3ce105800f92ba7d718bf8a9fb7c346))
* expose app version ([0eec8b6](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/0eec8b63d33aa03563e601799eeeae7ffd3fa154))
* fetch portletRegistry use it to filter allowed fname, and make favoris service use it ([fa0ae14](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/fa0ae1451210449f29073f0853d41d190b68277b))
* make soffit provided by caller, and json returned instead of an array ([675357e](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/675357e704b937882d92cffa1487127540911c25))


### Bug Fixes

* add missing env var ([34fb2a2](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/34fb2a23e2b30d4044097be497546d3ed26fcb02))
* add target and rel for mediacentre links to force opening in new tab ([ab37a5d](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/ab37a5dcd0f71a8390f278aef2fc4f63d240d4ca))
* fix async of getAllNames, use allowed keys from entpersonprofils to filter ([1463313](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/146331306f3c3181f6ed755cdd1069c89a43b94a))
* fix context uri interpolation ([4de8f32](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/4de8f32af415ae25653e8745abef6732952ea2e8))
* fix portlet url ([00bce2c](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/00bce2c5f9a80f93b50de2450783393b1b70aec6))
* get correct uri for portal favorites and corresponding target and rel ([f1afa3f](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/f1afa3fa234a88ddec1c8d9b3e4d0a35beb96abb))
* remove dev var from prod env ([ee9c666](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/ee9c6663cffeeddca37751393bc60085701adb05))
* remove string tag interpolation from Item constructor ([ed685f0](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/ed685f0b1f31a440f622d018ac09d3f93c8cb32f))
* remove temp test keys from enum ([d558e6d](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/d558e6d9f7609032a6f2924415729cabe1a5f8c1))
* remove unused var from env ([132f796](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/132f79627cb147850d1da52c2092a209e51828eb))
* rename documents key to new fname ([89994aa](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/89994aaea012393bc8b11bbf2bb48bf992f89312))
* replace icon uri with html svg tag in json produced ([f71b298](https://github.com/GIP-RECIA/widgets-to-endpoints-adapter/commit/f71b298a34f263973f01fe7f6d31814243ca542a))
