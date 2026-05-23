import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Sin StrictMode: evita doble montaje que rompe Pixi/Matter en desarrollo
createRoot(document.getElementById('root')).render(<App />)
