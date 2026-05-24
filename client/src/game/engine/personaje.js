import {
  FISICA,
  aplicarFriccion,
  aplicarGravedad,
  resolverColisiones,
} from './platformPhysics.js'

/** Teclas por personaje — mismo esquema que entities/Cat.js */
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

/** Colores de respaldo si no hay sprite de gato */
const COLORES_GATO = {
  fuego: '#e85d04',
  gota: '#0077b6',
}

/**
 * Fuego-Gato o Gota-Gato con física AABB de plataformas.
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
    this.controles = CONTROLES[tipo]
    this.color = COLORES_GATO[tipo]
  }

  /** Rectángulo de colisión (alias width/height para compatibilidad) */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.ancho,
      height: this.alto,
    }
  }

  /** Alias usados por el resolvedor AABB */
  get width() {
    return this.ancho
  }
  get height() {
    return this.alto
  }

  /** Lee el teclado y aplica movimiento + salto */
  aplicarEntrada(teclas) {
    const c = this.controles
    let movimiento = 0

    if (teclas[c.izquierda]) movimiento -= 1
    if (teclas[c.derecha]) movimiento += 1

    this.vx = movimiento * FISICA.VELOCIDAD_MOVIMIENTO

    if (teclas[c.salto] && this.enSuelo) {
      this.vy = FISICA.FUERZA_SALTO
      this.enSuelo = false
    }
  }

  /** Integra física contra los bloques sólidos del tilemap */
  actualizar(delta, solidos) {
    aplicarGravedad(this, delta)
    aplicarFriccion(this)
    resolverColisiones(this, solidos, delta)
  }

  /** Dibuja el gato (sprite o rectángulo con emoji) */
  dibujar(ctx, atlas = null) {
    const spriteId = this.tipo === 'fuego' ? 'gato_fuego' : 'gato_gota'
    const dibujado = atlas?.dibujar(ctx, spriteId, this.x, this.y, this.ancho, this.alto)

    if (!dibujado) {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.roundRect(this.x, this.y, this.ancho, this.alto, 6)
      ctx.fill()

      ctx.font = '16px serif'
      ctx.fillStyle = '#fff'
      ctx.fillText(this.tipo === 'fuego' ? '🔥' : '💧', this.x + 4, this.y + 26)
    }
  }
}
