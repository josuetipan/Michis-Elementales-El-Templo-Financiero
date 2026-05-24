import { GRID_NIVEL_1, SPAWN_NIVEL_1, MONEDAS_NIVEL_1 } from './nivel1.js'

/** Datos de tilemap por id de nivel */
export const gridsPorNivel = {
  1: {
    grid: GRID_NIVEL_1,
    spawn: SPAWN_NIVEL_1,
    monedas: MONEDAS_NIVEL_1,
    tileSize: 32,
  },
}

export function obtenerGridNivel(id) {
  return gridsPorNivel[id] ?? gridsPorNivel[1]
}
