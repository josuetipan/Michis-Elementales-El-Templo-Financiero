import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore.js'
import './Lobby.css'

const FONDO_LOBBY = '/assets/Image/lobby.png'

/**
 * Lobby del templo: fondo ilustrado, controles y botón de ingreso.
 */
export default function Lobby() {
  const iniciarDesdeLobby = useGameStore((s) => s.iniciarDesdeLobby)

  return (
    <motion.div
      className="lobby"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img
        src={FONDO_LOBBY}
        alt="El Templo del Balance"
        className="lobby__fondo"
      />

      <motion.div
        className="lobby__ui"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <header className="lobby__titulo">
          <p className="lobby__titulo-icono" aria-hidden="true">
            🐱
          </p>
          <h1 className="lobby__titulo-principal">Gatos Financieros</h1>
          <p className="lobby__titulo-sub">El Templo del Balance</p>
        </header>

        <motion.div
          className="lobby__escena"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <motion.div
            className="lobby__personaje lobby__personaje--fuego"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <motion.img
              src="/assets/Image/GatoFuegoQuieto.png"
              alt=""
              className="lobby__gato-sprite"
              aria-hidden="true"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="lobby__control-hint lobby__control-hint--fuego"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              <span className="lobby__control-etiqueta">Fuego-Gato</span>
              <span className="lobby__control-teclas">
                <kbd>←</kbd>
                <kbd>→</kbd>
                <kbd>↑</kbd>
                <kbd>↓</kbd>
              </span>
              <span className="lobby__control-nota">Mover · Saltar · Ataque</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="lobby__personaje lobby__personaje--gota"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
          >
            <motion.img
              src="/assets/Image/GatoAguaQuieto.png"
              alt=""
              className="lobby__gato-sprite"
              aria-hidden="true"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
            <motion.div
              className="lobby__control-hint lobby__control-hint--gota"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
            >
              <span className="lobby__control-etiqueta">Gota-Gato</span>
              <span className="lobby__control-teclas">
                <kbd>A</kbd>
                <kbd>D</kbd>
                <kbd>W</kbd>
                <kbd>S</kbd>
              </span>
              <span className="lobby__control-nota">Mover · Saltar · Ataque</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="lobby__acciones"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38, type: 'spring', stiffness: 240, damping: 20 }}
        >
          <motion.button
            type="button"
            className="lobby-btn-ingreso lobby-btn-ingreso--texto"
            aria-label="Entrar al templo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={iniciarDesdeLobby}
          >
            Entrar al templo
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
