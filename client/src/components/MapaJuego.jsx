import { useEffect, useRef } from 'react'
import { GameEngine } from '../game/engine/gameEngine.js'

export default function MapaJuego({
  grid,
  tileSize = 32,
  spawn,
  monedas = [],
  puerta = null,
  atlasUrl = '/sprites/templo-atlas.png',
  teclasRef,
  bolsaFuegoRef,
  onHazard,
  onMoneda,
  onCompletarNivel,
}) {
  const canvasRef = useRef(null)
  const motorRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !grid?.length) return

    let cancelado = false

    const arrancar = async () => {
      const motor = new GameEngine({
        canvas,
        grid,
        tileSize,
        spawn,
        monedas,
        puerta,
        teclasRef,
        bolsaFuegoRef,
        atlasUrl,
        onHazard,
        onMoneda,
        onCompletarNivel,
      })

      motorRef.current = motor
      await motor.iniciar()

      if (cancelado) {
        motor.detener()
        if (motorRef.current === motor) motorRef.current = null
      }
    }

    arrancar()

    return () => {
      cancelado = true
      const motor = motorRef.current
      if (motor) {
        motor.detener()
        motorRef.current = null
      }
    }
  }, [
    grid,
    tileSize,
    spawn,
    monedas,
    puerta,
    atlasUrl,
    teclasRef,
    bolsaFuegoRef,
    onHazard,
    onMoneda,
    onCompletarNivel,
  ])

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      aria-label="Mapa del Templo Financiero"
    />
  )
}
