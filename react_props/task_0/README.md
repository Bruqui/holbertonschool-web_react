# Task 0. Basic components

Reprise du `dashboard` de la dernière tâche de `react_intro`. Le contenu de `App.jsx` est éclaté
en trois composants fonctionnels — `Header`, `Login` et `Footer` — et `App` devient la coquille
qui les assemble.

## Découpage

| Composant | JSX déplacé depuis `App.jsx` | CSS déplacé depuis `App.css` |
| --- | --- | --- |
| `Header` | `div.App-header` (logo + `h1`) | `.App-header`, `.App-header img`, `.App-header h1` |
| `Login` | `div.App-body` (formulaire) | `.App-body`, `.App-body p` |
| `Footer` | `div.App-footer` (copyright) | `.App-footer`, `.App-footer p` |

`App.css` ne conserve que la règle globale `body`. Les noms de classe sont inchangés, donc le
rendu de la page est strictement identique à celui de la tâche précédente.

## Arborescence

```
dashboard/
└── src/
    ├── App/
    │   ├── App.css
    │   ├── App.jsx
    │   └── App.spec.js
    ├── Footer/
    │   ├── Footer.css
    │   ├── Footer.jsx
    │   └── Footer.spec.js
    ├── Header/
    │   ├── Header.css
    │   ├── Header.jsx
    │   └── Header.spec.js
    ├── Login/
    │   ├── Login.css
    │   ├── Login.jsx
    │   └── Login.spec.js
    ├── Notifications/
    ├── assets/
    ├── utils/
    └── main.jsx
```

`App.jsx` importe `Notifications`, `Header`, `Login` et `Footer`, et les rend dans cet ordre à
l'intérieur d'un `<Fragment>`.

## Tests

`Header.spec.js`, `Login.spec.js` et `Footer.spec.js` vérifient que chaque composant se rend sans
planter. `App.spec.js` continue de vérifier le rendu complet de la coquille.

```bash
cd dashboard
npm install
npm test
```
