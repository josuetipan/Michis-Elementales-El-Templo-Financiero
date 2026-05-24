import { motion, AnimatePresence } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { useGameStore } from '../store/gameStore.js'
import { PEaje_ENTRADA_NIVEL_1 } from '../game/economiaNiveles.js'
import { reproducir } from '../audio/sounds.js'
import './Lobby.css'

const FONDO_LOBBY = '/assets/Image/lobby.png'

function DineroAnimado({ valor, className }) {
  const spring = useSpring({ number: valor, config: { tension: 120, friction: 14 } })
  return (
    <animated.span className={className}>
      {spring.number.to((n) => `$${Math.round(n)}`)}
    </animated.span>
  )
}

const HISTORIA =
  'Fuego-Gato (Inversión) y Gota-Gato (Ahorro) sueñan con las Súper Capas Doradas ($200). ' +
  'Solo equilibrando riesgo y ahorro alcanzarán la meta.'

export default function Lobby() {
  const faseLobby = useGameStore((s) => s.faseLobby)
  const bolsaFuego = useGameStore((s) => s.bolsaFuego)
  const cofreGota = useGameStore((s) => s.cofreGota)
  const mensajeLobby = useGameStore((s) => s.mensajeLobby)
  const capasDesbloqueadas = useGameStore((s) => s.capasDesbloqueadas)
  const iniciarAventura = useGameStore((s) => s.iniciarAventura)
  const pagarEntradaTemplo = useGameStore((s) => s.pagarEntradaTemplo)

  const handleIniciar = () => {
    reproducir('moneda')
    iniciarAventura()
  }

  const handlePagar = () => {
    if (pagarEntradaTemplo()) reproducir('peaje')
  }

  const spriteFuego = capasDesbloqueadas
    ? '/assets/Image/GatoFuegoQuietoCapa.png'
    : '/assets/Image/GatoFuegoQuieto.png'
  const spriteGota = capasDesbloqueadas
    ? '/assets/Image/GatoAguaQuietoCapa.png'
    : '/assets/Image/GatoAguaQuieto.png'

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
          <p className="lobby__titulo-icono" aria-hidden="true">
            🐱
          </p>
          <h1 className="lobby__titulo-principal">Gatos Financieros</h1>
          <p className="lobby__titulo-sub">El Templo del Balance</p>
          <p className="lobby__historia">{HISTORIA}</p>

          <div className="lobby__contadores">
            <div className="lobby__contador lobby__contador--fuego">
              <span className="lobby__contador-label">Bolsa Inversión</span>
              <DineroAnimado valor={bolsaFuego} className="lobby__contador-valor" />
            </div>
            <div className="lobby__contador lobby__contador--gota">
              <span className="lobby__contador-label">Cofre Ahorro</span>
              <DineroAnimado valor={cofreGota} className="lobby__contador-valor" />
            </div>
          </div>
        </motion.header>

        <motion.div
          className="lobby__escena"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="lobby__personaje lobby__personaje--fuego">
            <div className="lobby__pedestal-slot">
              <div className="lobby__pedestal" aria-hidden="true" />
              <img src={spriteFuego} alt="" className="lobby__gato-sprite" />
            </div>
            <div className="lobby__control-hint lobby__control-hint--fuego">
              <span className="lobby__control-etiqueta">Fuego-Gato</span>
              <span className="lobby__control-teclas">
                <kbd>←</kbd>
                <kbd>→</kbd>
                <kbd>↑</kbd>
              </span>
              <span className="lobby__control-nota">Mover · Saltar</span>
            </div>
          </div>

          <div className="lobby__personaje lobby__personaje--gota">
            <div className="lobby__pedestal-slot">
              <div className="lobby__pedestal" aria-hidden="true" />
              <img src={spriteGota} alt="" className="lobby__gato-sprite" />
            </div>
            <div className="lobby__control-hint lobby__control-hint--gota">
              <span className="lobby__control-etiqueta">Gota-Gato</span>
              <span className="lobby__control-teclas">
                <kbd>A</kbd>
                <kbd>D</kbd>
                <kbd>W</kbd>
              </span>
              <span className="lobby__control-nota">Mover · Saltar</span>
            </div>
          </div>
        </motion.div>

        <div className="lobby__pie">
          <AnimatePresence>
            {mensajeLobby && (
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

          <motion.div
            className="lobby__acciones"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.32, type: 'spring', stiffness: 240, damping: 20 }}
          >
            {faseLobby === 'intro' ? (
              <motion.button
                type="button"
                className="lobby-btn-ingreso lobby-btn-ingreso--texto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleIniciar}
              >
                Iniciar Aventura
              </motion.button>
            ) : (
              <motion.button
                type="button"
                className="lobby-btn-ingreso lobby-btn-ingreso--texto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePagar}
                disabled={bolsaFuego < PEaje_ENTRADA_NIVEL_1}
              >
                Pagar Entrada (${PEaje_ENTRADA_NIVEL_1})
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
