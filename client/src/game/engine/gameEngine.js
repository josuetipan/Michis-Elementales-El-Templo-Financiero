import { parsearGrid, dimensionesDelMapa } from '../tilemap/collisionGrid.js'
import { renderizarTilemap } from '../tilemap/tilemapRenderer.js'
import { charcoAfectaATipo } from '../tilemap/constants.js'
import { rectsColisionan } from './platformPhysics.js'
import { Personaje } from './personaje.js'
import { SpriteAtlas } from '../sprites/spriteAtlas.js'

/**
 * Motor del juego (sin React): bucle rAF, cámara, colisiones y render.
 */
export class GameEngine {
  constructor(opciones) {
    this.canvas = opciones.canvas
    this.ctx = this.canvas.getContext('2d')
    this.grid = opciones.grid
    this.tileSize = opciones.tileSize ?? 32
    this.spawn = opciones.spawn
    this.teclasRef = opciones.teclasRef
    this.atlasUrl = opciones.atlasUrl ?? null
    this.onHazard = opciones.onHazard
    this.colorFondo = opciones.colorFondo ?? '#1a0f2e'

    this.activo = false
    this.rafId = null
    this.ultimoTiempo = 0
    this.camara = { x: 0, y: 0 }
    this.escalaX = 1
    this.escalaY = 1

    const { solidos, charcos } = parsearGrid(this.grid, this.tileSize)
    this.solidos = solidos
    this.charcos = charcos
    this.mundo = dimensionesDelMapa(this.grid, this.tileSize)

    this.atlas = new SpriteAtlas(this.atlasUrl)
  }

  async iniciar() {
    await this.atlas.cargar()
    this.redimensionar()

    const spawnFuego = this.spawn?.fuego ?? { x: 96, y: 96 }
    const spawnGota = this.spawn?.gota ?? { x: 160, y: 96 }

    this.fuego = new Personaje({ ...spawnFuego, tipo: 'fuego' })
    this.gota = new Personaje({ ...spawnGota, tipo: 'gota' })

    this._onResize = () => this.redimensionar()
    window.addEventListener('resize', this._onResize)

    this.activo = true
    this.ultimoTiempo = performance.now()
    this.tick(this.ultimoTiempo)
  }

  detener() {
    this.activo = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize)
      this._onResize = null
    }
    this.atlas.destruir()
  }

  redimensionar() {
    this.anchoVista = window.innerWidth
    this.altoVista = window.innerHeight
    this.canvas.width = this.anchoVista
    this.canvas.height = this.altoVista
    this.actualizarCamara()
  }

  tick = (tiempo) => {
    if (!this.activo) return

    const delta = Math.min((tiempo - this.ultimoTiempo) / 1000, 0.05)
    this.ultimoTiempo = tiempo

    this.actualizar(delta)
    this.renderizar()

    this.rafId = requestAnimationFrame(this.tick)
  }

  actualizar(delta) {
    const teclas = this.teclasRef?.current ?? {}

    this.fuego.aplicarEntrada(teclas)
    this.gota.aplicarEntrada(teclas)

    this.fuego.actualizar(delta, this.solidos)
    this.gota.actualizar(delta, this.solidos)

    this.actualizarCamara()
    this.verificarCharcos()
  }

  /** Mapa fijo: ocupa toda la pantalla sin scroll */
  actualizarCamara() {
    this.camara.x = 0
    this.camara.y = 0
    this.escalaX = this.anchoVista / this.mundo.ancho
    this.escalaY = this.altoVista / this.mundo.alto
  }

  mundoAPantalla(x, y) {
    return {
      x: x * this.escalaX,
      y: y * this.escalaY,
    }
  }

  verificarCharcos() {
    const gatos = [this.fuego, this.gota]

    for (const charco of this.charcos) {
      for (const gato of gatos) {
        if (!rectsColisionan(gato.getBounds(), charco)) continue
        if (!charcoAfectaATipo(charco.tipo, gato.tipo)) continue
        this.onHazard?.(gato.tipo, charco.tipo)
        return
      }
    }
  }

  renderizar() {
    const { ctx, mundo } = this

    ctx.setTransform(this.escalaX, 0, 0, this.escalaY, 0, 0)

    ctx.fillStyle = '#2d1b4e'
    ctx.fillRect(0, 0, mundo.ancho, mundo.alto)

    renderizarTilemap(ctx, this.grid, {
      tileSize: this.tileSize,
      atlas: this.atlas,
      mostrarBordes: false,
    })

    this.fuego.dibujar(ctx, this.atlas)
    this.gota.dibujar(ctx, this.atlas)

    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
}
