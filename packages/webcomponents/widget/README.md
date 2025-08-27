- [r-widget](#r-widget)

# r-widget

Propriétés disponibles :

| Nom | Type  | Obligatoire | Default | Description |
| --- | :---: | :---------: | :-----: | ----------- |
| `uid`  |  `string`   |     `non`      |       |  `identifiant unique propre au widget`  |
| `name`  |  `string`   |     `non`      |       |  `nom d'affichage du widget`  |
| `subtitle`  |  `string`   |     `non`      |       |  `nom secondaire d'affichage du widget`  |
| `notifications`  |  `string`   |     `non`      |       |  `nombre de notifications à afficher sur la pastille notification du widget`  |
| `link`  |  `string`   |     `non`      |       |  `url sur lequel le widget redirige lorsque l'on clique sur son titre`  |
| `items`  |  `Item[]`   |     `non`      |       |  `liste des objets items à afficher`  |
| `empty-icon`  |  `string`   |     `non`      |   `icône faInfoCircle`    |       `icône affiché lors qu'il n'y a pas d'items à afficher`      |
| `empty-text`  |  `string`   |     `non`      |   `Aucun élément`    |       `texte affiché lors qu'il n'y a pas d'items à afficher`      |
| `empty-discover`  |  `boolean`   |     `non`      |   `false`    |       `est ce que le corps du widget propose de rediriger vers le service s'il n'y à rien à afficher`      |
| `manage`  |  `boolean`   |     `non`      |   `false`    |       `est ce que l'utilisateur est en train d'éditer ses widgets`      |
| `deletable`  |  `boolean`   |     `non`      |   `false`    |       `est ce que l'utilisateur a le droit de supprimer ce widget`      |
| `noPrevious`  |  `boolean`   |     `non`      |   `false`    |       `est ce que ce widget est le widget affiché en premier`      |
| `noNext`  |  `boolean`   |     `non`      |   `false`    |       `est ce que ce widget est le widget affiché en dernier`      |
| `loading`  |  `boolean`   |     `non`      |   `false`    |       `est ce qu'il faut afficher le skeleton car les données sont encore en train de charger`      |
| `isError`  |  `boolean`   |     `non`      |   `false`    |       `est ce qu'une erreur est survenue lors de l'obtention des données du widget`      |
| `errorMessage`  |  `string`   |     `non`      |   `false`    |       `texte affiché lorsque le widget est en erreur`      |
