import { crearColeccionables } from '../../game/economiaNiveles.js'
import {
  construirLaberintoFW,
  centroPlataforma,
  monedasEnRuta,
  zonaSalidaSuperior,
  layoutNivel2,
  charcosSuelo,
  spawnEnSuelo,
} from './laberintoBuilder.js'

export const PLATAFORMAS_N2 = layoutNivel2()

export const GRID_NIVEL_2 = construirLaberintoFW(PLATAFORMAS_N2, charcosSuelo(2))

export const SPAWN_NIVEL_2 = {
  fuego: spawnEnSuelo(10),
  gota: spawnEnSuelo(40),
}

export const PUERTA_NIVEL_2 = zonaSalidaSuperior(80)

export const MONEDAS_NIVEL_2 = crearColeccionables(2, {
  fuegoMonedas: monedasEnRuta(PLATAFORMAS_N2, 'fuego', 4),
  gotaMonedas: monedasEnRuta(PLATAFORMAS_N2, 'gota', 4),
  fajoFuego: centroPlataforma(11, 17, 25),
  fajoGota: centroPlataforma(11, 23, 31),
})
