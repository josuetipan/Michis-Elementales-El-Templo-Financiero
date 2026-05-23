import Matter from 'matter-js'
import { crearMotorFisica, rectsColisionan } from './physics.js'
import { PixiLayer } from './pixiLayer.js'
import { Cat } from '../entities/Cat.js'
import { Platform } from '../entities/Platform.js'
import { Coin } from '../entities/Coin.js'
import { Hazard } from '../entities/Hazard.js'
import { Door } from '../entities/Door.js'
import { reproducir } from '../audio/sounds.js'

/**
 * Bucle principal del juego: física Matter, render Canvas 2D y capa Pixi.
 */
export class GameLoop {
  constructor({
    canvas,
    pixiContainer,
    nivel,
    teclasRef,
    onMoneda,
    onGameOver,
    onPuerta,
  }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.pixiContainer = pixiContainer
    this.nivel = nivel
    this.teclasRef = teclasRef
    this.onMoneda = onMoneda
    this.onGameOver = onGameOver
    this.onPuerta = onPuerta

    this.activo = false
    this._detenido = false
    this.rafId = null
    this.ultimoTiempo = 0

    this.pixi = new PixiLayer(pixiContainer)
    this.camara = { x: 0, y: 0 }
  }

  async iniciar() {
    this._detenido = false
    const { nivel } = this
    this.redimensionar()

    const { engine, world } = crearMotorFisica()
    this.engine = engine
    this.world = world

    this.plataformas = (nivel.platforms || []).map(
      (p) => new Platform(world, p),
    )
    this.monedas = (nivel.coins || []).map((c) => new Coin(c))
    this.hazards = (nivel.hazards || []).map((h) => new Hazard(h))
    this.puertas = (nivel.doors || []).map((d) => new Door(d))

    const spawn = nivel.spawn || {
      fuego: { x: 100, y: 400 },
      gota: { x: 180, y: 400 },
    }

    this.gatoFuego = new Cat(world, engine, {
      ...spawn.fuego,
      type: 'fuego',
    })
    this.gatoGota = new Cat(world, engine, {
      ...spawn.gota,
      type: 'gota',
    })

    await this.pixi.iniciar(this.canvas.width, this.canvas.height)

    if (this._detenido || !this.pixi.listo) {
      this.pixi.destruir()
      return
    }

    await this.pixi.cargarSpritesGatos()

    if (this._detenido) {
      this.pixi.destruir()
      return
    }

    this.pixi.registrarGato('fuego', 'fuego')
    this.pixi.registrarGato('gota', 'gota')

    this._manejarResize = () => this.redimensionar()
    window.addEventListener('resize', this._manejarResize)

    this.activo = true
    this.ultimoTiempo = performance.now()
    this.tick(this.ultimoTiempo)
  }

  detener() {
    this._detenido = true
    this.activo = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    if (this._manejarResize) {
      window.removeEventListener('resize', this._manejarResize)
      this._manejarResize = null
    }
    this.pixi?.destruir()
    if (this.engine) {
      Matter.World.clear(this.world)
      Matter.Engine.clear(this.engine)
    }
  }

