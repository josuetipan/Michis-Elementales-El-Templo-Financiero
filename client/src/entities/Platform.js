import { crearPlataforma } from '../game/physics.js'

/**
 * Plataforma estática del nivel (suelo, islas, barreras cooperativas).
 */
export class Platform {
  constructor(world, datos) {
    this.datos = datos
    this.body = crearPlataforma(world, datos)
    this.tipo = datos.type || 'platform'
  }

  dibujar(ctx) {
    const { x, y, width, height } = this.datos
    ctx.fillStyle =
      this.tipo === 'barrera' ? '#4a3728' : '#3d2c5c'
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = '#6b5b95'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, width, height)
  }
}
