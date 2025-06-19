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

| Nom          |   Type    | Obligatoire | Default | Description                                         |
| ------------ | :-------: | :---------: | :-----: | --------------------------------------------------- |
| `open`       | `boolean` |   `false`   | `false` | Affiche la bottom sheet                             |
| `no-close`   | `boolean` |   `false`   | `false` | Masque la croix en haut pour fermer la bottom sheet |
| `no-drag`    | `boolean` |   `false`   | `false` | Masque la barre en haut de la bottom sheet          |
| `no-padding` | `boolean` |   `false`   | `false` | Retire le padding de la bottom sheet                |

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
