# Task 1. Update CourseList and CourseListRow styles

Reprise du `dashboard` de la [tâche 0](../task_0). La table des cours passe entièrement aux
utilitaires Tailwind : `src/CourseList/CourseList.css` est supprimé, et aucun des deux composants
n'importe plus de feuille de style.

## `src/main.css`

Deux couleurs rejoignent le thème, à côté de la police :

```css
@theme {
  --font-roboto: "Roboto", sans-serif;

  --color-table-header: #deb5b5;
  --color-table-rows: #CDCDCD;
}
```

Le préfixe `--color-*` suffit : Tailwind en dérive les utilitaires `bg-table-header` et
`bg-table-rows`. C'est ce qui permet de tenir la contrainte « aucun fichier de configuration » —
en v4, le thème *est* le CSS.

## `CourseListRow.jsx`

La teinte et l'opacité dépendent de la nature de la ligne :

| | Fond | Opacité |
| --- | --- | --- |
| Ligne d'en-tête | `bg-table-header` | `opacity-66` |
| Ligne de données | `bg-table-rows` | `opacity-45` |

Les cellules partagent `border border-gray-400`, et les `td` ajoutent `pl-2`.

`pl-2` et non `pl-8` : l'échelle d'espacement de Tailwind part de `--spacing: 0.25rem`, donc
`pl-2` vaut `calc(0.25rem * 2)` = **8px**. C'est la classe demandée par l'énoncé.

`opacity-66` et `opacity-45` ne font pas partie de l'échelle documentée de la v3, mais la v4
traite `opacity-<number>` comme un utilitaire fonctionnel : n'importe quel entier passe, sans
valeur arbitraire entre crochets. Vérifié dans le CSS compilé (`.opacity-66{opacity:.66}`).

## `CourseList.jsx`

Le `<table>` garde son `id="CourseList"` et reçoit un conteneur :

```jsx
<div className="w-4/5 mx-auto my-4">
  <table id="CourseList" className="w-full border-collapse">
```

- `w-4/5` → 80% de la largeur de page
- `mx-auto my-4` → centrage et respiration verticale
- `w-full` → la table remplit son conteneur
- `border-collapse` → les bordures des cellules fusionnent en une grille, comme le faisait
  l'ancien `border-collapse: collapse` du CSS supprimé

Les deux états ne sont plus deux `return` distincts mais une seule structure, avec le contenu du
`<thead>` choisi par un ternaire. C'est ce qui garantit la cohérence demandée entre table pleine
et table vide : même conteneur, mêmes classes, même largeur — il n'y a plus deux arbres à garder
synchronisés.

## `main.jsx` : rendre la table visible

Le « Reminder » de l'énoncé n'est pas une remarque en passant, c'est une condition pour que la
tâche soit testable.

`isLoggedIn` est une **prop** de `App`, avec `false` en valeur par défaut, et rien dans
l'application ne la fait basculer — le bouton `OK` du formulaire ne porte aucun gestionnaire à ce
stade du cursus. `main.jsx` rendait `<App />` : l'app servie affichait donc toujours le
formulaire de connexion, et `#CourseList` n'apparaissait **jamais** dans le DOM.

Conséquence pour les tests de bout en bout : ils n'échouaient pas sur une assertion, ils
**expiraient** en attendant un sélecteur qui ne viendrait pas. D'où le `return code 124` et une
sortie vide, alors que le style lui-même était correct.

```jsx
<App isLoggedIn={true} />
```

Les tests RTL ne sont pas concernés : ils rendent `App` directement avec leurs propres props et
ne passent pas par `main.jsx`.

## Vérification

Mesuré dans un Chrome headless, sur les deux états :

| Contrôle | Attendu | Obtenu |
| --- | --- | --- |
| Largeur du conteneur | 80% | 800px sur 1000px |
| Largeur de la table | = conteneur | 800px |
| Centrage | auto | `margin-left: 100px` |
| Fond en-tête / opacité | `#deb5b5` / .66 | `rgb(222, 181, 181)` / `0.66` |
| Fond données / opacité | `#CDCDCD` / .45 | `rgb(205, 205, 205)` / `0.45` |
| Bordure des cellules | gray-400 | `1px solid` gray-400 |
| `padding-left` des `td` | 8px | `8px` |
| Table vide | même rendu | conteneur et table à 800px |

```bash
cd dashboard
npm install
npm run dev
npm test      # 12 suites, 69 tests
npm run lint  # aucune erreur
```
