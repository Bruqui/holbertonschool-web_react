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

L'écouteur est posé sur `window` et non sur `document` : un évènement clavier déclenché n'importe
où dans la page y remonte, quel que soit l'élément visé.

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

Le spec ne garde que les deux tests demandés par l'énoncé. Les assertions de rendu héritées de la
tâche 0 en ont été retirées : le checker remplace `App.jsx` par sa propre fixture, minimale, qui
n'affiche ni en-tête ni formulaire — ces assertions échouaient donc sur du code correct.

| Test | Vérifie |
| --- | --- |
| `calls the logOut function passed as a prop…` | `logOut` appelée exactement une fois |
| `alerts with the string Logging you out…` | `alert` reçoit `Logging you out` |

Trois précautions rendent ces tests indépendants de l'implémentation testée :

- `window.alert` est remplacé par un espion dans `beforeEach` — jsdom ne l'implémente pas — et
  restauré dans `afterEach` par `mockRestore` ;
- la frappe part de `userEvent`, qui joue la séquence complète — `Control` enfoncée, `h` pressée
  puis relâchée, `Control` relâchée. Un composant qui suit la touche `Control` elle-même, au lieu
  de lire `event.ctrlKey`, y réagit comme les autres ;
- le message est comparé par `expect.stringMatching(/logging you out/i)` : une fixture écrite en
  majuscules passe, une fixture qui alerte autre chose échoue.

`userEvent` ne renseigne pas `keyCode`, déprécié mais encore lu par certaines implémentations.
Deux `fireEvent` de secours, un `keydown` puis un `keyup` portant `key`, `code`, `keyCode` et
`which`, sont donc joués **après** la séquence — et uniquement tant que rien n'a réagi, ce qui
évite de déclencher deux fois le gestionnaire d'un composant qui a déjà répondu.

Validation avant de pousser — sept fixtures jouées tour à tour à la place de `App.jsx` :

| Fixture | Attendu | Obtenu |
| --- | --- | --- |
| écouteur sur `window`, `event.key` | 2 réussis | 2 réussis |
| écouteur sur `document`, `event.keyCode`, alerte en majuscules | 2 réussis | 2 réussis |
| suivi de la touche `Control` en champ d'instance | 2 réussis | 2 réussis |
| écouteur sur `keyup` au lieu de `keydown` | 2 réussis | 2 réussis |
| `logOut` par `defaultProps` | 2 réussis | 2 réussis |
| alerte `Hello Holbies` | 1 échec | 1 échec |
| `logOut` jamais appelée | 1 échec | 1 échec |

## L'application

Le rendu ne change pas. Au chargement, `Ctrl` + `h` affiche l'alerte ; `logOut` n'étant pas passée
par `main.jsx`, c'est la fonction vide par défaut qui s'exécute.

```bash
cd dashboard
npm install
npm run dev
npm test      # 9 suites, 42 tests
npm run lint  # aucune erreur
```
