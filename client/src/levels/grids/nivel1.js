import { crearColeccionables } from '../../game/economiaNiveles.js'

const COLS = 50
const FILAS = 23

function filaVacia() {
  return Array(COLS).fill(0)
}

function rellenarRect(grid, f0, c0, f1, c1, valor) {
  for (let f = f0; f <= f1; f++) {
    for (let c = c0; c <= c1; c++) {
      grid[f][c] = valor
    }
  }
}

function construirGrid() {
  const grid = Array.from({ length: FILAS }, filaVacia)

  rellenarRect(grid, FILAS - 2, 0, FILAS - 1, COLS - 1, 1)
  rellenarRect(grid, 16, 7, 16, 13, 1)
  rellenarRect(grid, 13, 19, 13, 24, 1)
  rellenarRect(grid, 16, 28, 16, 34, 1)
  rellenarRect(grid, 10, 15, 14, 15, 1)

  rellenarRect(grid, FILAS - 1, 14, FILAS - 1, 16, 'R')
  rellenarRect(grid, FILAS - 1, 22, FILAS - 1, 24, 'A')
  rellenarRect(grid, FILAS - 1, 33, FILAS - 1, 35, 'C')

  return grid
}

export const GRID_NIVEL_1 = construirGrid()

export const SPAWN_NIVEL_1 = {
  fuego: { x: 120, y: 632 },
  gota: { x: 200, y: 632 },
}

/** Puerta de salida — peaje $20 (documento: Nivel 1) */
export const PUERTA_NIVEL_1 = {
  x: 47 * 32,
  y: 19 * 32,
  width: 40,
  height: 80,
  peaje: 20,
}

/** 10 monedas $1 + 1 fajo $20 por gato */
export const MONEDAS_NIVEL_1 = crearColeccionables(1, {
  fuegoMonedas: [
    { x: 160, y: 608 },
    { x: 220, y: 608 },
    { x: 280, y: 608 },
    { x: 340, y: 608 },
    { x: 400, y: 608 },
    { x: 460, y: 608 },
    { x: 520, y: 608 },
    { x: 580, y: 608 },
    { x: 640, y: 608 },
    { x: 700, y: 608 },
  ],
  gotaMonedas: [
    { x: 180, y: 608 },
    { x: 240, y: 608 },
    { x: 300, y: 608 },
    { x: 360, y: 608 },
    { x: 420, y: 608 },
    { x: 480, y: 608 },
    { x: 540, y: 608 },
    { x: 600, y: 608 },
    { x: 660, y: 608 },
    { x: 720, y: 608 },
  ],
  fajoFuego: { x: 10 * 32, y: 15 * 32 },
  fajoGota: { x: 21 * 32, y: 12 * 32 },
})
