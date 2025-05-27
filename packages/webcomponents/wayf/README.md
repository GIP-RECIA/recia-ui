- [r-wayf](#r-wayf)

# r-wayf

Propriétés disponibles :

| Nom       |      Type       | Obligatoire |        Default        | Description                                          |
| --------- | :-------------: | :---------: | :-------------------: | ---------------------------------------------------- |
| `cas-url` |    `string`     |    `non`    |      `undefined`      | URL de connexion au serveur CAS                      |
| `idp-ids` | `Array<string>` |    `non`    |      `undefined`      | Identifiants des fournisseurs d'identité disponibles |
| `svg-url` |    `string`     |    `non`    | `/wayf.spritemap.svg` | URL pour récupérer la spritemap des svg              |

<br>

```html
<r-wayf
  cas-url=""
  idp-ids='[""]'
  svg-url=""
>
</r-wayf>
```
