- [r-widgets-wrapper](#r-widgets-wrapper)

# r-widgets-wrapper

Propriétés disponibles :

| Nom | Type  | Obligatoire | Default | Description |
| --- | :---: | :---------: | :-----: | ----------- |
| `adapter-source-uri`  |  `string`   |     `oui`      |       |       `uri du script qui sert d'intermédiaire entre ce composant et les API`      |
| `adapter-config-uri`  |  `string`   |     `oui`      |       |       `uri du JSON qui permet de configurer l'adaptateur`      |
| `localization-uri`  |  `string`   |     `oui`      |       |       `uri du JSON de localisation`      |
| `widget-max-count`  |  `number`   |     `non`      |   `3`   |       `nombre maximum de widgets à afficher`      |
| `soffit-uri`  |  `string`   |     `oui`      |       |       `uri de la soffit`      |
| `get-prefs-uri`  |  `string`   |     `oui`      |       |       `uri pour lire les favoris du portail concernant les widgets`      |
| `put-prefs-uri`  |  `string`   |     `oui`      |       |       `uri pour écrire les favoris du portail concernant les widgets`      |

<br>

```html
  <r-widgets-wrapper
    localization-uri="${localizationUri[0]}"
    soffit-uri="${soffitUri[0]}"
    widget-max-count="${widgetMaxCount[0]}"
    get-prefs-uri="${getPrefsUri[0]}"
    put-prefs-uri="${putPrefsUri[0]}"
    adapter-source-uri="${adapterSourceUri[0]}"
    adapter-config-uri="${adapterConfigUri[0]}"
  >
  </r-widgets-wrapper>
```
