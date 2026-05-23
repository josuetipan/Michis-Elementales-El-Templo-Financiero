import { Application, Graphics } from 'pixi.js'

/**
 * Capa PixiJS para sprites de gatos y partículas (sincronizada con Matter.js).
 */
export class PixiLayer {
  constructor(contenedor) {
    this.contenedor = contenedor
    this.app = null
    /** Referencia directa al HTMLCanvasElement (no usar app.canvas en destroy) */
    this.canvasEl = null
    this.spritesGatos = {}
    this.listo = false
    this._destruido = false
    this._limpiezaHecha = false
  }

  async iniciar(ancho, alto) {
    if (this._destruido) return

    const app = new Application()
    this.app = app

    await app.init({
      width: ancho,
      height: alto,
      backgroundAlpha: 0,
      antialias: true,
      resizeTo: undefined,
    })

    this.canvasEl = app.renderer?.canvas ?? null

    if (this._destruido || this.app !== app) {
      this._limpiarApp(app, false)
      return
    }

    if (this.canvasEl) {
      this.contenedor.appendChild(this.canvasEl)
    }
    this.listo = true
  }

  registrarGato(id, color) {
    if (!this.app?.stage) return
    const g = new Graphics()
    g.roundRect(-18, -26, 36, 52, 8)
    g.fill(color)
    this.app.stage.addChild(g)
    this.spritesGatos[id] = g
  }

  sincronizarGato(id, x, y) {
    const sprite = this.spritesGatos[id]
    if (sprite) {
      sprite.x = x
      sprite.y = y
    }
  }

  emitirParticulasMoneda(x, y, color = 0xfbbf24) {
    if (!this.app?.stage) return
    const g = new Graphics()
    for (let i = 0; i < 8; i++) {
      const ang = (Math.PI * 2 * i) / 8
      g.circle(x + Math.cos(ang) * 12, y + Math.sin(ang) * 12, 4)
    }
    g.fill(color)
    this.app.stage.addChild(g)
    const stage = this.app.stage
    setTimeout(() => {
      if (!stage || g.destroyed) return
      stage.removeChild(g)
      g.destroy()
    }, 400)
  }

  redimensionar(ancho, alto) {
    if (this.app?.renderer) {
      this.app.renderer.resize(ancho, alto)
    }
  }

  /**
   * Limpieza segura para Strict Mode / desmontaje React.
   * No usar app.canvas: el getter falla si renderer ya es null.
   */
  _limpiarApp(app, estabaListo) {
    if (this._limpiezaHecha) return
    this._limpiezaHecha = true

    const canvas =
      this.canvasEl ?? (app?.renderer ? app.renderer.canvas : null)
    this.canvasEl = null

    try {
      if (canvas?.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }

      if (estabaListo && app?.renderer) {
        app.destroy(true, { children: true })
      }
    } catch (err) {
      console.warn('[PixiLayer] limpieza parcial:', err)
    }
  }

  destruir() {
    if (this._limpiezaHecha) return

    this._destruido = true
    this.spritesGatos = {}

    const app = this.app
    const estabaListo = this.listo
    this.app = null
    this.listo = false

    if (app || this.canvasEl) {
      this._limpiarApp(app, estabaListo)
    } else {
      this._limpiezaHecha = true
    }
  }
}
