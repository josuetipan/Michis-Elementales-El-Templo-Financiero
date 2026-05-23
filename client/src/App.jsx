import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore.js'
import Lobby from './components/Lobby.jsx'
import GameCanvas from './components/GameCanvas.jsx'
import HUD from './components/HUD.jsx'
import VictoryScreen from './components/VictoryScreen.jsx'

function PantallaGameOver() {
  const reiniciarPartida = useGameStore((s) => s.reiniciarPartida)
  const reintentarNivel = useGameStore((s) => s.reintentarNivel)
  const vidas = useGameStore((s) => s.vidas)

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="font-['Cinzel'] text-2xl text-rose-300">Game Over</h2>
      <p className="mt-2 text-white/70">Un charco financiero os alcanzó.</p>
      {vidas > 0 ? (
        <button
          type="button"
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-white"
          onClick={reintentarNivel}
        >
          Reintentar ({vidas} vidas)
        </button>
      ) : (
        <button
          type="button"
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-white"
          onClick={reiniciarPartida}
        >
          Volver al lobby
        </button>
      )}
    </motion.div>
  )
}

export default function App() {
  const pantalla = useGameStore((s) => s.pantalla)
  const runId = useGameStore((s) => s.runId)

  return (
    <div className="game-shell">
      <AnimatePresence mode="wait">
        {pantalla === 'lobby' && (
          <motion.div key="lobby" className="absolute inset-0 z-30">
            <Lobby />
          </motion.div>
        )}

        {(pantalla === 'juego' || pantalla === 'gameover') && (
          <motion.div
            key="juego"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GameCanvas key={runId} />
            <div className="game-shell__hud">
              <HUD />
            </div>
            {pantalla === 'gameover' && <PantallaGameOver />}
          </motion.div>
        )}

        {pantalla === 'victoria' && (
          <motion.div key="victoria" className="absolute inset-0 z-30">
            <VictoryScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
