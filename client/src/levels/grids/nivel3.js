import { crearColeccionables } from '../../game/economiaNiveles.js'
import {
  construirLaberintoFW,
  centroPlataforma,
  monedasEnRuta,
  zonaSalidaSuperior,
  layoutNivel3,
  charcosSuelo,
  spawnEnSuelo,
} from './laberintoBuilder.js'

export const PLATAFORMAS_N3 = layoutNivel3()

export const GRID_NIVEL_3 = construirLaberintoFW(PLATAFORMAS_N3, charcosSuelo(3))

export const SPAWN_NIVEL_3 = {
  fuego: spawnEnSuelo(10),
  gota: spawnEnSuelo(40),
}

export const PUERTA_NIVEL_3 = zonaSalidaSuperior(100)

export const MONEDAS_NIVEL_3 = crearColeccionables(3, {
  fuegoMonedas: monedasEnRuta(PLATAFORMAS_N3, 'fuego', 10),
  gotaMonedas: monedasEnRuta(PLATAFORMAS_N3, 'gota', 10),
  fajoFuego: centroPlataforma(10, 18, 28),
  fajoGota: centroPlataforma(13, 24, 32),
})
