# Gatos Financieros: El Templo del Balance

Juego de plataformas cooperativo educativo (estilo Fireboy & Watergirl) con mecánicas de finanzas personales integradas de forma invisible.

## Stack (fase actual — cliente)

- **React 18+** + **Vite** — shell, HUD, lobby
- **Canvas API** + **Matter.js** — bucle de juego y física
- **PixiJS** — capa de sprites y partículas
- **Howler.js** — audio (assets en `client/public/audio/`)
- **Zustand** — estado global
- **Tailwind CSS** — UI fuera del canvas
- **Framer Motion** / **React Spring** — animaciones de pantallas y contadores

## Comandos

```bash
# Desde la raíz del repo
npm install
cd client && npm install

npm run dev          # http://localhost:5173
npm run build
npm run preview
```

## Estructura

```
client/src/
  game/           gameLoop.js, physics.js, pixiLayer.js
  entities/       Cat, Coin, Hazard, Platform, Door
  levels/         level1.json … level3.json
  components/     GameCanvas, HUD, Lobby, VictoryScreen
  store/          gameStore.js, playerStore.js
  audio/          sounds.js
```

## Controles

| Gato | Mover | Saltar |
|------|-------|--------|
| Fuego 🔥 | ← → | ↑ |
| Gota 💧 | A D | W |

## Próximos pasos

- Backend Express + Prisma (`/server`)
- Rompecabezas cooperativos (botón Presupuesto, palanca Fondo de Emergencia)
- Sprites PNG y música en `/public`
- Persistencia `POST/GET /api/progress`
