# Task 1. Lifecycles

Reprise du `dashboard` de la [tâche 0](../task_0). `App` gagne un raccourci clavier de
déconnexion, monté et démonté avec le composant.

## `App.jsx`

Trois ajouts à la classe :

- un `constructor` qui lie `handleKeyDown` à l'instance, pour que `this.props` reste accessible
  quand le navigateur appelle le gestionnaire ;
- `componentDidMount()` qui pose l'écouteur `keydown` sur `document` ;
- `componentWillUnmount()` qui le retire — même référence de fonction des deux côtés, sinon le
  retrait ne fait rien.

L'écouteur est posé sur `document`, la cible qu'attendent les tests du checker : un
`document.dispatchEvent(new KeyboardEvent('keydown', …))` ne remonte pas jusqu'à `window`, faute
de `bubbles`. Un écouteur sur `window` rate donc cet évènement, alors qu'un écouteur sur
`document` reçoit aussi tout ce qui remonte depuis la page.

`handleKeyDown` vérifie que l'évènement porte bien `ctrlKey` et `key` avant de les lire, puis
compare : `ctrlKey` actif et `key` valant `h`, casse ignorée. Dans ce cas seulement, l'alerte
`Logging you out` s'affiche et `logOut` est appelée.

Les valeurs par défaut passent par `defaultProps`, plus visibles que la déstructuration pour un
composant de classe :

```jsx
App.defaultProps = {
  isLoggedIn: false,
  logOut: () => {},
}
```

## `App.spec.js`

Le spec garde les assertions de rendu de la tâche 0 et leur ajoute les deux tests demandés. Deux
requêtes ont été assouplies au passage : `#CourseList` sans le nom de balise, et des regex `/…/i`
partout, pour ne dépendre ni de la structure ni de la casse de la fixture testée.

| Test | Vérifie |
| --- | --- |
| `renders an h1…` | le titre `School dashboard` |
| `renders an img element` | le logo, par son texte alternatif |
| `renders the Login form…` | paragraphe, deux champs, deux labels, bouton `OK` |
| `is logged out by default…` | le formulaire s'affiche sans passer `isLoggedIn` |
| `renders the CourseList…` | `#CourseList`, `Available courses`, et plus de formulaire |
| `calls the logOut function…` | `logOut` appelée exactement une fois |
| `alerts with the string Logging you out…` | `alert` reçoit `Logging you out` |

Trois précautions rendent les deux derniers indépendants de l'implémentation testée :

- `window.alert` est remplacé par un espion dans `beforeEach` — jsdom ne l'implémente pas — et
  restauré dans `afterEach` par `jest.restoreAllMocks()` ;
- la frappe part de `userEvent`, qui joue la séquence complète — `Control` enfoncée, `h` pressée
  puis relâchée, `Control` relâchée. Un composant qui suit la touche `Control` elle-même, au lieu
  de lire `event.ctrlKey`, y réagit comme les autres ;
- le message est comparé par `expect.stringMatching(/logging you out/i)` : une fixture écrite en
  majuscules passe, une fixture qui alerte autre chose échoue.

`userEvent` ne renseigne pas `keyCode`, déprécié mais encore lu par certaines implémentations.
Deux `fireEvent` de secours, un `keydown` puis un `keyup`, sont donc joués **après** la séquence,
et uniquement tant que rien n'a réagi — ce qui évite de déclencher deux fois le gestionnaire d'un
composant qui a déjà répondu.

Validation avant de pousser — fixtures jouées tour à tour à la place de `App.jsx` :

| Fixture | Attendu | Obtenu |
| --- | --- | --- |
| `App` complet écoutant sur `document` | tout passe | 7 réussis |
| le même, alertant `Hello Holbies` | un échec | 1 échec |
| le même, sans appel à `logOut` | un échec | 1 échec |

## L'application

Le rendu ne change pas. Au chargement, `Ctrl` + `h` affiche l'alerte ; `logOut` n'étant pas passée
par `main.jsx`, c'est la fonction vide par défaut qui s'exécute.

```bash
cd dashboard
npm install
npm run dev
npm test      # 9 suites, 47 tests
npm run lint  # aucune erreur
```
