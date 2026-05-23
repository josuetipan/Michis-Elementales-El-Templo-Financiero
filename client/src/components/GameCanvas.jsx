import { useEffect, useRef, useCallback } from 'react'
import { GameLoop } from '../game/gameLoop.js'
import { obtenerNivel } from '../levels/index.js'
import { useGameStore } from '../store/gameStore.js'
import { usePlayerStore } from '../store/playerStore.js'
import { reproducir } from '../audio/sounds.js'

/**
 * Contenedor del canvas a pantalla completa y arranque del bucle de juego.
 */
export default function GameCanvas() {
  const canvasRef = useRef(null)
  const pixiRef = useRef(null)
  const loopRef = useRef(null)
  const teclasRef = useRef({})

  const nivelActual = useGameStore((s) => s.nivelActual)
  const agregarBolsaFuego = useGameStore((s) => s.agregarBolsaFuego)
  const agregarCofreGota = useGameStore((s) => s.agregarCofreGota)
  const pagarPeajeFuego = useGameStore((s) => s.pagarPeajeFuego)
  const setNivel = useGameStore((s) => s.setNivel)
  const setPantalla = useGameStore((s) => s.setPantalla)
  const perderVida = useGameStore((s) => s.perderVida)
  const metaCumplidaFn = useGameStore((s) => s.metaCumplida)
  const setTecla = usePlayerStore((s) => s.setTecla)
  const limpiarTeclas = usePlayerStore((s) => s.limpiarTeclas)

  const onMoneda = useCallback(
    (tipo, valor) => {
      if (tipo === 'fuego') agregarBolsaFuego(valor)
      else agregarCofreGota(valor)
    },
    [agregarBolsaFuego, agregarCofreGota],
  )

  const onGameOver = useCallback(() => {
    loopRef.current?.detener()
    loopRef.current = null
    perderVida()
  }, [perderVida])

  const onPuerta = useCallback(
    (puerta) => {
      const peaje = puerta.peaje ?? 0
      const bolsa = useGameStore.getState().bolsaFuego
      if (bolsa >= peaje) {
        pagarPeajeFuego(peaje)
        reproducir('peaje')
        const siguiente = nivelActual + 1
        if (metaCumplidaFn() || siguiente > 3) {
          setPantalla('victoria')
          loopRef.current?.detener()
          return
        }
        setNivel(siguiente)
        loopRef.current?.detener()
        loopRef.current = null
      }
    },
    [nivelActual, pagarPeajeFuego, setNivel, setPantalla, metaCumplidaFn],
  )

  useEffect(() => {
    const teclasPermitidas = new Set([
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'KeyA',
      'KeyD',
      'KeyW',
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

  useEffect(() => {
    const canvas = canvasRef.current
    const pixiContainer = pixiRef.current
    if (!canvas || !pixiContainer || nivelActual < 1) return

    let cancelado = false

    const arrancar = async () => {
      const nivel = obtenerNivel(nivelActual)
      const loop = new GameLoop({
        canvas,
        pixiContainer,
        nivel,
        teclasRef,
        onMoneda,
        onGameOver,
        onPuerta,
      })
      loopRef.current = loop
      await loop.iniciar()
      // Strict Mode desmonta antes de que termine iniciar()
      if (cancelado) {
        loop.detener()
        if (loopRef.current === loop) loopRef.current = null
      }
    }

    arrancar()

    return () => {
      cancelado = true
      const loop = loopRef.current
      if (loop) {
        loop.detener()
        loopRef.current = null
      }
    }
  }, [nivelActual, onMoneda, onGameOver, onPuerta])

  return (
    <div className="game-shell__canvas-wrap">
      <canvas ref={canvasRef} aria-label="Área de juego Gatos Financieros" />
      <div ref={pixiRef} className="game-shell__pixi" aria-hidden="true" />
    </div>
  )
}
