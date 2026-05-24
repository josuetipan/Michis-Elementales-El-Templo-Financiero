import { TILE, TILE_COLORES, normalizarCelda } from './constants.js'

/**
 * Dibuja el grid completo en el canvas.
 * Usa sprites del atlas si están cargados; si no, rectángulos de color.
 */
export function renderizarTilemap(ctx, grid, opciones = {}) {
  const {
    tileSize = 32,
    atlas = null,
    offsetX = 0,
    offsetY = 0,
    mostrarBordes = false,
    omitirSuelo = false,
  } = opciones

  for (let fila = 0; fila < grid.length; fila++) {
    for (let col = 0; col < grid[fila].length; col++) {
      const celda = normalizarCelda(grid[fila][col])
      if (celda === TILE.VACIO) continue
      if (omitirSuelo && celda === TILE.SUELO) continue

      const x = offsetX + col * tileSize
      const y = offsetY + fila * tileSize
      const spriteId = celdaATipoSprite(celda)

      if (atlas?.listo && spriteId) {
        atlas.dibujar(ctx, spriteId, x, y, tileSize, tileSize)
      } else {
        dibujarCeldaColor(ctx, celda, x, y, tileSize, mostrarBordes)
      }
    }
  }
}

/** Mapeo celda → id de frame en el atlas */
function celdaATipoSprite(celda) {
  const mapa = {
    [TILE.SUELO]: 'suelo',
    [TILE.DEUDA]: 'charco_deuda',
    [TILE.INFLACION]: 'charco_inflacion',
    [TILE.GASTO_HORMIGA]: 'charco_gasto',
  }
  return mapa[celda] ?? null
}

function dibujarCeldaColor(ctx, celda, x, y, size, mostrarBordes) {
  const color = TILE_COLORES[celda]
  if (!color) return

  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)

  // Brillo sutil en charcos para dar sensación de líquido
  if (celda === TILE.DEUDA || celda === TILE.INFLACION || celda === TILE.GASTO_HORMIGA) {
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.fillRect(x + 2, y + 2, size * 0.45, size * 0.25)
  }

  if (mostrarBordes && celda === TILE.SUELO) {
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1)
  }
}
