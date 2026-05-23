/**
 * Puerta / peaje de salida del nivel (activación futura con economía).
 */
export class Door {
  constructor(datos) {
    this.x = datos.x
    this.y = datos.y
    this.width = datos.width ?? 48
    this.height = datos.height ?? 80
    this.peaje = datos.peaje ?? 0
    this.abierta = false
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  dibujar(ctx) {
    ctx.fillStyle = this.abierta ? '#22c55e' : '#78716c'
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.fillStyle = '#f8f4ff'
    ctx.font = '12px Outfit'
    ctx.fillText(
      this.abierta ? 'META' : `$${this.peaje}`,
      this.x + 8,
      this.y + this.height / 2,
    )
  }
}
