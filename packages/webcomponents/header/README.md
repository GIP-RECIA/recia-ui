# r-header

- [r-header](#r-header)
  - [Propriétés](#propriétés)
  - [Architecture](#architecture)
    - [Imbrications des composants](#imbrications-des-composants)

## Propriétés

| Nom                               |           Type           | Obligatoire |          Default           | Description                                                                                               |
| --------------------------------- | :----------------------: | :---------: | :------------------------: | --------------------------------------------------------------------------------------------------------- |
| `messages`                        |       `LangRef[]`        |   `false`   |        `undefined`         |                                                                                                           |
| `domain`                          |         `string`         |   `false`   | `window.location.hostname` | Domaine du portail                                                                                        |
| `default-org-logo-url`            |         `string`         |   `false`   |        `undefined`         | Logo par défaut d'une organisation                                                                        |
| `default-org-icon-url`            |         `string`         |   `false`   |        `undefined`         | Icône par défaut de l'organisation                                                                        |
| `default-avatar-url`              |         `string`         |   `false`   |        `undefined`         | Avatar par défaut                                                                                         |
| `context-api-url`                 |         `string`         |   `false`   |   `VITE_PORTAL_BASE_URL`   | URL/path du portail                                                                                       |
| `favorite-api-url`                |         `string`         |   `false`   |        `undefined`         | URL/path de l'API favori du portail                                                                       |
| `layout-api-url`                  |         `string`         |   `false`   |        `undefined`         | URL/path de l'API layout du portail                                                                       |
| `portlet-api-url`                 |         `string`         |   `false`   |        `undefined`         | URL/path de l'API portlet registry du portail                                                             |
| `organization-api-url`            |         `string`         |   `false`   |        `undefined`         | URL/path de l'API organisation                                                                            |
| `user-info-api-url`               |         `string`         |   `false`   |        `undefined`         | URL/path de l'API informations utilisateur du portail                                                     |
| `session-api-url`                 |         `string`         |   `false`   |        `undefined`         | URL/path de l'API session du portail                                                                      |
| `template-api-url`                |         `string`         |   `false`   |        `undefined`         | URL/path de l'API template                                                                                |
| `template-api-path`               |         `string`         |   `false`   |        `undefined`         | @deprecated rempli la variable `template-api-url`                                                         |
| `sign-out-url`                    |         `string`         |   `false`   |        `undefined`         | URL/path de connexion au portail                                                                          |
| `sign-in-url`                     |         `string`         |   `false`   |        `undefined`         | URL/path de déconnexion du portail                                                                        |
| `cas-url`                         |         `string`         |   `false`   |        `undefined`         | URL/path du serveur d'authentification CAS                                                                |
| `user-info-portlet-url`           |         `string`         |   `false`   |        `undefined`         | URL/path de la portlet d'informations utilisateur                                                         |
| `switch-org-api-url`              |         `string`         |   `false`   |        `undefined`         | URL/path de la portlet de changement d'organisation                                                       |
| `switch-org-portlet-url`          |         `string`         |   `false`   |        `undefined`         | URL/path de l'API de changement d'organisation                                                            |
| `user-org-id-attribute-name`      |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant l'organisation courante de l'utilisateur                           |
| `user-all-orgs-id-attribute-name` |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant la liste des organisations de l'utilisateur                        |
| `org-type-attribute-name`         |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le type de l'organisation courante de l'utilisateur                |
| `org-logo-url-attribute-name`     |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le logo de l'organisation courante de l'utilisateur                |
| `org-postal-code-attribute-name`  |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le code postal de l'organisation courante de l'utilisateur         |
| `org-street-attribute-name`       |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant la rue de l'organisation courante de l'utilisateur                 |
| `org-city-attribute-name`         |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant la ville de l'organisation courante de l'utilisateur               |
| `org-mail-attribute-name`         |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le mail de l'organisation courante de l'utilisateur                |
| `org-phone-attribute-name`        |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le numéro de téléphone de l'organisation courante de l'utilisateur |
| `org-website-attribute-name`      |         `string`         |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le site web de l'organisation courante de l'utilisateur            |
| `disable-session-renew`           |        `boolean`         |   `false`   |          `false`           | Désactive le renouvellement des sessions portail                                                          |
| `portlet-info-api-url`            |         `string`         |   `false`   |        `undefined`         | URL/path de l'API portlet du portail                                                                      |
| `service-info-api-url`            |         `string`         |   `false`   |        `undefined`         | URL/path de l'API d'information sur le service                                                            |
| `services-info-api-url`           |         `string`         |   `false`   |        `undefined`         | URL/path de l'API d'information sur les services                                                          |
| `category-class-mapping`          | `Record<number, string>` |   `false`   |        `undefined`         | Associe une classe à l'id d'une catégorie                                                                 |
| `uai-theme-mapping`               | `Record<string, string>` |   `false`   |        `undefined`         | Force un thème en fonction de l'UAI                                                                       |
| `dnma-url`                        |         `string`         |   `false`   |        `undefined`         | URL/path du script de marquage DNMA                                                                       |
| `fname`                           |         `string`         |   `false`   |        `undefined`         | fname du service dans lequel le composant est intégré                                                     |
| `drawer-items`                    |      `DrawerItem[]`      |   `false`   |        `undefined`         | Ressources supplémentaires du tiroir de navigation                                                        |
| `navigation-drawer-visible`       |        `boolean`         |   `false`   |          `false`           | Affiche le tiroir de navigation (écran > md)                                                              |
| `home-page`                       |        `boolean`         |   `false`   |          `false`           | Met le lien accueil du tiroir de navigation en actif                                                      |
| `starter`                         |        `boolean`         |   `false`   |          `false`           | Active le bouton "didacticiel" dans le menu utilisateur                                                   |
| `cache-buster-version`            |         `string`         |   `false`   |        `undefined`         | Version permettant le bypass des caches navigateurs                                                       |
| `debug`                           |        `boolean`         |   `false`   |          `false`           | Active le mode debug                                                                                      |

## Architecture

### Imbrications des composants

- r-header : [Source](./src/index.ts)
  - r-navigation-drawer : [Source](./src/components/navigation-drawer/index.ts) | [Doc](./docs/r-navigation-drawer.md)
    - r-favorite-dropdown : [Source](./src/components/favorite/dropdown/index.ts) | [Doc](./docs/r-favorite-dropdown.md)
      - r-favorite-layout : [Source](./src/components/favorite/layout/index.ts) | [Doc](./docs/r-favorite-layout.md)
    - r-favorite-bottom-sheet : [Source](./src/components/favorite/bottom-sheet/index.ts) | [Doc](./docs/r-favorite-bottom-sheet.md)
      - r-bottom-sheet : [Source](../bottom-sheet/src/index.ts) | [Doc](../bottom-sheet/README.md)
      - r-favorite-layout : [Source](./src/components/favorite/layout/index.ts) | [Doc](./docs/r-favorite-layout.md)
  - r-principal-container : [Source](./src/components/principal-container/index.ts) | [Doc](./docs/r-principal-container.md)
    - r-info-etab-dropdown-info : [Source](./src/components/info-etab/dropdown-info/index.ts) | [Doc](./docs/r-info-etab-dropdown-info.md)
      - r-dropdown-info : [Source](../dropdown-info/src/index.ts) | [Doc](../dropdown-info/README.md)
      - r-info-etab-layout : [Source](./src/components/info-etab/layout/index.ts) | [Doc](./docs/r-info-etab-layout.md)
    - r-search : [Source](./src/components/search/index.ts) | [Doc](./docs/r-search.md)
    - r-user-menu : [Source](./src/components/user-menu/index.ts) | [Doc](./docs/r-user-menu.md)
  - r-services-layout : [Source](./src/components/services-layout/index.ts) | [Doc](./docs/r-services-layout.md)
    - r-filters : [Source](../filters/src/index.ts) | [Doc](../filters/README.md)
    - r-service : [Source](./src/components/service/index.ts) | [Doc](./docs/r-service.md)
  - r-service-info-bottom-sheet : [Source](./src/components/service-info/bottom-sheet/index.ts) | [Doc](./docs/r-service-info-bottom-sheet.md)
    - r-bottom-sheet : [Source](../bottom-sheet/src/index.ts) | [Doc](../bottom-sheet/README.md)
    - r-service-info-layout : [Source](./src/components/service-info/layout/index.ts) | [Doc](./docs/r-service-info-layout.md)
  - r-change-etab-bottom-sheet : [Source](./src/components/change-etab-bottom-sheet/index.ts) | [Doc](./docs/r-change-etab-bottom-sheet.md)
    - r-bottom-sheet : [Source](../bottom-sheet/src/index.ts) | [Doc](../bottom-sheet/README.md)
  - r-info-etab-bottom-sheet : [Source](./src/components/info-etab/bottom-sheet/index.ts) | [Doc](./docs/r-info-etab-bottom-sheet.md)
    - r-bottom-sheet : [Source](../bottom-sheet/src/index.ts) | [Doc](../bottom-sheet/README.md)
    - r-info-etab-layout : [Source](./src/components/info-etab/layout/index.ts) | [Doc](./docs/r-info-etab-layout.md)
