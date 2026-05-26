import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore.js'
import { PEaje_ENTRADA_NIVEL_1 } from '../game/economiaNiveles.js'
import { reproducir } from '../audio/sounds.js'
import {
  FONDO_LOBBY_URL,
  GATO_FUEGO_CAPA,
  GATO_FUEGO_QUIETO,
  GATO_GOTA_CAPA,
  GATO_GOTA_QUIETO,
  INGRESO_URL,
} from '../game/assetUrls.js'
import ModalEntradaTemplo from './ModalEntradaTemplo.jsx'
import './Lobby.css'

const FONDO_LOBBY = FONDO_LOBBY_URL

export default function Lobby() {
  const [modalEntrada, setModalEntrada] = useState(false)

  const faseLobby = useGameStore((s) => s.faseLobby)
  const bolsaFuego = useGameStore((s) => s.bolsaFuego)
  const mensajeLobby = useGameStore((s) => s.mensajeLobby)
  const capasDesbloqueadas = useGameStore((s) => s.capasDesbloqueadas)
  const iniciarAventura = useGameStore((s) => s.iniciarAventura)
  const pagarEntradaTemplo = useGameStore((s) => s.pagarEntradaTemplo)

  const puedePagarAhora =
    faseLobby === 'peaje' ? bolsaFuego >= PEaje_ENTRADA_NIVEL_1 : true

  const bolsaMostrada =
    faseLobby === 'peaje' ? bolsaFuego : PEaje_ENTRADA_NIVEL_1

  const abrirModal = () => {
    reproducir('moneda')
    setModalEntrada(true)
  }

  const cerrarModal = () => setModalEntrada(false)

  const confirmarEntrada = () => {
    if (faseLobby === 'intro') {
      iniciarAventura()
    }

    const ok = useGameStore.getState().pagarEntradaTemplo()
    if (ok) {
      reproducir('peaje')
      setModalEntrada(false)
    }
  }

  const spriteFuego = capasDesbloqueadas ? GATO_FUEGO_CAPA : GATO_FUEGO_QUIETO
  const spriteGota = capasDesbloqueadas ? GATO_GOTA_CAPA : GATO_GOTA_QUIETO

  return (
    <motion.div
      className="lobby"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img src={FONDO_LOBBY} alt="" className="lobby__fondo" />

      <div className="lobby__ui">
        <motion.header
          className="lobby__cabecera"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="lobby__titulo-principal">Templo Financiero</h1>
        </motion.header>

        <motion.div
          className="lobby__entrada"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 22 }}
        >
          <motion.button
            type="button"
            className="lobby-btn-ingreso"
            aria-label="Entrar al templo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={abrirModal}
          >
            <img src={INGRESO_URL} alt="" className="lobby-btn-ingreso__img" />
          </motion.button>
        </motion.div>

        <motion.div
          className="lobby__escena"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <div className="lobby__personaje lobby__personaje--fuego">
            <div className="lobby__plataforma-slot">
              <img src={spriteFuego} alt="" className="lobby__gato-sprite" />
            </div>
            <div className="lobby__control-hint lobby__control-hint--fuego">
              <span className="lobby__control-etiqueta">Michi-Inversión</span>
              <span className="lobby__control-teclas">
                <kbd>←</kbd>
                <kbd>→</kbd>
                <kbd>↑</kbd>
              </span>
              <span className="lobby__control-nota">Mover · Saltar</span>
            </div>
          </div>

          <div className="lobby__personaje lobby__personaje--gota">
            <div className="lobby__plataforma-slot">
              <img src={spriteGota} alt="" className="lobby__gato-sprite" />
            </div>
            <div className="lobby__control-hint lobby__control-hint--gota">
              <span className="lobby__control-etiqueta">Michi-Ahorro</span>
              <span className="lobby__control-teclas">
                <kbd>A</kbd>
                <kbd>D</kbd>
                <kbd>W</kbd>
              </span>
              <span className="lobby__control-nota">Mover · Saltar</span>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {mensajeLobby && !modalEntrada && (
            <motion.p
              className="lobby__banner-bono"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {mensajeLobby}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modalEntrada && (
          <ModalEntradaTemplo
            peaje={PEaje_ENTRADA_NIVEL_1}
            bolsaFuego={bolsaMostrada}
            puedePagar={puedePagarAhora}
            onConfirmar={confirmarEntrada}
            onCerrar={cerrarModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
