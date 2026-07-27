# Task 3. Modify the App

Reprise du `dashboard` de la tâche précédente, avec l'ajout d'un formulaire de connexion.

## Ajouts

Dans le `div.App-body` de [dashboard/src/App.jsx](dashboard/src/App.jsx), sous le paragraphe
`Login to access the full dashboard` :

- un `label` + un `input` pour l'adresse e-mail
- un `label` + un `input` pour le mot de passe
- un `button` portant le texte `OK`

Chaque `label` est relié à son champ par `htmlFor` / `id`, de sorte qu'un clic sur le libellé
donne le focus au champ correspondant.

## Usage

```bash
cd dashboard
npm install
npm run dev     # serveur de développement
npm run lint    # ESLint
npm test        # Jest
```
