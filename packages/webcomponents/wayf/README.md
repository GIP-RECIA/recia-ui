- [r-wayf](#r-wayf)
  - [Propriétés](#propriétés)

# r-wayf

## Propriétés

| Nom       |                      Type                      | Obligatoire |        Default        | Description                                                                  |
| --------- | :--------------------------------------------: | :---------: | :-------------------: | ---------------------------------------------------------------------------- |
| `cas-url` |                    `string`                    |   `false`   |      `undefined`      | URL de connexion au serveur CAS                                              |
| `idp-ids` | [`Array<IdpId>`](./src/types/IdpIdType.ts) |   `false`   |         `[]`          | Identifiants des fournisseurs d'identité disponibles (l'ordre est important) |
| `svg-url` |                    `string`                    |   `false`   | `/wayf.spritemap.svg` | URL pour récupérer la spritemap des svg                                      |
