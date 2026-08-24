# Task 5. Enhance Notifications component

Reprise du `dashboard` de la [tâche 4](../task_4). Le panneau de notifications devient un tiroir
que l'on peut fermer, avec un titre toujours visible.

## `Notifications.jsx`

Deux props, toutes deux avec une valeur par défaut : `displayDrawer` (`false`) et `notifications`
(`[]`).

Le composant rend toujours un `div.notification-title` contenant `Your notifications`, placé juste
avant le conteneur `div.notification-items`. Ce qui suit dépend de l'état :

| `displayDrawer` | `notifications` | Rendu |
| --- | --- | --- |
| `false` | peu importe | le titre seul — pas de conteneur, pas de bouton, pas de liste |
| `true` | vide | le titre, puis le cadre contenant `No new notification for now` |
| `true` | non vide | le titre, puis le cadre avec le bouton de fermeture, `Here is the list of notifications` et les `NotificationItem` |

Les trois lignes correspondent respectivement à `displayDrawerFalse.png`,
`empty-notifications.png` et `displayDrawerTrue.png`.

Sur la maquette de l'état vide, le cadre ne contient **que** le texte : ni croix de fermeture, ni
titre de liste. Le rendu suit la maquette.

## `Notifications.css`

Le bloc reste ancré en haut à droite. Le titre est aligné à droite, au-dessus du cadre. Le cadre
passe d'un liseré tiré à un liseré **pointillé** rouge, plus fin, comme sur les maquettes, et la
liste garde ses puces — de la couleur de chaque notification, puisque `NotificationItem` pose la
couleur en style inline.

## `Notifications.spec.js`

Les tests sont regroupés par état :

- **`displayDrawer` à `false`** : ni bouton de fermeture, ni `p` « Here is the list… », ni `li`,
  et pas de conteneur `.notification-items` du tout. Un test vérifie aussi que c'est bien le
  comportement par défaut, sans la prop.
- **`displayDrawer` à `true`** : le bouton, le `p` et les 3 `li` avec leur texte et leur `type`,
  plus le `console.log` au clic hérité de `react_intro`.
- **`displayDrawer` à `true` et `notifications` vide** : le texte `No new notification for now`,
  et l'absence de liste.
- **Dans tous les cas** : le texte `Your notifications` est présent.

## L'application

`App` rend `<Notifications notifications={notificationsList} />` sans `displayDrawer` : le tiroir
est donc fermé au chargement, ce qui correspond à `displayDrawerFalse.png`. Pour voir les deux
autres états, passer `displayDrawer` dans `App.jsx`, puis vider `notificationsList`.

```bash
cd dashboard
npm install
npm run dev
npm test      # 9 suites, 47 tests
npm run lint  # aucune erreur
```
