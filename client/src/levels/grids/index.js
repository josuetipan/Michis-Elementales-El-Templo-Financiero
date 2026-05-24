import {
  GRID_NIVEL_1,
  SPAWN_NIVEL_1,
  MONEDAS_NIVEL_1,
  PUERTA_NIVEL_1,
} from './nivel1.js'
import {
  GRID_NIVEL_2,
  SPAWN_NIVEL_2,
  MONEDAS_NIVEL_2,
  PUERTA_NIVEL_2,
} from './nivel2.js'
import {
  GRID_NIVEL_3,
  SPAWN_NIVEL_3,
  MONEDAS_NIVEL_3,
  PUERTA_NIVEL_3,
} from './nivel3.js'
import { obtenerEconomia } from '../../game/economiaNiveles.js'

export const gridsPorNivel = {
  1: {
    grid: GRID_NIVEL_1,
    spawn: SPAWN_NIVEL_1,
    monedas: MONEDAS_NIVEL_1,
    puerta: PUERTA_NIVEL_1,
    tileSize: 32,
    economia: obtenerEconomia(1),
  },
  2: {
    grid: GRID_NIVEL_2,
    spawn: SPAWN_NIVEL_2,
    monedas: MONEDAS_NIVEL_2,
    puerta: PUERTA_NIVEL_2,
    tileSize: 32,
    economia: obtenerEconomia(2),
  },
  3: {
    grid: GRID_NIVEL_3,
    spawn: SPAWN_NIVEL_3,
    monedas: MONEDAS_NIVEL_3,
    puerta: PUERTA_NIVEL_3,
    tileSize: 32,
    economia: obtenerEconomia(3),
  },
}

export function obtenerGridNivel(id) {
  return gridsPorNivel[id] ?? gridsPorNivel[1]
}
