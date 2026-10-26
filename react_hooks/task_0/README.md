# Task 0. Convert Header Component

Reprise du `dashboard` de [react_state/task_4](../../react_state/task_4).

## Header — composant fonctionnel

La classe `Header` et son `static contextType` laissent place à une fonction qui lit le contexte
par le hook `useContext(newContext)`. Le JSX est inchangé :

- logo Holberton et titre **School Dashboard** ;
- quand `user.isLoggedIn` est vrai, une section `#logoutSection` affiche
  `Welcome <email> (logout)` ;
- un clic sur **logout** empêche la navigation et appelle `logOut` du contexte.

Hors de tout Provider, le hook renvoie la valeur par défaut du contexte : un visiteur non connecté,
donc pas de section de déconnexion.

## Tests

[Header.spec.js](dashboard/src/Header/Header.spec.js) vérifie que `Header` est une fonction et non
une classe, le logo, le titre, l'absence de la section avec le contexte par défaut, son affichage
pour un utilisateur connecté, et l'appel de `logOut` au clic.
