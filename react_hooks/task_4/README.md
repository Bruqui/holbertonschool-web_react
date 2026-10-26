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

- **Utilisateur du contexte** : App lit l'utilisateur par défaut avec `useContext(newContext)`.
  App est placé hors de son propre Provider, le hook renvoie donc la valeur par défaut. `logOut`
  revient à cet utilisateur.
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
