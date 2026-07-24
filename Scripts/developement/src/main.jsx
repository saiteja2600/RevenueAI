import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css";
import "./styles/components/sidebar.css";
import "./styles/components/navbar.css";
import "./styles/utilities/display.css";
import "./styles/utilities/flex.css";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
