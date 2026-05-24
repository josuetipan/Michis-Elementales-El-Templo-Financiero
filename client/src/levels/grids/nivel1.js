/**
 * Grid del Nivel 1 — Puerta del Presupuesto
 * 50 columnas × 23 filas @ 32px = 1600 × 736 px
 *
 * Leyenda: 0 vacío | 1 suelo | R deuda | A inflación | C gasto hormiga
 */

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

  // Suelo base (dos filas inferiores)
  rellenarRect(grid, FILAS - 2, 0, FILAS - 1, COLS - 1, 1)

  // Plataformas flotantes
  rellenarRect(grid, 16, 7, 16, 13, 1)
  rellenarRect(grid, 13, 19, 13, 24, 1)
  rellenarRect(grid, 16, 28, 16, 34, 1)

  // Barrera vertical (puzzle presupuesto)
  rellenarRect(grid, 10, 15, 14, 15, 1)

  // Charcos financieros en el suelo
  rellenarRect(grid, FILAS - 1, 16, FILAS - 1, 18, 'R') // deuda
  rellenarRect(grid, FILAS - 1, 23, FILAS - 1, 25, 'A') // inflación
  rellenarRect(grid, FILAS - 1, 34, FILAS - 1, 37, 'C') // gasto hormiga

  return grid
}

export const GRID_NIVEL_1 = construirGrid()

/** Spawns en píxeles (apoyados sobre la fila 21: y = 21×32 − altoGato) */
export const SPAWN_NIVEL_1 = {
  fuego: { x: 120, y: 632 },
  gota: { x: 200, y: 632 },
}
