- [r-eyebrow](#r-eyebrow)
  - [Propriétés](#propriétés)

# r-eyebrow

## Propriétés

| Nom            |                 Type                  | Obligatoire | Default | Description                                                                                                                                                  |
| -------------- | :-----------------------------------: | :---------: | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `picture`      |               `string`                |   `false`   |  `''`   | Avatar de l'utilisateur                                                                                                                                      |
| `display-name` |               `string`                |   `false`   |  `''`   | Nom de l'utilisateur                                                                                                                                         |
| `function`     |               `string`                |   `false`   |  `''`   | Fonction de l'utilisateur                                                                                                                                    |
| `config`       | [`string`](./src/types/ConfigType.ts) |   `false`   |  `{}`   | Configuration en JSON passé en string. Permet de définir la configuration de chaque [item](./src/types/ItemType.ts) du menu (l'ordre n'as pas d'importance). |
| `notification` |               `number`                |   `false`   |   `0`   | Nombre de notifications                                                                                                                                      |
| `avatar-size`  |               `string`                |   `false`   |  `''`   | Taille de l'avatar (ne pas oublier d'utiliser un unité).                                                                                                     |
