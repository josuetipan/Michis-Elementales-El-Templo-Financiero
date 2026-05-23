import Matter from 'matter-js'

/**
 * Motor de física Matter.js: mundo, gravedad y cuerpos estáticos del nivel.
 */
export function crearMotorFisica() {
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: 1.2 },
  })

  const world = engine.world

  return { engine, world }
}

/** Crea un cuerpo estático de plataforma desde datos JSON */
export function crearPlataforma(world, datos) {
  const { x, y, width, height } = datos
  const cuerpo = Matter.Bodies.rectangle(
    x + width / 2,
    y + height / 2,
    width,
    height,
    {
      isStatic: true,
      label: 'platform',
      friction: 0.8,
    },
  )
  Matter.World.add(world, cuerpo)
  return cuerpo
}

/**
 * Detecta si un cuerpo está apoyado en alguna plataforma.
 * Usa raycast corto hacia abajo desde el centro del gato.
 */
export function estaEnSuelo(body, engine) {
  const plataformas = engine.world.bodies.filter((b) => b.label === 'platform')
  const origen = { x: body.position.x, y: body.bounds.max.y }
  const destino = { x: body.position.x, y: body.bounds.max.y + 6 }
  const colisiones = Matter.Query.ray(plataformas, origen, destino, 4)
  return colisiones.length > 0
}

/** AABB: rectángulos superpuestos (monedas, hazards) */
export function rectsColisionan(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

/** Bounds del cuerpo Matter como rect en coordenadas de mundo */
export function boundsDelCuerpo(body) {
  const { min, max } = body.bounds
  return {
    x: min.x,
    y: min.y,
    width: max.x - min.x,
    height: max.y - min.y,
  }
}
