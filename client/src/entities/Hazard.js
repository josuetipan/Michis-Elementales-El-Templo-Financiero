/** Colores y reglas de game over por tipo de charco */
export const REGLAS_HAZARD = {
  deuda_toxica: { color: '#dc2626', afecta: 'gota' },
  inflacion: { color: '#2563eb', afecta: 'fuego' },
  gasto_hormiga: { color: '#16a34a', afecta: 'ambos' },
}

/**
 * Peligro ambiental (charcos de deuda, inflación, gasto hormiga).
 */
export class Hazard {
  constructor(datos) {
    this.x = datos.x
    this.y = datos.y
    this.width = datos.width
    this.height = datos.height
    this.type = datos.type
    this.regla = REGLAS_HAZARD[datos.type] || REGLAS_HAZARD.gasto_hormiga
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  /** ¿Este hazard elimina al gato dado? */
  afectaATipo(tipoGato) {
    const a = this.regla.afecta
    return a === 'ambos' || a === tipoGato
  }

  dibujar(ctx) {
    const { x, y, width, height } = this
    ctx.fillStyle = this.regla.color
    ctx.globalAlpha = 0.75
    ctx.fillRect(x, y, width, height)
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)
  }
}
