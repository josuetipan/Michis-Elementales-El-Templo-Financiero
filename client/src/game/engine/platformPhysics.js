/**
 * Física de plataformas 2D con colisiones AABB puras (sin librerías).
 * Ideal para hackathon: predecible, ligera y fácil de depurar.
 */

export const FISICA = {
  GRAVITY: 1600,
  VELOCIDAD_MAX_CAIDA: 820,
  VELOCIDAD_MOVIMIENTO: 260,
  FUERZA_SALTO: -520,
  FRICCION_SUELO: 0.78,
  FRICCION_AIRE: 0.92,
}

/** Dos rectángulos AABB se superponen */
export function rectsColisionan(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

/**
 * Resuelve colisiones separando ejes (primero X, luego Y).
 * Devuelve si el personaje quedó apoyado en suelo sólido.
 */
export function resolverColisiones(entidad, solidos, delta) {
  entidad.enSuelo = false

  // --- Eje horizontal ---
  entidad.x += entidad.vx * delta
  for (const bloque of solidos) {
    if (!rectsColisionan(entidad, bloque)) continue

    if (entidad.vx > 0) {
      entidad.x = bloque.x - entidad.width
    } else if (entidad.vx < 0) {
      entidad.x = bloque.x + bloque.width
    }
    entidad.vx = 0
  }

  // --- Eje vertical ---
  entidad.y += entidad.vy * delta
  for (const bloque of solidos) {
    if (!rectsColisionan(entidad, bloque)) continue

    if (entidad.vy > 0) {
      entidad.y = bloque.y - entidad.height
      entidad.enSuelo = true
    } else if (entidad.vy < 0) {
      entidad.y = bloque.y + bloque.height
    }
    entidad.vy = 0
  }

  return entidad.enSuelo
}

/** Aplica gravedad y limita la caída */
export function aplicarGravedad(entidad, delta) {
  entidad.vy += FISICA.GRAVITY * delta
  if (entidad.vy > FISICA.VELOCIDAD_MAX_CAIDA) {
    entidad.vy = FISICA.VELOCIDAD_MAX_CAIDA
  }
}

/** Fricción horizontal según esté en suelo o en el aire */
export function aplicarFriccion(entidad) {
  const factor = entidad.enSuelo ? FISICA.FRICCION_SUELO : FISICA.FRICCION_AIRE
  entidad.vx *= factor
  if (Math.abs(entidad.vx) < 4) entidad.vx = 0
}
