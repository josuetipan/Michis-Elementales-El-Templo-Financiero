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
  rellenarRect(grid, 16, 5, 16, 12, 1)
  rellenarRect(grid, 13, 18, 13, 26, 1)
  rellenarRect(grid, 16, 30, 16, 38, 1)
  rellenarRect(grid, 11, 14, 15, 14, 1)

  rellenarRect(grid, FILAS - 1, 12, FILAS - 1, 15, 'A')
  rellenarRect(grid, FILAS - 1, 20, FILAS - 1, 23, 'R')
  rellenarRect(grid, FILAS - 1, 28, FILAS - 1, 32, 'C')
  rellenarRect(grid, FILAS - 1, 36, FILAS - 1, 40, 'C')

  return grid
}

export const GRID_NIVEL_2 = construirGrid()

export const SPAWN_NIVEL_2 = {
  fuego: { x: 100, y: 632 },
  gota: { x: 180, y: 632 },
}

export const PUERTA_NIVEL_2 = {
  x: 47 * 32,
  y: 19 * 32,
  width: 40,
  height: 80,
  peaje: 80,
}

/** 4 monedas $5 + 1 fajo $50 por gato */
export const MONEDAS_NIVEL_2 = crearColeccionables(2, {
  fuegoMonedas: [
    { x: 200, y: 608 },
    { x: 350, y: 608 },
    { x: 500, y: 608 },
    { x: 650, y: 608 },
  ],
  gotaMonedas: [
    { x: 250, y: 608 },
    { x: 400, y: 608 },
    { x: 550, y: 608 },
    { x: 700, y: 608 },
  ],
  fajoFuego: { x: 32 * 32, y: 15 * 32 },
  fajoGota: { x: 22 * 32, y: 12 * 32 },
})
