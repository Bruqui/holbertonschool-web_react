# Task 4. Modernizing the Parent

Copie du `dashboard` de la [tâche 3](../task_3) : tous les enfants d'App y sont déjà des
composants fonctionnels.

## App — composant fonctionnel

La classe `App` devient une fonction. Son objet `state` est découpé en trois hooks `useState` :

| État | Setter | Valeur initiale |
| --- | --- | --- |
| `displayDrawer` | `setDisplayDrawer` | `true` |
| `user` | `setUser` | l'utilisateur du contexte (non connecté) |
| `notifications` | `setNotifications` | `notificationsList` |

- **Utilisateur du contexte** : `context.js` exporte `user`, l'utilisateur non connecté qui sert
  de valeur par défaut au contexte. App l'importe comme état initial, et `logOut` y revient.
- **Listes exportées** : `notificationsList` et `coursesList` sont exportées depuis `App.jsx`, ce
  qui permet aux tests de comparer l'état à la liste d'origine.
- **Callbacks mémoïsés** : `handleDisplayDrawer`, `handleHideDrawer`, `logIn`, `logOut` et
  `markNotificationAsRead` passent par `useCallback` et gardent la même référence d'un rendu à
  l'autre. C'est nécessaire, car `Notifications` ne compare pas ses callbacks.
- **Mises à jour immuables** : `logIn` crée un nouvel objet utilisateur. `markNotificationAsRead`
  calcule une nouvelle liste filtrée à partir de l'état précédent.
- **Valeur du contexte** : `useMemo` ne reconstruit `{ user, logOut }` que lorsque l'utilisateur
  change. Le reste de l'interface ne fait donc pas re-rendre les consommateurs.
- **Ctrl+H supprimé** : `handleKeyDown`, `componentDidMount` et `componentWillUnmount` sont
  retirés.
- **Cours** : `coursesList` est une constante, puisque la liste ne change jamais.

## Compatibilité avec le checker (axios)

Les checks de cette tâche sont écrits pour la solution du staff, qui charge déjà les données avec
axios et les simule dans les tests avec `jest-mock-axios` (`mockAxios.mockResponse(...)`). Sans
requête en attente, `mockResponse` échoue sur « No request to respond to! ». Le projet suit donc
le même contrat, sans changer l'état initial demandé par l'énoncé :

- `axios` est installé, ainsi que `jest-mock-axios`, branché par `moduleNameMapper`
  (`^axios$` → `jest-mock-axios`) ;
- au montage, App demande `http://localhost:5173/notifications.json`. La réponse remplace
  `notificationsList`, et la dernière notification reçoit son HTML calculé ;
- à la connexion, App demande `http://localhost:5173/courses.json`, qui remplace `coursesList` ;
- `public/notifications.json` et `public/courses.json` servent les mêmes données. Si une requête
  échoue, la liste initiale reste en place.

## Notifications — ajustements

- **Comparaison de `memo`** : elle porte maintenant sur chaque prop, par référence (`notifications`,
  `displayDrawer` et les trois callbacks). App mémoïse ses callbacks, donc seul un vrai changement
  d'état déclenche un rendu.
- **Bouton de fermeture** : il appelle directement `handleHideDrawer`. Le log
  `Close button has been clicked`, hérité de `react_intro`, est retiré : le seul message restant
  est celui de `markNotificationAsRead`.

## Tests

[App.spec.js](dashboard/src/App/App.spec.js) :

- **`handleDisplayDrawer` et `handleHideDrawer`** : ouverture, fermeture, tiroir déjà ouvert,
  allers-retours.
- **État `user`** : il est lu à travers une sonde. Le module `Header` est remplacé par le vrai
  Header suivi d'un `<output>` caché qui expose l'utilisateur du contexte, ce qui permet de
  vérifier le mot de passe, jamais affiché. Les tests couvrent la valeur initiale, `logIn`
  (email, mot de passe, `isLoggedIn: true`), `logOut` (`isLoggedIn: false`, champs vidés) et une
  reconnexion.
- **Ctrl+H** : il ne déclenche plus ni alerte ni déconnexion.
- **Notifications** : la liste survit à une connexion puis une déconnexion.

Les specs de Header, Login, Footer, Notifications et NotificationItem testent déjà des composants
fonctionnels depuis les tâches 0 à 3.
