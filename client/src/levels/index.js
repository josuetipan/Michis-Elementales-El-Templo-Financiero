import level1 from './level1.json'
import level2 from './level2.json'
import level3 from './level3.json'

/** Mapa de niveles por id */
export const niveles = {
  1: level1,
  2: level2,
  3: level3,
}

export function obtenerNivel(id) {
  return niveles[id] ?? level1
}
