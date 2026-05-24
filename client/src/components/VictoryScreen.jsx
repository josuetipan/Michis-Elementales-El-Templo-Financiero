import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore.js'
import { reproducir } from '../audio/sounds.js'

const MENSAJE_FINAL =
  '¡Felicidades, Maestro del Balance! El capital de Fuego trabaja duro para abrir caminos; ' +
  'el de Gota se acumula con paciencia para cumplir tus sueños. ¡El balance financiero es tu súper poder!'

export default function VictoryScreen() {
  const cofreGota = useGameStore((s) => s.cofreGota)
  const reiniciarPartida = useGameStore((s) => s.reiniciarPartida)

  const volverAlLobby = () => {
    reproducir('victoria')
    reiniciarPartida()
    useGameStore.setState({ capasDesbloqueadas: true, pantalla: 'lobby' })
  }

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-amber-950/90 to-[#1a0f2e] p-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.p
        className="text-4xl"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-hidden="true"
      >
        🎉
      </motion.p>

      <h2 className="mt-4 font-['Cinzel'] text-2xl text-amber-300 md:text-3xl">
        ¡META ALCANZADA: $200 DE AHORRO CONSEGUIDOS!
      </h2>

      <div className="mt-8 flex gap-8">
        <img
          src="/assets/Image/GatoFuegoQuietoCapa.png"
          alt="Fuego con Súper Capa"
          className="h-32 w-auto drop-shadow-lg md:h-40"
        />
        <img
          src="/assets/Image/GatoAguaQuietoCapa.png"
          alt="Gota con Súper Capa"
          className="h-32 w-auto drop-shadow-lg md:h-40"
        />
      </div>

      <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/85">{MENSAJE_FINAL}</p>
      <p className="mt-2 text-sky-400">
        Cofre final: <strong>${cofreGota}</strong>
      </p>

      <button
        type="button"
        className="mt-8 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-8 py-3 font-semibold text-white"
        onClick={volverAlLobby}
      >
        Volver al Templo
      </button>
    </motion.div>
  )
}
