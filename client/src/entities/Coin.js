/**
 * Moneda o fajo recogible — solo el gato de su color puede recogerlo.
 */
export class Coin {
  constructor(datos) {
    this.x = datos.x
    this.y = datos.y
    this.width = datos.width ?? 28
    this.height = datos.height ?? 28
    this.type = datos.type
    this.kind = datos.kind ?? 'moneda'
    this.value = datos.value ?? 10
    this.recogida = false
    this.id = `${datos.type}-${this.kind}-${datos.x}-${datos.y}`
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

    if (this.kind === 'fajo') {
      ctx.fillStyle = this.type === 'fuego' ? '#22c55e' : '#22c55e'
      ctx.fillRect(this.x, this.y, this.width, this.height)
      ctx.strokeStyle = this.type === 'fuego' ? '#fbbf24' : '#7dd3fc'
      ctx.lineWidth = 2
      ctx.strokeRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 11px Outfit'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`$${this.value}`, cx, cy)
      return
    }

    const r = Math.min(this.width, this.height) / 2
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = this.type === 'fuego' ? '#fbbf24' : '#7dd3fc'
    ctx.fill()
    ctx.strokeStyle = '#fff8e7'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#1a0f2e'
    ctx.font = 'bold 10px Outfit'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('$', cx, cy)
  }
}
