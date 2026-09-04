# Task 6. Declare a pure component

Reprise du `dashboard` de la [tâche 4](../task_4). Un seul changement de production :
`NotificationItem` devient pur.

## `NotificationItem.jsx`

`class NotificationItem extends PureComponent` au lieu de `Component`. React compare alors
superficiellement props et état avant chaque rendu, et saute celui-ci quand rien n'a bougé.

Deux conditions rendaient déjà ce changement sûr côté `Notifications` :

- `markAsRead` est liée dans le `constructor`, donc la même référence est passée à chaque rendu ;
- la liste de notifications vient d'une constante de module dans `App`, donc les valeurs balisées
  gardent elles aussi leur référence.

Sans ces deux points, une nouvelle fonction ou un nouvel objet à chaque rendu ferait échouer la
comparaison superficielle, et le composant se re-rendrait quand même.

## Le test de pureté

`NotificationItem.spec.js` gagne un test qui espionne `NotificationItem.prototype.render`, rend
l'item, puis le rend à nouveau avec des props égales.

Le piège évité : passer **le même élément JSX** deux fois ne prouve rien. React court-circuite
alors la réconciliation parce que la référence n'a pas changé, et le test passe même sur un
composant non pur. Il faut deux éléments distincts porteurs de props égales :

```jsx
const { rerender } = render(<NotificationItem {...props} />)
rerender(<NotificationItem {...props} />)

expect(renderSpy).toHaveBeenCalledTimes(1)
```

Un troisième rendu, avec un `type` et un `value` différents, vérifie que le composant se met bien
à jour quand une prop change pour de bon.

Vérification dans les deux sens :

| Version jouée | Attendu | Obtenu |
| --- | --- | --- |
| `PureComponent` | tout passe | 25 réussis |
| `Component` | un échec | 1 échec |

## L'application

Le rendu ne change pas.

```bash
cd dashboard
npm install
npm run dev
npm test      # 12 suites, 67 tests
npm run lint  # aucune erreur
```
