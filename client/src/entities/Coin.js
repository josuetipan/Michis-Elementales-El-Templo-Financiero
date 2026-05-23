/**
 * Moneda recogible: asigna valor a bolsa Fuego o cofre Gota según color.
 */
export class Coin {
  constructor(datos) {
    this.x = datos.x
    this.y = datos.y
    this.width = datos.width ?? 28
    this.height = datos.height ?? 28
    this.type = datos.type
    this.value = datos.value ?? 10
    this.recogida = false
    this.id = `${datos.type}-${datos.x}-${datos.y}`
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
    if (this.recogida) return
    const cx = this.x + this.width / 2
    const cy = this.y + this.height / 2
    const r = this.width / 2

    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = this.type === 'fuego' ? '#fbbf24' : '#7dd3fc'
    ctx.fill()
    ctx.strokeStyle = '#fff8e7'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#1a0f2e'
    ctx.font = 'bold 12px Outfit'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('$', cx, cy)
  }
}
