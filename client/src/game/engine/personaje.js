import {
  FISICA,
  aplicarFriccion,
  aplicarGravedad,
  resolverColisiones,
  aplicarLimitesMundo,
} from './platformPhysics.js'

const CONTROLES = {
  fuego: {
    izquierda: 'ArrowLeft',
    derecha: 'ArrowRight',
    salto: 'ArrowUp',
  },
  gota: {
    izquierda: 'KeyA',
    derecha: 'KeyD',
    salto: 'KeyW',
  },
}

const ATAQUE = {
  fuego: 'ArrowDown',
  gota: 'KeyS',
}

const COLORES_GATO = {
  fuego: '#e85d04',
  gota: '#0077b6',
}

/** Escala visual del PNG respecto al hitbox */
const FACTOR_ALTURA_SPRITE = 1.65
/** Ajuste para que los pies del sprite toquen la plataforma */
const OFFSET_PIES = 10

/**
 * Fuego-Gato o Gota-Gato con física AABB y animación por PNG.
 */
export class Personaje {
  constructor({ x, y, tipo, ancho = 28, alto = 40 }) {
    this.x = x
    this.y = y
    this.ancho = ancho
    this.alto = alto
    this.vx = 0
    this.vy = 0
    this.tipo = tipo
    this.enSuelo = false
    this.estabaEnAire = false
    this.framesAterrizaje = 0
    this.estadoAnim = 'quieto'
    this.facing = 1
    this.controles = CONTROLES[tipo]
    this.teclaAtaque = ATAQUE[tipo]
    this.color = COLORES_GATO[tipo]
    this.coyoteTimer = 0
    this.saltoPulsado = false
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.ancho,
      height: this.alto,
    }
  }

  get width() {
    return this.ancho
  }

  get height() {
    return this.alto
  }

  aplicarEntrada(teclas) {
    const c = this.controles
    let movimiento = 0

    if (teclas[c.izquierda]) movimiento -= 1
    if (teclas[c.derecha]) movimiento += 1

    this.vx = movimiento * FISICA.VELOCIDAD_MOVIMIENTO

    const puedeSaltar = this.enSuelo || this.coyoteTimer > 0
    if (teclas[c.salto] && puedeSaltar && !this.saltoPulsado) {
      this.vy = FISICA.FUERZA_SALTO
      this.enSuelo = false
      this.coyoteTimer = 0
      this.saltoPulsado = true
    }

    if (!teclas[c.salto]) {
      this.saltoPulsado = false
    }
  }

  actualizar(delta, solidos, teclas = {}, limites = null) {
    aplicarGravedad(this, delta)
    resolverColisiones(this, solidos, delta)
    aplicarFriccion(this)

    if (limites) {
      aplicarLimitesMundo(this, limites.ancho, limites.alto)
    }

    if (this.enSuelo) {
      this.coyoteTimer = FISICA.COYOTE_MS / 1000
    } else if (this.coyoteTimer > 0) {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta)
    }

    this.actualizarAnimacion(teclas)
  }

  /** Prioriza quieto/caminando cuando está apoyado en una plataforma */
  actualizarAnimacion(teclas) {
    const c = this.controles

    if (teclas[c.derecha]) this.facing = 1
    if (teclas[c.izquierda]) this.facing = -1

    if (this.enSuelo) {
      if (teclas[this.teclaAtaque]) {
        this.estadoAnim = 'lanzando'
        return
      }

      if (this.estabaEnAire) {
        this.estabaEnAire = false
        this.framesAterrizaje = 6
      }

      if (this.framesAterrizaje > 0) {
        this.framesAterrizaje--
        this.estadoAnim = 'aterizaje'
        return
      }

      this.estadoAnim = Math.abs(this.vx) > 8 ? 'caminando' : 'quieto'
      return
    }

    this.estabaEnAire = true
    this.estadoAnim = this.vy < -40 ? 'salto' : 'aterizaje'
  }

  dibujar(ctx, sprites = null) {
    const img =
      sprites?.obtener(this.tipo, this.estadoAnim) ??
      sprites?.obtener(this.tipo, 'quieto')

    if (img?.complete && img.naturalWidth > 0) {
      const centroX = this.x + this.ancho / 2
      const baseY = this.y + this.alto + OFFSET_PIES
      const altura = this.alto * FACTOR_ALTURA_SPRITE
      const ancho = (img.width / img.height) * altura
      const izquierda = centroX - ancho / 2
      const arriba = baseY - altura

      ctx.save()
      if (this.facing < 0) {
        ctx.translate(centroX, 0)
        ctx.scale(-1, 1)
        ctx.translate(-centroX, 0)
      }
      ctx.drawImage(img, izquierda, arriba, ancho, altura)
      ctx.restore()
      return
    }

    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.roundRect(this.x, this.y, this.ancho, this.alto, 6)
    ctx.fill()
    ctx.font = '16px serif'
    ctx.fillStyle = '#fff'
    ctx.fillText(this.tipo === 'fuego' ? '🔥' : '💧', this.x + 4, this.y + 26)
  }
}
