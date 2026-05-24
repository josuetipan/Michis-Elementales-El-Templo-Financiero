import { parsearGrid, dimensionesDelMapa } from '../tilemap/collisionGrid.js'
import { renderizarTilemap } from '../tilemap/tilemapRenderer.js'
import { charcoAfectaATipo } from '../tilemap/constants.js'
import { rectsColisionan, crearMurosMundo } from './platformPhysics.js'
import { Personaje } from './personaje.js'
import { SpriteAtlas } from '../sprites/spriteAtlas.js'
import { GatoSpriteLoader } from '../sprites/gatoSpriteLoader.js'
import { Coin } from '../../entities/Coin.js'
import { reproducir } from '../../audio/sounds.js'

/**
 * Motor del juego: tilemap, física, sprites PNG animados y pantalla completa fija.
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
    this.onMoneda = opciones.onMoneda
    this.colorFondo = opciones.colorFondo ?? '#2d1b4e'

    this.activo = false
    this.rafId = null
    this.ultimoTiempo = 0
    this.escalaX = 1
    this.escalaY = 1

    const { solidos, charcos } = parsearGrid(this.grid, this.tileSize)
    this.mundo = dimensionesDelMapa(this.grid, this.tileSize)
    this.solidos = [
      ...solidos,
      ...crearMurosMundo(this.mundo.ancho, this.mundo.alto),
    ]
    this.charcos = charcos
    this.monedas = (opciones.monedas || []).map((m) => new Coin(m))
    this.puerta = opciones.puerta ?? null
    this.onCompletarNivel = opciones.onCompletarNivel
    this.bolsaFuegoRef = opciones.bolsaFuegoRef
    this._puertaActivada = false

    this.atlas = new SpriteAtlas(this.atlasUrl)
    this.gatoSprites = new GatoSpriteLoader()
  }

  async iniciar() {
    await Promise.all([this.atlas.cargar(), this.gatoSprites.cargar()])
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
    this.gatoSprites.destruir()
  }

  redimensionar() {
    this.anchoVista = window.innerWidth
    this.altoVista = window.innerHeight
    this.canvas.width = this.anchoVista
    this.canvas.height = this.altoVista
    this._calcularVista()
  }

  /** Mapa estirado a toda la pantalla, sin scroll */
  _calcularVista() {
    this.escalaX = this.anchoVista / this.mundo.ancho
    this.escalaY = this.altoVista / this.mundo.alto
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

    this.fuego.actualizar(delta, this.solidos, teclas, this.mundo)
    this.gota.actualizar(delta, this.solidos, teclas, this.mundo)

    this.verificarMonedas()
    this.verificarCharcos()
    this.verificarPuerta()
  }

  verificarPuerta() {
    if (!this.puerta || this._puertaActivada) return
    const peaje = this.puerta.peaje ?? 0
    const bolsa = this.bolsaFuegoRef?.current ?? 0
    if (bolsa < peaje) return

    const enPuerta =
      rectsColisionan(this.fuego.getBounds(), this.puerta) ||
      rectsColisionan(this.gota.getBounds(), this.puerta)

    if (enPuerta) {
      this._puertaActivada = true
      reproducir('peaje')
      this.onCompletarNivel?.()
    }
  }

  dibujarPuerta(ctx) {
    if (!this.puerta) return
    const { x, y, width, height, peaje } = this.puerta
    ctx.fillStyle = 'rgba(212, 175, 90, 0.85)'
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = '#f4d58d'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, width, height)
    ctx.fillStyle = '#1a0f2e'
    ctx.font = 'bold 12px Outfit'
    ctx.textAlign = 'center'
    ctx.fillText(`Peaje $${peaje}`, x + width / 2, y + height / 2)
  }

  verificarMonedas() {
    const gatos = [
      { cat: this.fuego, tipo: 'fuego' },
      { cat: this.gota, tipo: 'gota' },
    ]

    for (const moneda of this.monedas) {
      if (moneda.recogida) continue

      for (const { cat, tipo } of gatos) {
        if (moneda.type !== tipo) continue
        if (!rectsColisionan(cat.getBounds(), moneda.getBounds())) continue

        moneda.recogida = true
        reproducir('moneda')
        this.onMoneda?.(moneda.type, moneda.value)
      }
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

    ctx.fillStyle = this.colorFondo
    ctx.fillRect(0, 0, mundo.ancho, mundo.alto)

    renderizarTilemap(ctx, this.grid, {
      tileSize: this.tileSize,
      atlas: this.atlas,
      mostrarBordes: false,
    })

    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, mundo.ancho, mundo.alto)
    ctx.clip()

    for (const moneda of this.monedas) moneda.dibujar(ctx)

    this.dibujarPuerta(ctx)

    this.fuego.dibujar(ctx, this.gatoSprites)
    this.gota.dibujar(ctx, this.gatoSprites)

    ctx.restore()

    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
}
