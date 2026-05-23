import { esCharco, esSueloSolido, normalizarCelda } from './constants.js'

/**
 * Convierte el grid en rectángulos AABB para colisiones y hazards.
 * Cada celda sólida o charco genera un tile del tamaño tileSize.
 */
export function parsearGrid(grid, tileSize = 32) {
  const solidos = []
  const charcos = []

  for (let fila = 0; fila < grid.length; fila++) {
    for (let col = 0; col < grid[fila].length; col++) {
      const celda = normalizarCelda(grid[fila][col])
      const rect = {
        x: col * tileSize,
        y: fila * tileSize,
        width: tileSize,
        height: tileSize,
        fila,
        col,
        tipo: celda,
      }

      if (esSueloSolido(celda)) solidos.push(rect)
      else if (esCharco(celda)) charcos.push(rect)
    }
  }

  return { solidos, charcos }
}

/** Dimensiones del mundo en píxeles a partir del grid */
export function dimensionesDelMapa(grid, tileSize = 32) {
  const filas = grid.length
  const columnas = Math.max(...grid.map((f) => f.length), 0)
  return {
    ancho: columnas * tileSize,
    alto: filas * tileSize,
    columnas,
    filas,
  }
}
