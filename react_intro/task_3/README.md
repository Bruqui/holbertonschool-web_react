# Task 6. Utils tests

Reprise du `dashboard` de la tâche précédente, avec la suite de tests des fonctions utilitaires.

## Ajouts

[dashboard/src/utils.spec.js](dashboard/src/utils.spec.js) couvre les trois fonctions de
[dashboard/src/utils.js](dashboard/src/utils.js) :

- `getCurrentYear()` — l'horloge est figée avec `jest.useFakeTimers().setSystemTime(...)` sur deux
  années différentes. C'est ce qui évite la bombe à retardement : ni année codée en dur (qui
  périmerait la suite au 1ᵉʳ janvier), ni comparaison à `new Date()` (qui ne ferait que répéter
  l'implémentation).
- `getFooterCopy(isIndex)` — les deux branches, `true` et `false`.
- `getLatestNotification()` — la chaîne HTML attendue.

## Usage

```bash
cd dashboard
npm install
npm run dev     # serveur de développement
npm run lint    # ESLint
npm test        # Jest
```
