import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore.js'
import fondoLobby from '../assets/lobby.png'

/**
 * Pantalla de lobby: bono inicial $20 a Fuego y acceso al nivel 1.
 */
export default function Lobby() {
  const iniciarDesdeLobby = useGameStore((s) => s.iniciarDesdeLobby)

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img
        src={fondoLobby}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/55"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <p className="text-5xl" aria-hidden="true">
          🐱⛩️
        </p>
        <h1 className="mt-4 font-['Cinzel'] text-3xl font-bold text-amber-100 md:text-4xl">
          Gatos Financieros
        </h1>
        <p className="mt-2 text-lg text-violet-200/90">
          El Templo del Balance
        </p>
      </motion.div>

      <motion.p
        className="mt-6 max-w-md text-sm leading-relaxed text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Cooperad como Fuego-Gato y Gota-Gato. El lobby otorga un{' '}
        <strong className="text-orange-400">bono de $20</strong> a Fuego para
        pagar el peaje del primer nivel. Gota guarda sus monedas en el cofre
        hasta alcanzar <strong className="text-sky-400">$200</strong>.
      </motion.p>

      <motion.button
        type="button"
        className="mt-10 cursor-pointer rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={iniciarDesdeLobby}
      >
        Entrar al templo
      </motion.button>

      <p className="mt-8 text-xs text-white/40">
        🔥 Flechas · 💧 WASD
      </p>
      </div>
    </motion.div>
  )
}
