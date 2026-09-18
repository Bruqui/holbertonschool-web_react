# Task 4. Go Responsive

Reprise du `dashboard` de la [tâche 3](../task_3). L'application s'adapte aux petits écrans, avec
deux points de rupture : **912px** pour la mise en page, **520px** pour le titre.

## Les points de rupture sans fichier de configuration

Ni 912 ni 520 n'appartiennent à l'échelle de Tailwind, et l'énoncé interdit un fichier de
configuration. La variante arbitraire règle le problème :

```
max-[912px]:flex-col     →  @media (width < 912px)
max-[520px]:text-4xl     →  @media (width < 520px)
```

En v4, `max-[N]` produit bien `width < N` — donc « en dessous de 912px », au sens strict de
l'énoncé.

## Le viewport des captures de référence

Les images fournies font 323px de large, mais ce n'est pas le viewport : elles sont réduites pour
la page de l'énoncé. Le rapport se lit en comparant un élément inchangé depuis la tâche 3 —
« Your notifications » mesure 125px sur desktop et 94px ici, soit **0,75**.

À cette échelle, tout retombe sur des valeurs propres : 323 / 0,75 ≈ 430 et 700 / 0,75 ≈ 932,
c'est-à-dire **430×932**. Les tailles de texte se déduisent alors directement : le `h1` passe de
48px à **36px** (`text-4xl`), le reste ne bouge pas.

La vérification se fait donc en rendant l'application à 430×932, puis en réduisant la capture à
323px pour la comparer aux références mesure par mesure.

## `Notifications.jsx` — le panneau plein écran

Sous 912px, le panneau quitte son coin et recouvre l'écran :

```jsx
<div className="notification-items border-[3px] border-dotted border-(--main-color) p-2
                max-[912px]:fixed max-[912px]:inset-0 max-[912px]:z-50
                max-[912px]:overflow-auto max-[912px]:bg-white max-[912px]:p-3">
```

- `fixed inset-0` le sort du flux et l'étale sur toute la fenêtre
- `z-50` le place au-dessus du reste, `bg-white` masque la page
- `p-3` donne les **12px** de marge intérieure demandés
- la liste perd ses puces et son retrait : `max-[912px]:list-none max-[912px]:pl-0`

## `NotificationItem.jsx`

Chaque notification devient une ligne pleine largeur soulignée d'un trait, au lieu d'une puce
dans une liste compacte :

```
max-[912px]:block max-[912px]:w-full max-[912px]:border-b-2 max-[912px]:border-black
max-[912px]:px-2 max-[912px]:py-2.5 max-[912px]:text-xl
```

## `App.jsx` — le conteneur

Les règles de mise en page quittent `main.css` pour le composant, comme le demande l'énoncé :

```jsx
<div className="relative flex min-h-screen flex-col px-3">
```

`flex flex-col` + `min-h-screen` laissent le `mt-auto` du pied de page faire son travail,
`relative` ancre le panneau de notifications, `px-3` donne la gouttière de 12px — la même sur
mobile et sur desktop, contrairement à ce qu'on pourrait supposer : c'est la mesure qui l'a dit.

`main.css` se réduit désormais au thème et à la police.

## `Header.jsx`, `Login.jsx`, `Footer.jsx`, `CourseList.jsx`

| Composant | Sur mobile |
| --- | --- |
| `Header` | `flex-col gap-2` : logo au-dessus, titre centré dessous ; `text-4xl` sous 520px |
| `Login` | formulaire en colonne (`flex-col items-start`), étiquette au-dessus de son champ, champs en `w-60`, retrait ramené de 40px à 4px |
| `Footer` | `text-base` au lieu de `text-xl`, padding ramené de 16px à 8px |
| `CourseList` | marges verticales conservées, marge basse portée à 168px |

## Un piège hérité de la tâche 3

`App.jsx` ne force plus `displayDrawer`, comme il ne force plus `isLoggedIn` : les scripts du
checker basculent ces valeurs dans les `defaultProps`, et une prop explicite les écraserait
silencieusement. Les deux composants restent seuls maîtres de leur état par défaut.

Même précaution côté tests : `Notifications.spec.js` ne vérifie plus « le tiroir est fermé par
défaut » mais « le tiroir est fermé quand `displayDrawer` vaut `false` ». La suite a été jouée
dans les **quatre** états que le checker peut produire — 69 tests verts à chaque fois.

## Vérification

Rendu à 430×932, réduit à 323px, mesuré contre chaque référence :

| Contrôle | Référence | Obtenu |
| --- | --- | --- |
| layout_1 — hauteur de page | 735 | 735 |
| layout_1 — tableau | y 370..457, x 40..282 | identique |
| layout_1 — trait du pied | y 702..703 | identique |
| layout_2 — hauteur de page | 763 | 763 |
| layout_2 — champs et étiquettes | 341..351 / 357..379 / 388..397 / 404..426 / 432..454 | 341..351 / 357..380 / 389..399 / 405..428 / 432..455 |
| layout_2 — lignes du Lorem ipsum | 643, 661, 678, 697, 715 | 643, 661, 679, 697, 716 |
| layout_4 — titre du panneau | y 16..27, x 14..209 | y 15..27, x 14..209 |
| layout_4 — items | 46..57 / 85..96 / 123..137 | 47..58 / 84..96 / 122..136 |
| layout_4 — traits | y 71 / 109 / 148 | y 71 / 108 / 146 |
| layout_3 — texte du panneau vide | y 16..28, x 12..194 | y 15..27, x 12..195 |

Le rendu desktop n'a pas bougé : `h1` à 48px, `.App-login` à 480px, gouttière à 12px, page de
993px — les valeurs relevées en tâche 3.

```bash
cd dashboard
npm install
npm run dev
npm test      # 12 suites, 69 tests
npm run lint  # aucune erreur
```
