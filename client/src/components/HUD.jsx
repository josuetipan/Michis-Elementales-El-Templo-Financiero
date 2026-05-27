import { useSpring, animated } from '@react-spring/web'
import { useGameStore } from '../store/gameStore.js'
import './HUD.css'

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

export default function HUD() {
  const bolsaFuego = useGameStore((s) => s.bolsaFuego)
  const cofreGota = useGameStore((s) => s.cofreGota)
  const nivelActual = useGameStore((s) => s.nivelActual)
  const metaCofre = useGameStore((s) => s.metaCofre)
  const vidas = useGameStore((s) => s.vidas)
  const peaje = useGameStore((s) => s.peajeActual())

  const progreso = Math.min(100, (cofreGota / metaCofre) * 100)

  return (
    <>
      <div className="hud-mini hud-mini--izq">
        <span className="hud-mini__nivel">N{nivelActual || '—'}</span>
        <span className="hud-mini__sep">·</span>
        <span className="hud-mini__ico" aria-hidden="true">
          🔥
        </span>
        <DineroAnimado valor={bolsaFuego} className="hud-mini__monto hud-mini__monto--fuego" />
        <span className="hud-mini__sep">·</span>
        <span className="hud-mini__meta-num" title="Meta del cofre">
          ${Math.round(cofreGota)}/{metaCofre}
        </span>
        <div
          className="hud-mini__barra"
          role="progressbar"
          aria-label="Progreso del cofre"
          aria-valuenow={progreso}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="hud-mini__barra-fill" style={{ width: `${progreso}%` }} />
        </div>
      </div>

      <div className="hud-mini hud-mini--der">
        <span className="hud-mini__ico" aria-hidden="true">
          💧
        </span>
        <DineroAnimado valor={cofreGota} className="hud-mini__monto hud-mini__monto--gota" />
        <span className="hud-mini__sep">·</span>
        <span className="hud-mini__vidas" aria-label={`${vidas} vidas`}>
          {'❤'.repeat(Math.max(0, vidas))}
        </span>
        <span className="hud-mini__sep">·</span>
        <span className="hud-mini__peaje" title="Peaje de salida">
          ⛩${peaje}
        </span>
      </div>
    </>
  )
}
