import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore.js'

export default function VictoryScreen() {
  const cofreGota = useGameStore((s) => s.cofreGota)
  const reiniciarPartida = useGameStore((s) => s.reiniciarPartida)

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-emerald-950 to-[#1a0f2e] p-8 text-center"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <p className="text-6xl" aria-hidden="true">
        🏆
      </p>
      <h2 className="mt-4 font-['Cinzel'] text-3xl text-emerald-200">
        ¡Maestro del Balance!
      </h2>
      <p className="mt-4 text-white/80">
        Cofre de Gota: <strong className="text-sky-400">${cofreGota}</strong>
      </p>
      <button
        type="button"
        className="mt-8 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white hover:bg-white/20"
        onClick={reiniciarPartida}
      >
        Volver al lobby
      </button>
    </motion.div>
  )
}
