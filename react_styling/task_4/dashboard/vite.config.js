import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Le JSX est transpilé par esbuild, intégré à Vite : la configuration ne dépend
// donc que de `@tailwindcss/vite`. `@vitejs/plugin-react` n'apportait que le
// Fast Refresh, et être une devDependency le rendait introuvable dès qu'une
// installation omettait les dépendances de développement — auquel cas Vite
// s'arrêtait au chargement de ce fichier, avant même de servir la page.
// https://vite.dev/config/#esbuild
export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: { jsx: 'automatic' },
})
