# Task 1. Lifecycles

Reprise du `dashboard` de la [tâche 0](../task_0). `App` gagne un raccourci clavier de
déconnexion, monté et démonté avec le composant.

## `App.jsx`

Trois ajouts à la classe :

- un `constructor` qui lie `handleKeyDown` à l'instance, pour que `this.props` reste accessible
  quand le navigateur appelle le gestionnaire ;
- `componentDidMount()` qui pose l'écouteur `keydown` sur `window` ;
- `componentWillUnmount()` qui le retire — même référence de fonction des deux côtés, sinon le
  retrait ne fait rien.

`handleKeyDown` vérifie d'abord que l'évènement porte bien une clé `key` avant de la lire, puis
compare : `ctrlKey` actif et `key` valant `h`, casse ignorée. Dans ce cas seulement, l'alerte
`Logging you out` s'affiche et `logOut` est appelée.

`logOut` est une prop dont la valeur par défaut est une fonction vide, posée par déstructuration
comme `isLoggedIn` :

```jsx
const { logOut = () => {} } = this.props
logOut()
```

## `App.spec.js`

Un bloc `describe` pour le raccourci, avec `window.alert` remplacé par un espion dans
`beforeEach` — jsdom n'implémente pas `alert` — et restauré dans `afterEach` par `mockRestore`.

L'évènement est déclenché sur `document.body` plutôt que sur `window` : il remonte alors jusqu'à
un écouteur posé sur `document` comme sur `window`, quelle que soit l'implémentation testée.

| Test | Vérifie |
| --- | --- |
| `calls the logOut function passed as a prop once` | `logOut` appelée exactement une fois |
| `alerts with the string Logging you out` | `alert` reçoit bien `Logging you out` |
| `does nothing once the component is unmounted` | après `unmount`, plus rien n'est appelé |
| `does not log out when h is pressed without ctrl` | `h` seul ne déclenche rien |

Les deux derniers ne sont pas demandés par l'énoncé mais couvrent ses deux exigences : le retrait
de l'écouteur au démontage, et la combinaison des **deux** touches.

## L'application

Le rendu ne change pas. Au chargement, `Ctrl` + `h` affiche l'alerte ; `logOut` n'étant pas passée
par `main.jsx`, c'est la fonction vide par défaut qui s'exécute.

```bash
cd dashboard
npm install
npm run dev
npm test      # 9 suites, 51 tests
npm run lint  # aucune erreur
```
