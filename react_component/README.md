# React component

Suite du projet `react_props`. Le dashboard passe des composants fonctionnels aux **composants de
classe**, puis exploite leur cycle de vie et leur état.

| Tâche | Sujet |
| --- | --- |
| [task_0](task_0) | Switch to class components — `App` devient une classe React |
| [task_1](task_1) | Lifecycles — raccourci `Ctrl` + `h` monté et démonté avec `App` |
| [task_2](task_2) | Handling Events — `markAsRead` au clic sur une notification |
| [task_3](task_3) | Reusable comments & specialization, puis Use the new components — `BodySection`, sa spécialisation, et leur branchement dans `App` |
| [task_4](task_4) | High Order Component — `WithLogging` autour de `Login` et `CourseList` |

## Prérequis

- Node 20.x, npm 10.x
- Jest 29.7.0

## Usage

```bash
cd task_0/dashboard
npm install
npm run dev     # serveur de développement Vite
npm test        # Jest
npm run lint    # ESLint
```
