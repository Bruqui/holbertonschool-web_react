import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './main.css'
import App from './App/App.jsx'

// État de connexion de l'application servie. Basculer cette seule ligne suffit
// à passer du formulaire de login à la table des cours.
const isLoggedIn = false

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App isLoggedIn={isLoggedIn} />
  </StrictMode>,
)
