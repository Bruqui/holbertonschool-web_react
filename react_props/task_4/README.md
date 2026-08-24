# Task 4. CourseList & CourseListRow

Reprise du `dashboard` de la [tâche 3](../task_3), auquel s'ajoute la liste des cours et la
bascule connecté / non connecté.

## `CourseListRow.jsx`

Trois props : `isHeader` (défaut `false`), `textFirstCell` (défaut `''`), `textSecondCell`
(défaut `null`). Le composant rend toujours un `<tr>` ; son contenu dépend des props :

| `isHeader` | `textSecondCell` | Rendu |
| --- | --- | --- |
| `true` | `null` | un `<th colSpan={2}>` contenant `textFirstCell` |
| `true` | non `null` | deux `<th>`, `textFirstCell` puis `textSecondCell` |
| `false` | — | deux `<td>`, `textFirstCell` puis `textSecondCell` |

## `CourseList.jsx`

Reçoit `courses`, **par défaut un tableau vide**, et rend un `<table id="CourseList">`.

- **Avec des cours** : un `thead` avec la ligne `Available courses` (en-tête sur deux colonnes)
  puis la ligne `Course name` / `Credit`, et un `tbody` avec un `CourseListRow` par cours,
  `id` en `key`.
- **Sans cours** : une seule ligne, dans le `thead`, portant `No course available yet` — ce que
  montre la maquette `no-courses-available.png`.

## `App.jsx`

Ajoute `coursesList` (`ES6`/60, `Webpack`/20, `React`/40) et la prop `isLoggedIn`, `false` par
défaut. `isLoggedIn` faux affiche `Login`, vrai affiche `CourseList`.

## La mise en page

Les trois maquettes montrent le même trait rouge pleine largeur au-dessus du pied de page, que la
zone centrale contienne le formulaire, le tableau ou une seule ligne. Ce trait appartient donc à
la zone centrale et non au formulaire : `App` enveloppe désormais son contenu dans un
`div.App-body`, dont `App.css` porte la hauteur minimale, le padding et la bordure rouge.

En conséquence, `Login` ne rend plus lui-même un `div.App-body` mais un `div.App-login`, et
`Login.css` ne garde que l'espacement propre au formulaire — le paragraphe d'introduction, puis
les libellés et les champs alignés sur une même ligne.

`CourseList.css` donne au tableau une largeur de 95 % centrée, des bordures fines fusionnées
(`border-collapse: collapse`), des en-têtes centrés et des cellules de corps alignées à gauche,
la colonne `Credit` occupant un tiers de la largeur.

## Tests

`CourseListRow.spec.js` couvre les trois cas du tableau ci-dessus. Les lignes y sont rendues à
l'intérieur d'un vrai `<table>` : un `<tr>` posé directement dans une `div` déclenche un
avertissement `validateDOMNesting` de React, et la consigne demande une console propre.

`CourseList.spec.js` vérifie les 5 lignes avec les trois cours (2 en-têtes + 3 cours), la ligne
unique avec un tableau vide, l'`id` du tableau, et le cas sans prop.

`App.spec.js` vérifie que `isLoggedIn` à `false` rend le formulaire de connexion et pas le
tableau, et qu'à `true` il rend le tableau et plus le formulaire.

## Vérifier le rendu

```bash
cd dashboard
npm install
npm run dev
```

`main.jsx` rend `<App />`, donc l'état non connecté. Pour voir les deux autres maquettes,
remplacer temporairement par `<App isLoggedIn />`, puis vider `coursesList` dans `App.jsx` pour
l'écran « No course available yet ».

```bash
npm test      # 9 suites, 38 tests
npm run lint  # aucune erreur
```
