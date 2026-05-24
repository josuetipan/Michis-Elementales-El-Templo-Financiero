import { useEffect, useRef, useCallback } from 'react'
import MapaJuego from './MapaJuego.jsx'
import { obtenerGridNivel } from '../levels/grids/index.js'
import { useGameStore } from '../store/gameStore.js'
import { usePlayerStore } from '../store/playerStore.js'
import { reproducir } from '../audio/sounds.js'

/**
 * Puente entre el store de React y el motor Canvas (MapaJuego).
 * Gestiona teclado, game over por charcos y reintentos desde el lobby.
 */
export default function GameCanvas() {
  const teclasRef = useRef({})

  const nivelActual = useGameStore((s) => s.nivelActual)
  const perderVida = useGameStore((s) => s.perderVida)
  const setTecla = usePlayerStore((s) => s.setTecla)
  const limpiarTeclas = usePlayerStore((s) => s.limpiarTeclas)

  const { grid, spawn, tileSize } = obtenerGridNivel(nivelActual)

  const onHazard = useCallback(() => {
    reproducir('gameOver')
    perderVida()
  }, [perderVida])

  useEffect(() => {
    const teclasPermitidas = new Set([
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'KeyA',
      'KeyD',
      'KeyW',
      'KeyS',
    ])

    const keyDown = (e) => {
      if (!teclasPermitidas.has(e.code)) return
      e.preventDefault()
      teclasRef.current[e.code] = true
      setTecla(e.code, true)
    }

    const keyUp = (e) => {
      if (!teclasPermitidas.has(e.code)) return
      teclasRef.current[e.code] = false
      setTecla(e.code, false)
    }

    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      limpiarTeclas()
    }
  }, [setTecla, limpiarTeclas])

  if (nivelActual < 1) return null

  return (
    <div className="game-shell__canvas-wrap">
      <MapaJuego
        grid={grid}
        tileSize={tileSize}
        spawn={spawn}
        teclasRef={teclasRef}
        onHazard={onHazard}
      />
    </div>
  )
}
