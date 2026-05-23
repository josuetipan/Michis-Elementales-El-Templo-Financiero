import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore.js'
import fondoLobby from '../assets/lobby.png'
import imgIngreso from '../assets/ingreso.png'
import './Lobby.css'

/**
 * Lobby del templo: título, pedestales para gatos, controles y botón de ingreso.
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
        src={fondoLobby}
        alt="El Templo del Balance"
        className="lobby__fondo"
      />

      <div className="lobby__ui">
        <motion.header
          className="lobby__titulo"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <p className="lobby__titulo-icono" aria-hidden="true">
            🐱
          </p>
          <h1 className="lobby__titulo-principal">Gatos Financieros</h1>
          <p className="lobby__titulo-sub">El Templo del Balance</p>
        </motion.header>

        <div className="lobby__escena">
          <motion.div
            className="lobby__personaje lobby__personaje--fuego"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="lobby__pedestal" aria-label="Espacio para Fuego-Gato" />
            <div className="lobby__control-hint lobby__control-hint--fuego">
              <span className="lobby__control-etiqueta">Fuego-Gato</span>
              <span className="lobby__control-teclas">
                <kbd>←</kbd>
                <kbd>→</kbd>
                <kbd>↑</kbd>
              </span>
              <span className="lobby__control-nota">Mover · Saltar</span>
            </div>
          </motion.div>

          <motion.div
            className="lobby__personaje lobby__personaje--gota"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <div className="lobby__pedestal" aria-label="Espacio para Gota-Gato" />
            <div className="lobby__control-hint lobby__control-hint--gota">
              <span className="lobby__control-etiqueta">Gota-Gato</span>
              <span className="lobby__control-teclas">
                <kbd>A</kbd>
                <kbd>D</kbd>
                <kbd>W</kbd>
              </span>
              <span className="lobby__control-nota">Mover · Saltar</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="lobby__acciones"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38, type: 'spring', stiffness: 240, damping: 20 }}
        >
          <motion.button
            type="button"
            className="lobby-btn-ingreso"
            aria-label="Entrar al templo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={iniciarDesdeLobby}
          >
            <img src={imgIngreso} alt="" className="lobby-btn-ingreso__img" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
