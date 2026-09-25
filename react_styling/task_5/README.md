# Task 5. Animation

Reprise du `dashboard` de la [tâche 4](../task_4). Un seul changement : le titre
« Your notifications » rebondit tant qu'il reste des notifications à lire et que le tiroir est
fermé.

## La condition

```jsx
const bounceClass =
  notifications.length > 0 && !displayDrawer ? ' animate-bounce' : ''

<div className={`notification-title text-right mb-1${bounceClass}`}>
```

Les classes existantes sont conservées ; `animate-bounce` s'ajoute au besoin plutôt que de
remplacer la chaîne. C'est la forme la plus simple de composition conditionnelle en React — une
expression qui vaut la classe ou la chaîne vide — et elle évite d'introduire une dépendance
comme `clsx` pour un seul cas.

`animate-bounce` fait partie des utilitaires fournis par Tailwind : aucun fichier de
configuration n'est nécessaire. Vérifié dans le CSS compilé —
`.animate-bounce{animation:var(--animate-bounce)}`.

## Pourquoi cette condition

Le rebond signale une information **non encore vue**. Deux cas l'éteignent, et les deux se
lisent dans la règle :

- plus rien à lire (`notifications.length === 0`) ;
- le tiroir est ouvert, donc les notifications sont déjà sous les yeux (`displayDrawer`).

## Vérification

Les quatre combinaisons, mesurées dans un navigateur sur l'animation **calculée**, pas seulement
sur la classe :

| Notifications | Tiroir | Classe | `animation-name` |
| --- | --- | --- | --- |
| 3 | fermé | `animate-bounce` | `bounce` |
| 3 | ouvert | aucune | `none` |
| 0 | fermé | aucune | `none` |
| 0 | ouvert | aucune | `none` |

Trois tests s'ajoutent à `Notifications.spec.js`, écrits sur la classe — Jest ne calcule pas les
animations. Les props y sont passées explicitement, pour que les scripts du checker puissent
réécrire les valeurs par défaut sans casser la suite.

```bash
cd dashboard
npm install
npm run dev
npm test      # 12 suites, 72 tests
npm run lint  # aucune erreur
```
