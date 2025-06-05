- [r-bottom-sheet](#r-bottom-sheet)
  - [Propriétés](#propriétés)
  - [Méthodes](#méthodes)
    - [`open`](#open)
      - [Paramètres](#paramètres)
      - [Retour](#retour)
    - [`close`](#close)
      - [Paramètres](#paramètres-1)
      - [Retour](#retour-1)

# r-bottom-sheet

## Propriétés

| Nom          |   Type    | Obligatoire | Default | Description                                          |
| ------------ | :-------: | :---------: | :-----: | ---------------------------------------------------- |
| `open`       | `boolean` |   `false`   | `false` | Affiche la bottom sheet                              |
| `close-icon` | `boolean` |   `false`   | `false` | Ajoute une croix en haut pour fermer la bottom sheet |
| `drag-icon`  | `boolean` |   `false`   | `false` | Ajoute une barre en haut de la bottom sheet          |
| `no-padding` | `boolean` |   `false`   | `false` | Retire le padding de la bottom sheet                 |

## Méthodes

### `open`

#### Paramètres

`e`: Event (*optionnel*)

Annule le comportement par défaut et sa proppagation.

#### Retour

Aucun

### `close`

#### Paramètres

`e`: Event (*optionnel*)

Annule le comportement par défaut et sa proppagation.

#### Retour

Aucun
