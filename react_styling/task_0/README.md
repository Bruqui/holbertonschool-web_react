# Task 0. Set TailwindCSS

Reprise du `dashboard` de [react_component/task_5](../../react_component/task_5). Aucun composant
ne change : on ajoute uniquement TailwindCSS v4 et la police Roboto.

## Installation

```bash
npm install tailwindcss @tailwindcss/vite @fontsource/roboto
```

`@tailwindcss/vite` est le plugin officiel de la v4. Il remplace l'ancien couple
`postcss` + `tailwindcss`, donc ni `postcss.config.js` ni `tailwind.config.js` n'existent ici —
l'énoncé l'interdit, et la v4 n'en a plus besoin.

## `vite.config.js`

```js
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## `src/main.css`

Toute la configuration passe désormais par le CSS.

```css
@import "tailwindcss";

@theme {
  --font-roboto: "Roboto", sans-serif;
}

@layer base {
  html {
    font-family: var(--font-roboto);
  }
}
```

- `@import "tailwindcss"` remplace les trois directives `@tailwind` de la v3.
- `@theme` déclare la variable de thème `--font-roboto`. Le préfixe `--font-*` est reconnu par
  Tailwind, qui génère au passage l'utilitaire `font-roboto`.
- `@layer base` applique la police sur `html` : l'héritage CSS la propage à toute l'application,
  et la placer dans la couche `base` la laisse surchargeable par n'importe quel utilitaire.

## `src/main.jsx`

```jsx
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './main.css'
```

Trois graisses, une par fichier : `400` pour le texte courant, `500` pour les intertitres,
`700` pour les titres et les mises en valeur. Les imports de police précèdent `main.css` pour que
les `@font-face` soient déclarées avant la feuille qui les utilise.

## Les tests

L'intégration ne touche pas à la logique, donc la suite RTL existante passe telle quelle. Les
imports CSS sont neutralisés côté Jest par le `moduleNameMapper` déjà présent dans
`package.json` (`identity-obj-proxy`), ce qui couvre aussi les feuilles de `@fontsource`.

```bash
cd dashboard
npm install
npm run dev
npm run build  # la police et les 3 graisses sortent bien dans dist/
npm test       # 12 suites, 69 tests
npm run lint   # aucune erreur
```
