# Task 3. Update the remained styles

Reprise du `dashboard` de la [tâche 2](../task_2). Tous les fichiers CSS restants disparaissent —
`Header.css`, `Login.css`, `BodySectionWithMarginBottom.css`, `Footer.css` et **`App.css`** —, il
ne reste que `src/main.css`. Plus aucun composant n'importe de feuille de style.

## Ce que le preflight avait déjà cassé

Avant même cette tâche, le preflight de Tailwind remettait à zéro des styles que le navigateur
fournissait gratuitement. Le rendu de la tâche 2 en portait déjà la trace, sans que ça saute aux
yeux :

| Élément | Remis à zéro par le preflight | Classe de compensation |
| --- | --- | --- |
| `h1`, `h2` | `font-size: inherit`, `font-weight: inherit` | `text-[2rem] font-bold`, `text-2xl font-bold` |
| `ul` | ni puce ni retrait | `list-disc pl-6` (tâche 2) |
| `input`, `button` | `border-width: 0` | `border border-gray-400 rounded` |

Autrement dit, « convertir le CSS en classes Tailwind » demande aussi de **rendre explicite ce
qui était implicite**. Les titres de section apparaissaient en texte courant de 16px depuis la
tâche 0 ; ils retrouvent ici leur taille.

## `Header.jsx`

```jsx
<div className="App-header flex items-center gap-5 px-5 py-2.5 border-b-[3px] border-(--main-color)">
  <img ... className="w-50" />
  <h1 className="text-[2rem] font-bold text-(--main-color)">
```

`w-50` vaut bien 200px (`50 × 0.25rem`). `border-b-[3px]` est une valeur arbitraire parce que
l'échelle de Tailwind s'arrête à `border-b-2` puis `border-b-4`.

## `Login.jsx`

- `border-t-[3px] border-(--main-color)` pour la bordure haute
- le formulaire devient une rangée flex : `flex flex-wrap items-center`, qui repasse à la ligne
  sur les petits écrans
- `mr-2` sur les `label`, `mr-5` sur les `input` — les marges de l'ancien CSS
- `p` : `text-[1.1rem] mb-6.25` (25px)
- les champs et le bouton retrouvent une bordure visible, que le preflight avait supprimée

## `BodySection.jsx` et `BodySectionWithMarginBottom.jsx`

Le titre passe en `text-2xl font-bold mb-4`, le conteneur à marge en `mb-10` (40px).
Aucun `<p>` n'est ajouté : `BodySection.spec.js` compte les paragraphes rendus et attend
exactement ceux des `children`.

## `Footer.jsx` et le pied de page collé en bas

```jsx
<div className="App-footer mt-auto border-t-[3px] border-(--main-color) p-5 text-center">
  <p className="italic">
```

`mt-auto` ne suffit pas seul : il faut un conteneur flex en colonne d'au moins une hauteur
d'écran. Ce conteneur est `#root`, qui appartient à `index.html` et non à un composant — ses
règles vont donc dans `main.css` :

```css
#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
```

Conséquence : la ligne rouge qui séparait la page du pied de page n'est plus le
`border-bottom` de `.App-body` mais le `border-top` du `Footer`. Garder les deux aurait affiché
**deux** traits rouges dès que le contenu est court, puisque le pied de page descend et que la
`.App-body` reste en haut.

## Où sont passées les règles de `App.css`

`App.jsx` ne fait pas partie des fichiers de la tâche, mais son CSS devait disparaître. Ses
règles rejoignent `@layer base` dans `main.css` plutôt que des classes sur `App.jsx` : le checker
réécrit `App.jsx` d'une tâche à l'autre (`restoreCoursesArray.js` en tâche 1), et des classes
posées là ne survivraient pas forcément. Une règle dans `main.css`, si.

`body { margin: 0 }` n'a pas eu besoin d'être repris : le preflight le fait déjà.

## Vérification

Mesuré dans un Chrome headless, à 1280px de large, dans trois états — connecté, déconnecté, et
fenêtre haute (1400px) pour éprouver le pied de page.

| Contrôle | Attendu | Obtenu |
| --- | --- | --- |
| Pied de page à 900px de haut | bas de fenêtre | `bottom: 900`, document 900 |
| Pied de page à 1400px de haut | bas de fenêtre | `bottom: 1400`, document 1400 |
| Bordure haute du pied | 3px `--main-color` | `3px solid rgb(225, 0, 60)` |
| Pied : padding / alignement / style | 20px / centré / italique | `20px` / `center` / `italic` |
| En-tête | flex, gap 20px, padding 10/20 | `flex`, `20px`, `10px 20px` |
| Logo | 200px | `200px` |
| `h1` | 2rem, gras, `--main-color` | `32px / 700 / rgb(225, 0, 60)` |
| `h2` | 1.5rem, gras | `24px / 700`, `mb 16px` |
| `bodySectionWithMargin` | 40px | `40px` |
| Bordure haute du Login | 3px `--main-color` | `3px solid rgb(225, 0, 60)` |
| Paragraphe du Login | 1.1rem, 25px dessous | `17.6px` / `25px` |
| Rangée du formulaire | flex | `flex` |
| Champs de saisie | bordure visible | `1px solid` |

```bash
cd dashboard
npm install
npm run dev
npm test      # 12 suites, 69 tests
npm run lint  # aucune erreur
```
