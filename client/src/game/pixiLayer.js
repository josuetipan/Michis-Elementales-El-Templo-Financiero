import { Application, Assets, Graphics, Sprite, Texture } from 'pixi.js'
import {
  aliasTextura,
  listarRecursosSprites,
} from './catSprites.js'

/** Altura visual objetivo del gato en pantalla */
const ALTURA_SPRITE = 72

/**
 * Capa PixiJS: sprites animados de gatos y partículas.
 */
export class PixiLayer {
  constructor(contenedor) {
    this.contenedor = contenedor
    this.app = null
    this.canvasEl = null
    this.spritesGatos = {}
    this.texturas = {}
    this.listo = false
    this.spritesCargados = false
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

  /** Precarga todas las imágenes de GatoFuego / GatoAgua */
  async cargarSpritesGatos() {
    if (!this.app || this.spritesCargados) return

    const recursos = listarRecursosSprites()
    await Assets.load(recursos.map((r) => ({ alias: r.alias, src: r.src })))

    for (const { alias } of recursos) {
      this.texturas[alias] = Texture.from(alias)
    }

    this.spritesCargados = true
  }

  registrarGato(id, tipo) {
    if (!this.app?.stage || !this.spritesCargados) return

    const alias = aliasTextura(tipo, 'quieto')
    const textura = this.texturas[alias]
    if (!textura) return

    const sprite = new Sprite(textura)
    sprite.anchor.set(0.5, 1)
    this._escalarSprite(sprite)
    this.app.stage.addChild(sprite)

    this.spritesGatos[id] = {
      sprite,
      tipo,
      estadoActual: 'quieto',
    }
  }

  _escalarSprite(sprite) {
    const h = sprite.texture.height || ALTURA_SPRITE
    const escala = ALTURA_SPRITE / h
    sprite.scale.set(escala)
  }

  /**
   * Posición y textura según estado de animación del Cat.
   */
  actualizarGato(id, { x, y, estado, facing, tipo, escalaX = 1, escalaY = 1 }) {
    const datos = this.spritesGatos[id]
    if (!datos) return

    const { sprite } = datos
    sprite.x = x
    sprite.y = y

    const accion = estado || 'quieto'
    if (datos.estadoActual !== accion) {
      const alias = aliasTextura(tipo, accion)
      const tex = this.texturas[alias]
      if (tex) {
        sprite.texture = tex
        datos.estadoActual = accion
      }
    }

    const base = ALTURA_SPRITE / (sprite.texture.height || ALTURA_SPRITE)
    sprite.scale.x = base * escalaX * (facing < 0 ? -1 : 1)
    sprite.scale.y = base * escalaY
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

    this.texturas = {}
    this.spritesCargados = false
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
