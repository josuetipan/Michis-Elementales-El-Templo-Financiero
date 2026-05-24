import { useEffect, useRef, useCallback } from 'react'
import MapaJuego from './MapaJuego.jsx'
import { obtenerGridNivel } from '../levels/grids/index.js'
import { useGameStore } from '../store/gameStore.js'
import { usePlayerStore } from '../store/playerStore.js'
import { reproducir } from '../audio/sounds.js'

export default function GameCanvas() {
  const teclasRef = useRef({})
  const bolsaRef = useRef(0)

  const nivelActual = useGameStore((s) => s.nivelActual)
  const bolsaFuego = useGameStore((s) => s.bolsaFuego)
  const perderVida = useGameStore((s) => s.perderVida)
  const agregarBolsaFuego = useGameStore((s) => s.agregarBolsaFuego)
  const agregarCofreGota = useGameStore((s) => s.agregarCofreGota)
  const completarNivelActual = useGameStore((s) => s.completarNivelActual)
  const setTecla = usePlayerStore((s) => s.setTecla)
  const limpiarTeclas = usePlayerStore((s) => s.limpiarTeclas)

  bolsaRef.current = bolsaFuego

  const { grid, spawn, tileSize, monedas, puerta, plataformas, guias } =
    obtenerGridNivel(nivelActual)

  const onHazard = useCallback(() => {
    reproducir('gameOver')
    perderVida()
  }, [perderVida])

  const onMoneda = useCallback(
    (tipo, valor) => {
      if (tipo === 'fuego') agregarBolsaFuego(valor)
      else agregarCofreGota(valor)
    },
    [agregarBolsaFuego, agregarCofreGota],
  )

  const onCompletarNivel = useCallback(() => {
    completarNivelActual()
  }, [completarNivelActual])

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
        monedas={monedas}
        puerta={puerta}
        plataformas={plataformas}
        guias={guias}
        teclasRef={teclasRef}
        bolsaFuegoRef={bolsaRef}
        onHazard={onHazard}
        onMoneda={onMoneda}
        onCompletarNivel={onCompletarNivel}
      />
    </div>
  )
}
