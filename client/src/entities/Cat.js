import Matter from 'matter-js'
import { estaEnSuelo } from '../game/physics.js'

/** Controles por tipo de gato */
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
    ataque: 'KeyS',
  },
}

/** Tecla de animación de ataque (lanzar fuego / chorro) */
const ATAQUE = {
  fuego: 'ArrowDown',
  gota: 'KeyS',
}

/**
 * Gato jugador (Fuego o Gota) con cuerpo Matter.js y movimiento lateral + salto.
 */
export class Cat {
  constructor(world, engine, { x, y, type, width = 36, height = 52 }) {
    this.type = type
    this.engine = engine
    this.width = width
    this.height = height
    this.velocidadX = 5.5
    this.fuerzaSalto = 0.045
    this.enSuelo = false
    this.estabaEnAire = false
    this.framesAterrizaje = 0
    this.estadoAnim = 'quieto'
    this.facing = 1
    this.color = type === 'fuego' ? '#e85d04' : '#0077b6'
    this.controles = CONTROLES[type]
    this.teclaAtaque = ATAQUE[type]

    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      friction: 0.05,
      frictionAir: 0.02,
      restitution: 0,
      density: 0.002,
      label: `cat-${type}`,
    })

    Matter.World.add(world, this.body)
  }

  /** Aplica entrada del teclado en el mismo fotograma */
  aplicarEntrada(teclas) {
    const { body } = this
    const c = this.controles
    let vx = 0

    if (teclas[c.izquierda]) vx = -this.velocidadX
    if (teclas[c.derecha]) vx = this.velocidadX

    Matter.Body.setVelocity(body, { x: vx, y: body.velocity.y })

    if (teclas[c.salto] && this.enSuelo) {
      Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 })
      Matter.Body.applyForce(body, body.position, {
        x: 0,
        y: -this.fuerzaSalto * body.mass,
      })
    }
  }

  actualizar(teclas = {}) {
    this.enSuelo = estaEnSuelo(this.body, this.engine)
    this.actualizarAnimacion(teclas)
  }

  /**
   * Elige sprite según física y teclas (quieto, caminar, salto, aterrizaje, lanzar).
   */
  actualizarAnimacion(teclas) {
    const vx = this.body.velocity.x
    const vy = this.body.velocity.y
    const c = this.controles

    if (teclas[c.derecha]) this.facing = 1
    if (teclas[c.izquierda]) this.facing = -1

    if (teclas[this.teclaAtaque] && this.enSuelo) {
      this.estadoAnim = 'lanzando'
      return
    }

    if (!this.enSuelo) {
      this.estabaEnAire = true
      if (vy < -0.2) this.estadoAnim = 'salto'
      else this.estadoAnim = 'aterizaje'
      return
    }

    if (this.estabaEnAire) {
      this.estabaEnAire = false
      this.framesAterrizaje = 10
    }

    if (this.framesAterrizaje > 0) {
      this.framesAterrizaje--
      this.estadoAnim = 'aterizaje'
      return
    }

    if (Math.abs(vx) > 0.25) this.estadoAnim = 'caminando'
    else this.estadoAnim = 'quieto'
  }

  /** Rectángulo para colisiones con monedas y hazards */
  getBounds() {
    const b = this.body.bounds
    return {
      x: b.min.x,
      y: b.min.y,
      width: b.max.x - b.min.x,
      height: b.max.y - b.min.y,
    }
  }
}
