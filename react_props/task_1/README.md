# Task 1. Write the tests for each component

Reprise du `dashboard` de la [tâche 0](../task_0). Les trois specs créés vides y sont remplis par
de vrais tests unitaires.

## Ce qui est vérifié

### `Header.spec.js`

- Le composant contient le logo Holberton. L'image est retrouvée par son `alt` **ou** son `src`,
  ce qui évite de dépendre de la formulation exacte de l'attribut `alt`.
- Le composant contient un `h1` dont le texte est `School dashboard`
  (`getByRole('heading', { level: 1 })`).

### `Login.spec.js`

- 2 `label`, 2 `input` et 1 bouton. Les `input` de type `submit`/`button`/`reset` sont exclus du
  compte des champs, et le bouton est retrouvé par son rôle : un `<input type="submit">` compte
  donc comme bouton, pas comme champ.
- Cliquer un `label` donne le focus à l'`input` associé, pour l'e-mail comme pour le mot de passe
  (`userEvent.click` puis `toHaveFocus`).

### `Footer.spec.js`

- `getFooterCopy(true)` renvoie bien `Holberton School`.
- Le `p` rend `Copyright {année courante} - Holberton School`. L'année est matchée en `\d{4}` —
  pas comparée à `new Date()` — pour ne pas casser au passage à la nouvelle année.

### `Notifications.spec.js`

Inchangé depuis `react_intro`, et toujours vert : titre, bouton de fermeture, 3 `li`, et
journalisation au clic.

## Robustesse des assertions

Toutes les requêtes sont insensibles à la casse et indépendantes de l'ordre et de la structure du
DOM. Les specs ont été validés dans les deux sens : ils échouent face à un composant fautif
(logo absent ou différent, `label` sans `htmlFor`, `getFooterCopy(false)`) et passent face aux
variantes légitimes (casse en majuscules, `label` englobants sans `htmlFor`,
`<input type="submit">` à la place du `<button>`).

## Usage

```bash
cd dashboard
npm install
npm test
npm run lint
```
