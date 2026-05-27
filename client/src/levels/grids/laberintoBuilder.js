/** Grid estilo Fireboy & Watergirl — rutas conectadas hacia la META arriba */
export const COLS = 50
export const FILAS = 23
export const TILE = 32

const MARGEN = 3

export function filaVacia() {
  return Array(COLS).fill(0)
}

export function rellenarRect(grid, f0, c0, f1, c1, valor) {
  for (let f = f0; f <= f1; f++) {
    for (let c = c0; c <= c1; c++) {
      grid[f][c] = valor
    }
  }
}

export function crearGridVacio() {
  return Array.from({ length: FILAS }, filaVacia)
}

export function plataforma(f, c0, c1, lado = 'ambos') {
  return { f, c0, c1, lado }
}

export function centroPlataforma(fila, colInicio, colFin, offsetY = 40) {
  const col = Math.floor((colInicio + colFin) / 2)
  return {
    x: col * TILE + 6,
    y: fila * TILE - offsetY,
  }
}

/** Spawn en el suelo inferior */
export function spawnEnSuelo(col) {
  return {
    x: col * TILE + 4,
    y: (FILAS - 1) * TILE - 40,
  }
}

export function monedasEnRuta(plataformas, tipo, cantidad) {
  const ruta = plataformas.filter(
    (p) => p.lado === tipo || p.lado === 'ambos' || p.lado === 'meta',
  )
  const puntos = []
  const paso = Math.max(1, Math.floor(ruta.length / cantidad))
  for (let i = 0; i < cantidad; i++) {
    const p = ruta[Math.min(i * paso, ruta.length - 1)]
    const pos = centroPlataforma(p.f, p.c0, p.c1)
    puntos.push({ x: pos.x + (tipo === 'fuego' ? -8 : 8), y: pos.y - 6 })
  }
  return puntos
}

function aplicarCaja(grid, apertura = { c0: 20, c1: 29 }) {
  const izq = MARGEN
  const der = COLS - MARGEN - 1

  for (let f = 1; f < FILAS - 1; f++) {
    grid[f][izq] = 1
    grid[f][der] = 1
  }

  for (let c = izq + 1; c < der; c++) {
    if (c < apertura.c0 || c > apertura.c1) {
      grid[1][c] = 1
    }
  }
}

export function construirLaberintoFW(plataformas, charcos = [], apertura = { c0: 20, c1: 29 }) {
  const grid = crearGridVacio()

  rellenarRect(grid, FILAS - 1, MARGEN + 1, FILAS - 1, COLS - MARGEN - 2, 1)

  for (const p of plataformas) {
    rellenarRect(grid, p.f, p.c0, p.f, p.c1, 1)
  }

  aplicarCaja(grid, apertura)

  for (const ch of charcos) {
    rellenarRect(grid, ch.f, ch.c0, ch.f, ch.c1, ch.valor)
  }

  return grid
}

export function zonaSalidaSuperior(peaje, fila = 2, colCentro = 24) {
  const anchoCols = 6
  const c0 = colCentro - Math.floor(anchoCols / 2)
  return {
    x: c0 * TILE,
    y: fila * TILE,
    width: anchoCols * TILE,
    height: TILE,
    peaje,
    fila,
    colCentro,
  }
}

/**
 * Ruta conectada: cada plataforma se solapa con la anterior al subir hacia el centro.
 * Fuego ← izquierda | Gota → derecha | META arriba al centro
 */
export function layoutNivel1() {
  return [
    plataforma(19, 6, 14, 'fuego'),
    plataforma(19, 36, 44, 'gota'),
    plataforma(16, 10, 18, 'fuego'),
    plataforma(16, 32, 40, 'gota'),
    plataforma(13, 14, 24, 'fuego'),
    plataforma(13, 24, 34, 'gota'),
    plataforma(10, 18, 28, 'ambos'),
    plataforma(7, 20, 28, 'ambos'),
    plataforma(4, 21, 27, 'ambos'),
    plataforma(2, 21, 27, 'meta'),
  ]
}

export function layoutNivel2() {
  return [
    plataforma(20, 6, 14, 'fuego'),
    plataforma(20, 36, 44, 'gota'),
    plataforma(17, 9, 17, 'fuego'),
    plataforma(17, 33, 41, 'gota'),
    plataforma(14, 13, 21, 'fuego'),
    plataforma(14, 29, 37, 'gota'),
    plataforma(11, 17, 25, 'fuego'),
    plataforma(11, 23, 31, 'gota'),
    plataforma(8, 19, 27, 'ambos'),
    plataforma(5, 21, 27, 'ambos'),
    plataforma(2, 21, 27, 'meta'),
  ]
}

export function layoutNivel3() {
  return [
    plataforma(20, 6, 14, 'fuego'),
    plataforma(20, 36, 44, 'gota'),
    plataforma(18, 8, 16, 'fuego'),
    plataforma(18, 34, 42, 'gota'),
    plataforma(16, 12, 20, 'fuego'),
    plataforma(16, 30, 38, 'gota'),
    plataforma(13, 16, 24, 'fuego'),
    plataforma(13, 24, 32, 'gota'),
    plataforma(10, 18, 28, 'ambos'),
    plataforma(7, 20, 28, 'ambos'),
    plataforma(4, 21, 27, 'ambos'),
    plataforma(2, 21, 27, 'meta'),
  ]
}

export function charcosSuelo(nivel = 1) {
  const base = [
    { f: FILAS - 1, c0: 18, c1: 19, valor: 'R' },
    { f: FILAS - 1, c0: 24, c1: 25, valor: 'C' },
    { f: FILAS - 1, c0: 30, c1: 31, valor: 'A' },
  ]
  if (nivel >= 2) {
    base.push({ f: FILAS - 1, c0: 21, c1: 22, valor: 'C' })
    base.push({ f: FILAS - 1, c0: 27, c1: 28, valor: 'R' })
  }
  if (nivel >= 3) {
    base.push({ f: FILAS - 1, c0: 20, c1: 21, valor: 'A' })
    base.push({ f: FILAS - 1, c0: 29, c1: 30, valor: 'C' })
  }
  return base
}

/** Busca qué tramo de ruta usa esta celda */
export function ladoEnPlataforma(plataformas, fila, col) {
  for (const p of plataformas) {
    if (p.f === fila && col >= p.c0 && col <= p.c1) return p.lado
  }
  return null
}

/** Centro de cada tramo para dibujar flecha ↑ */
export function centrosGuia(plataformas) {
  return plataformas.map((p) => ({
    x: Math.floor((p.c0 + p.c1) / 2) * TILE + TILE / 2,
    y: p.f * TILE,
    lado: p.lado,
  }))
}
