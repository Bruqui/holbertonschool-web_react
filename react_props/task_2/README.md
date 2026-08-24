# Task 2. Separation of Concerns

Reprise du `dashboard` de la [tâche 1](../task_1). Les données des notifications quittent le
composant qui les affiche : elles vivent désormais dans `App`, et descendent par `props`.

## Le flux de données

```
App  ──notifications──▶  Notifications  ──type / value / html──▶  NotificationItem
```

### `App.jsx`

Déclare `notificationsList`, trois objets à trois clés :

| `id` | `type` | `value` |
| --- | --- | --- |
| `1` | `default` | `'New course available'` |
| `2` | `urgent` | `'New resume available'` |
| `3` | `urgent` | `{ __html: getLatestNotification() }` |

Le tableau est passé à `<Notifications notifications={notificationsList} />`.

### `Notifications.jsx`

Accepte la prop `notifications`, **par défaut un tableau vide** : sans prop, le composant affiche
son titre et une liste vide au lieu de planter. Les `<li>` en dur sont remplacés par un `map` sur
`NotificationItem`, avec `id` comme `key`.

Le `map` accepte les deux formes de notification balisée — `html: { __html }` et
`value: { __html }` — et ne bascule sur `dangerouslySetInnerHTML` que dans ce cas ; une `value`
texte reste rendue comme du texte.

### `NotificationItem.jsx`

Rend un `<li>` avec `data-notification-type={type}`. Le contenu est conditionnel : `html` part
dans `dangerouslySetInnerHTML`, sinon c'est `value` qui est rendu comme texte. La couleur est
conditionnelle au `type` — rouge pour `urgent`, bleu sinon — en style inline. `type` vaut
`default` par défaut, donc un item sans prop se rend quand même.

Les règles `li[data-priority='default']` et `li[data-priority='urgent']` ont été retirées de
`Notifications.css` au profit de ce style inline.

## Tests

`NotificationItem.spec.js` vérifie les deux cas demandés — `li` bleu avec
`data-notification-type="default"`, `li` rouge avec `data-notification-type="urgent"` — plus le
rendu de `value` en texte, celui de `html` en balisage, et l'absence de crash sans prop.

`Notifications.spec.js` rend le composant avec la prop `notifications` et vérifie les 3 `li`,
le texte de chacun, leur `type`, le cas sans prop, ainsi que le titre et le bouton de fermeture
(dont le `console.log` au clic, hérité de `react_intro`).

## Rendu

Le design est identique à la tâche précédente : mêmes couleurs, mêmes textes. Ni erreur ni
warning en console, `npm run lint` est vert.

## Usage

```bash
cd dashboard
npm install
npm run dev
npm test
npm run lint
```
