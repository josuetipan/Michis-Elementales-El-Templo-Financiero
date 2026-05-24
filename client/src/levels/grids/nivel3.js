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
  rellenarRect(grid, 16, 6, 16, 11, 1)
  rellenarRect(grid, 14, 16, 14, 22, 1)
  rellenarRect(grid, 12, 28, 12, 34, 1)
  rellenarRect(grid, 16, 36, 16, 42, 1)

  rellenarRect(grid, FILAS - 1, 10, FILAS - 1, 13, 'C')
  rellenarRect(grid, FILAS - 1, 18, FILAS - 1, 21, 'C')
  rellenarRect(grid, FILAS - 1, 26, FILAS - 1, 29, 'R')
  rellenarRect(grid, FILAS - 1, 34, FILAS - 1, 37, 'A')

  return grid
}

export const GRID_NIVEL_3 = construirGrid()

export const SPAWN_NIVEL_3 = {
  fuego: { x: 80, y: 632 },
  gota: { x: 160, y: 632 },
}

export const PUERTA_NIVEL_3 = {
  x: 47 * 32,
  y: 19 * 32,
  width: 40,
  height: 80,
  peaje: 100,
}

/** 10 monedas $5 + 1 fajo $50 por gato → $100 c/u */
export const MONEDAS_NIVEL_3 = crearColeccionables(3, {
  fuegoMonedas: [
    { x: 140, y: 608 },
    { x: 200, y: 608 },
    { x: 260, y: 608 },
    { x: 320, y: 608 },
    { x: 380, y: 608 },
    { x: 440, y: 608 },
    { x: 500, y: 608 },
    { x: 560, y: 608 },
    { x: 620, y: 608 },
    { x: 680, y: 608 },
  ],
  gotaMonedas: [
    { x: 170, y: 608 },
    { x: 230, y: 608 },
    { x: 290, y: 608 },
    { x: 350, y: 608 },
    { x: 410, y: 608 },
    { x: 470, y: 608 },
    { x: 530, y: 608 },
    { x: 590, y: 608 },
    { x: 650, y: 608 },
    { x: 710, y: 608 },
  ],
  fajoFuego: { x: 38 * 32, y: 15 * 32 },
  fajoGota: { x: 30 * 32, y: 11 * 32 },
})
