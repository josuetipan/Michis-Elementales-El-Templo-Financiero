/**
 * Tipos de celda del grid del templo.
 * 0 = vacío | 1 = suelo | R/A/C = charcos financieros
 */
export const TILE = {
  VACIO: 0,
  SUELO: 1,
  DEUDA: 'R',
  INFLACION: 'A',
  GASTO_HORMIGA: 'C',
}

/** Colores de respaldo cuando el sprite atlas aún no cargó */
export const TILE_COLORES = {
  [TILE.VACIO]: null,
  [TILE.SUELO]: '#e8e4dc',
  [TILE.DEUDA]: '#ff2d2d',
  [TILE.INFLACION]: '#00b4ff',
  [TILE.GASTO_HORMIGA]: '#8b5a2b',
}

/**
 * Reglas de game over alineadas con entities/Hazard.js
 * R (deuda) → elimina a Gota | A (inflación) → elimina a Fuego | C → ambos
 */
export const REGLAS_CHARCO = {
  [TILE.DEUDA]: { afecta: 'gota', etiqueta: 'deuda' },
  [TILE.INFLACION]: { afecta: 'fuego', etiqueta: 'inflacion' },
  [TILE.GASTO_HORMIGA]: { afecta: 'ambos', etiqueta: 'gasto_hormiga' },
}

/** ¿El charco elimina a este tipo de gato? */
export function charcoAfectaATipo(tipoCelda, tipoGato) {
  const regla = REGLAS_CHARCO[tipoCelda]
  if (!regla) return false
  return regla.afecta === 'ambos' || regla.afecta === tipoGato
}

/** Normaliza valores del grid (números, strings, etc.) */
export function normalizarCelda(valor) {
  if (valor === 1 || valor === '1') return TILE.SUELO
  if (valor === 0 || valor === '0' || valor == null) return TILE.VACIO
  if (typeof valor === 'string') return valor.toUpperCase()
  return valor
}

export function esSueloSolido(celda) {
  return normalizarCelda(celda) === TILE.SUELO
}

export function esCharco(celda) {
  const c = normalizarCelda(celda)
  return c === TILE.DEUDA || c === TILE.INFLACION || c === TILE.GASTO_HORMIGA
}
