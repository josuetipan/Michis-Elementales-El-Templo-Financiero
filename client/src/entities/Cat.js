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
  },
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
    this.color = type === 'fuego' ? '#e85d04' : '#0077b6'
    this.controles = CONTROLES[type]

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

  actualizar() {
    this.enSuelo = estaEnSuelo(this.body, this.engine)
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
