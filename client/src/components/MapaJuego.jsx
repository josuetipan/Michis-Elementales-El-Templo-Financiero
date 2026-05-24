import { useEffect, useRef } from 'react'
import { GameEngine } from '../game/engine/gameEngine.js'

/**
 * Componente principal del mapa jugable.
 *
 * @param {Object} props
 * @param {Array<Array<number|string>>} props.grid - Matriz bidimensional del nivel
 * @param {number} [props.tileSize=32] - Tamaño de cada celda en píxeles
 * @param {Object} [props.spawn] - { fuego: {x,y}, gota: {x,y} }
 * @param {string} [props.atlasUrl] - Ruta al sprite sheet (opcional)
 * @param {React.RefObject} [props.teclasRef] - Ref con estado de teclas
 * @param {Function} [props.onHazard] - (tipoGato, tipoCharco) => void
 */
export default function MapaJuego({
  grid,
  tileSize = 32,
  spawn,
  atlasUrl = '/sprites/templo-atlas.png',
  teclasRef,
  onHazard,
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
        teclasRef,
        atlasUrl,
        onHazard,
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
  }, [grid, tileSize, spawn, atlasUrl, teclasRef, onHazard])

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      aria-label="Mapa del Templo Financiero"
    />
  )
}
