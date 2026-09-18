# React styling

Suite du projet `react_component`. Le dashboard garde sa logique et ses tests, et gagne une
couche de style : **TailwindCSS v4** branché directement dans Vite, sans fichier de configuration.

| Tâche | Sujet |
| --- | --- |
| [task_0](task_0) | Set TailwindCSS — plugin Vite, thème Roboto, trois graisses via `@fontsource/roboto` |
| [task_1](task_1) | Update CourseList and CourseListRow styles — la table des cours passe aux utilitaires, son CSS disparaît |
| [task_2](task_2) | Update the Notifications Panel — variables de couleur visées par `text-(--var)`, panneau tireté à 25% |

## Prérequis

- Node 20.x, npm 10.x
- Jest 29.7.0
- TailwindCSS 4.x

## Usage

```bash
cd task_0/dashboard
npm install
npm run dev     # serveur de développement Vite
npm run build   # build de production
npm test        # Jest
npm run lint    # ESLint
```
