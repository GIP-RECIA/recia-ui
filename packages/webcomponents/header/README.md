# r-header

- [r-header](#r-header)
  - [Propriétés](#propriétés)
  - [Architecture](#architecture)
    - [Imbrications des composants](#imbrications-des-composants)

## Propriétés

| Nom                               |      Type      | Obligatoire |          Default           | Description                                                                                               |
| --------------------------------- | :------------: | :---------: | :------------------------: | --------------------------------------------------------------------------------------------------------- |
| `messages`                        |  `LangRef[]`   |   `false`   |        `undefined`         |                                                                                                           |
| `domain`                          |    `string`    |   `false`   | `window.location.hostname` | Domaine du portail                                                                                        |
| `default-org-logo-url`            |    `string`    |   `false`   |        `undefined`         | Logo par défaut d'une organisation                                                                        |
| `default-org-icon-url`            |    `string`    |   `false`   |        `undefined`         | Icône par défaut de l'organisation                                                                        |
| `default-avatar-url`              |    `string`    |   `false`   |        `undefined`         | Avatar par défaut                                                                                         |
| `context-api-url`                 |    `string`    |   `false`   |   `VITE_PORTAL_BASE_URL`   | URL/path du portail                                                                                       |
| `favorite-api-url`                |    `string`    |   `false`   |        `undefined`         | URL/path de l'API favori du portail                                                                       |
| `layout-api-url`                  |    `string`    |   `false`   |        `undefined`         | URL/path de l'API layout du portail                                                                       |
| `portlet-api-url`                 |    `string`    |   `false`   |        `undefined`         | URL/path de l'API portlet registry du portail                                                             |
| `organization-api-url`            |    `string`    |   `false`   |        `undefined`         | URL/path de l'API organisation                                                                            |
| `user-info-api-url`               |    `string`    |   `false`   |        `undefined`         | URL/path de l'API informations utilisateur du portail                                                     |
| `session-api-url`                 |    `string`    |   `false`   |        `undefined`         | URL/path de l'API session du portail                                                                      |
| `template-api-url`                |    `string`    |   `false`   |        `undefined`         | URL/path de l'API template                                                                                |
| `template-api-path`               |    `string`    |   `false`   |        `undefined`         | @deprecated rempli la variable `template-api-url`                                                         |
| `sign-out-url`                    |    `string`    |   `false`   |        `undefined`         | URL/path de connexion au portail                                                                          |
| `sign-in-url`                     |    `string`    |   `false`   |        `undefined`         | URL/path de déconnexion du portail                                                                        |
| `cas-url`                         |    `string`    |   `false`   |        `undefined`         | URL/path du serveur d'authentification CAS                                                                |
| `user-info-portlet-url`           |    `string`    |   `false`   |        `undefined`         | URL/path de la portlet d'informations utilisateur                                                         |
| `switch-org-api-url`              |    `string`    |   `false`   |        `undefined`         | URL/path de la portlet de changement d'organisation                                                       |
| `switch-org-portlet-url`          |    `string`    |   `false`   |        `undefined`         | URL/path de l'API de changement d'organisation                                                            |
| `user-org-id-attribute-name`      |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant l'organisation courante de l'utilisateur                           |
| `user-all-orgs-id-attribute-name` |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant la liste des organisations de l'utilisateur                        |
| `org-type-attribute-name`         |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le type de l'organisation courante de l'utilisateur                |
| `org-logo-url-attribute-name`     |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le logo de l'organisation courante de l'utilisateur                |
| `org-postal-code-attribute-name`  |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le code postal de l'organisation courante de l'utilisateur         |
| `org-street-attribute-name`       |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant la rue de l'organisation courante de l'utilisateur                 |
| `org-city-attribute-name`         |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant la ville de l'organisation courante de l'utilisateur               |
| `org-mail-attribute-name`         |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le mail de l'organisation courante de l'utilisateur                |
| `org-phone-attribute-name`        |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le numéro de téléphone de l'organisation courante de l'utilisateur |
| `org-website-attribute-name`      |    `string`    |   `false`   |        `undefined`         | Attribut de l'API organisation donnant le site web de l'organisation courante de l'utilisateur            |
| `disable-session-renew`           |   `boolean`    |   `false`   |          `false`           | Désactive le renouvellement des sessions portail                                                          |
| `portlet-info-api-url`            |    `string`    |   `false`   |        `undefined`         | URL/path de l'API portlet du portail                                                                      |
| `service-info-api-url`            |    `string`    |   `false`   |        `undefined`         | URL/path de l'API d'information sur le service                                                            |
| `services-info-api-url`           |    `string`    |   `false`   |        `undefined`         | URL/path de l'API d'information sur les services                                                          |
| `dnma-url`                        |    `string`    |   `false`   |        `undefined`         | URL/path du script de marquage DNMA                                                                       |
| `fname`                           |    `string`    |   `false`   |        `undefined`         | fname du service dans lequel le composant est intégré                                                     |
| `drawer-items`                    | `DrawerItem[]` |   `false`   |        `undefined`         | Ressources supplémentaires du tiroir de navigation                                                        |
| `navigation-drawer-visible`       |   `boolean`    |   `false`   |          `false`           | Affiche le tiroir de navigation (écran > md)                                                              |
| `home-page`                       |   `boolean`    |   `false`   |          `false`           | Met le lien accueil du tiroir de navigation en actif                                                      |
| `starter`                         |   `boolean`    |   `false`   |          `false`           | Active le bouton "didacticiel" dans le menu utilisateur                                                   |
| `cache-buster-version`            |    `string`    |   `false`   |        `undefined`         | Version permettant le bypass des caches navigateurs                                                       |
| `debug`                           |   `boolean`    |   `false`   |          `false`           | Active le mode debug                                                                                      |

## Architecture

### Imbrications des composants

- [r-header](./src/index.ts)
  - [r-navigation-drawer](./src/components/navigation-drawer/index.ts)
    - [r-favorite-dropdown](./src/components/favorite/dropdown/index.ts)
      - [r-favorite-layout](./src/components/favorite/layout/index.ts)
    - [r-favorite-bottom-sheet](./src/components/favorite/bottom-sheet/index.ts)
      - [r-bottom-sheet](../bottom-sheet/src/index.ts)
      - [r-favorite-layout](./src/components/favorite/layout/index.ts)
  - [r-principal-container](./src/components/principal-container/index.ts)
    - [r-info-etab-dropdown-info](./src/components/info-etab/dropdown-info/index.ts)
      - [r-dropdown-info](../dropdown-info/src/index.ts)
      - [r-info-etab-layout](./src/components/info-etab/layout/index.ts)
    - [r-search](./src/components/search/index.ts)
    - [r-user-menu](./src/components/user-menu/index.ts)
  - [r-services-layout](./src/components/services-layout/index.ts)
    - [r-filters](../filters/src/index.ts)
    - [r-service](./src/components/service/index.ts)
  - [r-service-info-bottom-sheet](./src/components/service-info/bottom-sheet/index.ts)
    - [r-bottom-sheet](../bottom-sheet/src/index.ts)
    - [r-service-info-layout](./src/components/service-info/layout/index.ts)
  - [r-change-etab-bottom-sheet](./src/components/change-etab-bottom-sheet/index.ts)
    - [r-bottom-sheet](../bottom-sheet/src/index.ts)
  - [r-info-etab-bottom-sheet](./src/components/info-etab/bottom-sheet/index.ts)
    - [r-bottom-sheet](../bottom-sheet/src/index.ts)
    - [r-info-etab-layout](./src/components/info-etab/layout/index.ts)
