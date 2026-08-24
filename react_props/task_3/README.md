# Task 3. Devtool React extension

Reprise à l'identique du `dashboard` de la [tâche 2](../task_2). Aucun changement de code : cette
tâche s'inspecte dans le navigateur, avec l'extension
[React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
pour Chrome.

## Lancer l'application

```bash
cd dashboard
npm install
npm run dev     # http://localhost:5173/
```

L'extension n'expose les onglets **Components** et **Profiler** que sur un build de développement,
donc bien passer par `npm run dev` et pas par `npm run build` / `npm run preview`.

## Capture 1 — `change_property.png`

Change le `type` de la première notification de `default` à `urgent` et observe la couleur passer
du bleu au rouge.

1. Ouvrir les DevTools (`⌥⌘I`) puis l'onglet **Components**.
2. Déplier `App › Notifications` et sélectionner le **premier** `NotificationItem`.
3. Dans le panneau de droite, section **props**, double-cliquer la valeur de `type` et remplacer
   `"default"` par `"urgent"`, puis `↵`.
4. Le premier `<li>` passe au rouge. Capturer (`⇧⌘4` puis `Espace` pour viser la fenêtre) avec la
   liste **et** le panneau des props visibles dans la même image.
5. Refaire l'opération dans l'autre sens (`urgent` → `default` sur la deuxième notification, qui
   repasse au bleu) si tu veux illustrer le « and vice versa ».

Ce que la capture doit montrer : l'arbre des composants, la prop `type` éditée, et le `li` de la
bonne couleur.

## Capture 2 — `profiler.png`

Profiler le chargement et repérer le composant le plus long à rendre après `App`.

1. Onglet **Profiler**, icône ⚙️ → cocher **Record why each component rendered while profiling**
   (facultatif mais plus lisible).
2. Cliquer le bouton bleu **Reload and start profiling** (la flèche circulaire) : la page se
   recharge et le profilage démarre sur le rendu initial.
3. Arrêter l'enregistrement dès que la page est affichée.
4. Sélectionner le premier commit dans la barre de commits, puis la vue **Ranked** : elle classe
   les composants par durée de rendu décroissante, ce qui répond directement à la question.
5. Capturer la vue **Ranked** avec les durées lisibles.

Le classement dépend de la machine, mais l'ordre attendu place `App` en tête puis `Notifications`
juste derrière — c'est le seul composant qui rend des enfants (les trois `NotificationItem`), là
où `Header`, `Login` et `Footer` sont des feuilles. Noter le nom et la durée relevés sous la
capture ou dans le commit.

## Fichiers attendus

```
task_3/
├── README.md
├── change_property.png
├── profiler.png
└── dashboard/
```

Déposer les deux `.png` directement à la racine de `task_3/`, à côté de ce README.
