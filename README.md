# recia-ui

Regroupement des éléments d'interface utilisateur (UI) utilisé dans l'ENT du GIP RECIA.

- [recia-ui](#recia-ui)
  - [Projets 🗒️](#projets-️)
    - [app-mobile](#app-mobile)
    - [ui](#ui)
    - [ui-web-webcomponents](#ui-web-webcomponents)
    - [web-components](#web-components)
    - [widgets-adapter](#widgets-adapter)
  - [Prérequis 🚨](#prérequis-)
  - [Configuration 🧰](#configuration-)

## Projets 🗒️

### [app-mobile](./packages/app-mobile/)

Pages web de l'[application mobile](https://github.com/GIP-RECIA/Application-mobile-POC).

### [ui](./packages/ui/)

Intégrations des maquettes et styles utilisé globalement.

### [ui-web-webcomponents](./packages/ui-webcomponents/)

Paquet publié sur npm (`@gip-recia/ui-webcomponents`) et webjar contenant les fichiers compilés de chaque composant web.

### [web-components](./packages/webcomponents/)

Composants web de l'UI ENT du GIP RECIA.

⚠️ Certains composants sont dépendants du [portail](https://github.com/GIP-RECIA/uPortal-start) pour fonctionner.

### [widgets-adapter](./packages/widgets-adapter/)

Script qui sert d'intermédiaire entre le composant web [r-widgets-wrapper](./packages/webcomponents/widgets-wrapper) et des API.

## Prérequis 🚨

- [nvm](https://github.com/nvm-sh/nvm)
- [docker](https://www.docker.com)
- make

## Configuration 🧰

Le projet dispose d'un makefile listant les commandes disponnibles.
