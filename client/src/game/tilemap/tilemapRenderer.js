import { TILE, normalizarCelda } from './constants.js'
import { dibujarTileSuelo, dibujarCharco } from '../mapCanvas.js'
import { ladoEnPlataforma } from '../../levels/grids/laberintoBuilder.js'

export function renderizarTilemap(ctx, grid, opciones = {}) {
  const {
    tileSize = 32,
    offsetX = 0,
    offsetY = 0,
    tiempo = 0,
    plataformas = [],
  } = opciones
  const filasTotal = grid.length

  for (let fila = 0; fila < filasTotal; fila++) {
    for (let col = 0; col < grid[fila].length; col++) {
      const celda = normalizarCelda(grid[fila][col])
      if (celda === TILE.VACIO) continue

      const x = offsetX + col * tileSize
      const y = offsetY + fila * tileSize

      if (celda === TILE.SUELO) {
        const lado = ladoEnPlataforma(plataformas, fila, col)
        dibujarTileSuelo(ctx, x, y, tileSize, grid, fila, col, filasTotal, lado)
        continue
      }

      if (
        celda === TILE.DEUDA ||
        celda === TILE.INFLACION ||
        celda === TILE.GASTO_HORMIGA
      ) {
        dibujarCharco(ctx, celda, x, y, tileSize, tiempo)
      }
    }
  }
}