  redimensionar() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.canvas.width = w
    this.canvas.height = h
    this.anchoVista = w
    this.altoVista = h
    this.pixi.redimensionar(w, h)
  }

  tick = (tiempo) => {
    if (!this.activo) return

    const delta = Math.min((tiempo - this.ultimoTiempo) / 1000, 0.05)
    this.ultimoTiempo = tiempo

    this.actualizar(delta)
    this.renderizar()

    this.rafId = requestAnimationFrame(this.tick)
  }

  actualizar() {
    const teclas = this.teclasRef.current || {}

    this.gatoFuego.aplicarEntrada(teclas)
    this.gatoGota.aplicarEntrada(teclas)

    Matter.Engine.update(this.engine, 1000 / 60)

    this.gatoFuego.actualizar(teclas)
    this.gatoGota.actualizar(teclas)

    this.actualizarCamara()
    this.verificarMonedas()
    this.verificarHazards()
    this.verificarPuertas()

    const pxF = this.gatoFuego.body.position.x - this.camara.x
    const pyF = this.gatoFuego.body.position.y - this.camara.y + 26
    const pxG = this.gatoGota.body.position.x - this.camara.x
    const pyG = this.gatoGota.body.position.y - this.camara.y + 26

    this.pixi.actualizarGato('fuego', {
      x: pxF,
      y: pyF,
      estado: this.gatoFuego.estadoAnim,
      facing: this.gatoFuego.facing,
      tipo: 'fuego',
    })
    this.pixi.actualizarGato('gota', {
      x: pxG,
      y: pyG,
      estado: this.gatoGota.estadoAnim,
      facing: this.gatoGota.facing,
      tipo: 'gota',
    })
  }

  /** Cámara centrada entre ambos gatos */
  actualizarCamara() {
    const mx =
      (this.gatoFuego.body.position.x + this.gatoGota.body.position.x) / 2
    const my =
      (this.gatoFuego.body.position.y + this.gatoGota.body.position.y) / 2
    const mundoW = this.nivel.worldWidth || 1280
    const mundoH = this.nivel.worldHeight || 720

    this.camara.x = Math.max(
      0,
      Math.min(mx - this.anchoVista / 2, mundoW - this.anchoVista),
    )
    this.camara.y = Math.max(
      0,
      Math.min(my - this.altoVista / 2, mundoH - this.altoVista),
    )
  }

  verificarMonedas() {
    const gatos = [
      { cat: this.gatoFuego, tipo: 'fuego' },
      { cat: this.gatoGota, tipo: 'gota' },
    ]

    for (const moneda of this.monedas) {
      if (moneda.recogida) continue
      if (moneda.type !== 'fuego' && moneda.type !== 'gota') continue

      for (const { cat, tipo } of gatos) {
        if (moneda.type !== tipo) continue
        if (rectsColisionan(cat.getBounds(), moneda.getBounds())) {
          moneda.recogida = true
          reproducir('moneda')
          const cx = moneda.x + moneda.width / 2 - this.camara.x
          const cy = moneda.y + moneda.height / 2 - this.camara.y
          this.pixi.emitirParticulasMoneda(
            cx,
            cy,
            moneda.type === 'fuego' ? 0xfbbf24 : 0x7dd3fc,
          )
          this.onMoneda?.(moneda.type, moneda.value)
        }
      }
    }
  }

  verificarHazards() {
    const gatos = [this.gatoFuego, this.gatoGota]

    for (const hazard of this.hazards) {
      for (const gato of gatos) {
        if (!hazard.afectaATipo(gato.type)) continue
        if (rectsColisionan(gato.getBounds(), hazard.getBounds())) {
          reproducir('gameOver')
          this.onGameOver?.(gato.type, hazard.type)
          return
        }
      }
    }
  }

  verificarPuertas() {
    for (const puerta of this.puertas) {
      const boundsF = this.gatoFuego.getBounds()
      const boundsG = this.gatoGota.getBounds()
      const enPuerta =
        rectsColisionan(boundsF, puerta.getBounds()) ||
        rectsColisionan(boundsG, puerta.getBounds())
      if (enPuerta) this.onPuerta?.(puerta)
    }
  }

  renderizar() {
    const ctx = this.ctx
    const { camara, anchoVista, altoVista, nivel } = this

    ctx.fillStyle = '#1a0f2e'
    ctx.fillRect(0, 0, anchoVista, altoVista)

    ctx.save()
    ctx.translate(-camara.x, -camara.y)

    ctx.fillStyle = '#2d1b4e'
    ctx.fillRect(
      0,
      0,
      nivel.worldWidth || 1280,
      nivel.worldHeight || 720,
    )

    for (const p of this.plataformas) p.dibujar(ctx)
    for (const h of this.hazards) h.dibujar(ctx)
    for (const m of this.monedas) m.dibujar(ctx)
    for (const d of this.puertas) d.dibujar(ctx)

    ctx.restore()
  }
}
