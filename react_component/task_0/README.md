# Task 0. Switch to class components

Reprise du `dashboard` de la [dernière tâche de `react_props`](../../react_props/task_5). Seul
`App` change : la fonction devient une classe React.

## `App.jsx`

`Component` est importé depuis `react`, à côté de `Fragment`. La fonction `App` devient
`class App extends Component`, et tout ce qu'elle retournait passe dans `render()`.

Les props ne sont plus un paramètre : elles se lisent sur `this.props`. La valeur par défaut de
`isLoggedIn` reste `false`, posée par déstructuration en tête de `render()` plutôt que par
`defaultProps`, dépréciée côté fonction et inutile ici.

```jsx
class App extends Component {
  render() {
    const { isLoggedIn = false } = this.props
    // ...
  }
}
```

`notificationsList` et `coursesList` restent des constantes de module : elles ne dépendent pas des
props et n'ont donc rien à faire dans la classe.

## Ce qui ne change pas

Le rendu est identique, à l'élément près : le tiroir de notifications, `Header`, le corps qui
bascule entre `Login` et `CourseList` selon `isLoggedIn`, puis `Footer`. Les autres composants
restent fonctionnels, et `App.spec.js` n'est pas touché — un composant de classe et un composant
fonctionnel se testent de la même façon avec Testing Library.

```bash
cd dashboard
npm install
npm run dev
npm test      # 9 suites, 47 tests
npm run lint  # aucune erreur
```
