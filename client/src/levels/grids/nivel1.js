import { crearColeccionables } from '../../game/economiaNiveles.js'
import {
  construirLaberintoFW,
  centroPlataforma,
  monedasEnRuta,
  zonaSalidaSuperior,
  layoutNivel1,
  charcosSuelo,
  spawnEnSuelo,
} from './laberintoBuilder.js'

export const PLATAFORMAS_N1 = layoutNivel1()

export const GRID_NIVEL_1 = construirLaberintoFW(PLATAFORMAS_N1, charcosSuelo(1))

export const SPAWN_NIVEL_1 = {
  fuego: spawnEnSuelo(10),
  gota: spawnEnSuelo(40),
}

export const PUERTA_NIVEL_1 = zonaSalidaSuperior(20)

const rutaFuego = PLATAFORMAS_N1.filter((p) => p.lado === 'fuego' || p.lado === 'ambos')
const rutaGota = PLATAFORMAS_N1.filter((p) => p.lado === 'gota' || p.lado === 'ambos')

export const MONEDAS_NIVEL_1 = crearColeccionables(1, {
  fuegoMonedas: monedasEnRuta(PLATAFORMAS_N1, 'fuego', 10),
  gotaMonedas: monedasEnRuta(PLATAFORMAS_N1, 'gota', 10),
  fajoFuego: centroPlataforma(13, 14, 24),
  fajoGota: centroPlataforma(13, 24, 34),
})
