import { useSpring, animated } from '@react-spring/web'
import { useGameStore } from '../store/gameStore.js'

/** Contador animado con React Spring */
function DineroAnimado({ valor, className }) {
  const spring = useSpring({
    number: valor,
    config: { tension: 120, friction: 14 },
  })

  return (
    <animated.span className={className}>
      {spring.number.to((n) => `$${Math.round(n)}`)}
    </animated.span>
  )
}

/**
 * HUD superpuesto al canvas: bolsa Fuego, cofre Gota, progreso y nivel.
 */
export default function HUD() {
  const bolsaFuego = useGameStore((s) => s.bolsaFuego)
  const cofreGota = useGameStore((s) => s.cofreGota)
  const nivelActual = useGameStore((s) => s.nivelActual)
  const metaCofre = useGameStore((s) => s.metaCofre)
  const vidas = useGameStore((s) => s.vidas)

  const progreso = Math.min(100, (cofreGota / metaCofre) * 100)

  return (
    <header className="pointer-events-none flex w-full flex-col gap-3 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-md">
          <p className="text-xs uppercase tracking-widest text-amber-200/80">
            Nivel {nivelActual || '—'}
          </p>
          <p className="font-['Cinzel'] text-lg text-amber-100">
            Templo del Balance
          </p>
        </div>

        <div className="flex gap-2 text-sm text-rose-200">
          {'❤️'.repeat(Math.max(0, vidas))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="rounded-xl border border-orange-500/40 bg-black/55 px-4 py-2 backdrop-blur-md">
          <span className="mr-2 text-xl" aria-hidden="true">
            🔥
          </span>
          <span className="text-xs text-orange-200/90">Bolsa Inversión (Fuego)</span>
          <DineroAnimado
            valor={bolsaFuego}
            className="ml-2 text-xl font-bold text-orange-400"
          />
        </div>

        <div className="rounded-xl border border-sky-500/40 bg-black/55 px-4 py-2 backdrop-blur-md">
          <span className="mr-2 text-xl" aria-hidden="true">
            💧
          </span>
          <span className="text-xs text-sky-200/90">Cofre Ahorro (Gota)</span>
          <DineroAnimado
            valor={cofreGota}
            className="ml-2 text-xl font-bold text-sky-400"
          />
        </div>
      </div>

      <div className="max-w-md rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-md">
        <div className="mb-1 flex justify-between text-xs text-violet-200/90">
          <span>Meta Súper Capas</span>
          <span>
            ${Math.round(cofreGota)} / ${metaCofre}
          </span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-violet-950"
          role="progressbar"
          aria-valuenow={progreso}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-white/50">
        🔥 Flechas + ↓ ataque · 💧 WASD + S ataque — cooperad para el equilibrio
      </p>
    </header>
  )
}
