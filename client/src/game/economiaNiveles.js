/**
 * Economía exacta del documento de diseño — 3 niveles + peajes.
 */
export const ECONOMIA_NIVELES = {
  1: {
    id: 1,
    nombre: 'El Despegue',
    valorMoneda: 1,
    valorFajo: 20,
    monedasPorGato: 10,
    fajosPorGato: 1,
    peaje: 20,
    /** Total en mapa por gato: 10×$1 + $20 = $30 */
  },
  2: {
    id: 2,
    nombre: 'La Expansión',
    valorMoneda: 5,
    valorFajo: 50,
    monedasPorGato: 4,
    fajosPorGato: 1,
    peaje: 80,
  },
  3: {
    id: 3,
    nombre: 'El Gran Retorno',
    valorMoneda: 5,
    valorFajo: 50,
    monedasPorGato: 10,
    fajosPorGato: 1,
    peaje: 100,
  },
}

export const META_COFRE = 200
export const BONO_BIENVENIDA = 20
export const PEaje_ENTRADA_NIVEL_1 = 20

export function obtenerEconomia(nivel) {
  return ECONOMIA_NIVELES[nivel] ?? ECONOMIA_NIVELES[1]
}

/** Genera monedas + fajos según el diseño del nivel */
export function crearColeccionables(nivel, posiciones) {
  const eco = obtenerEconomia(nivel)
  const items = []

  for (const p of posiciones.fuegoMonedas ?? []) {
    items.push({
      x: p.x,
      y: p.y,
      width: p.w ?? 22,
      height: p.h ?? 22,
      type: 'fuego',
      kind: 'moneda',
      value: eco.valorMoneda,
    })
  }
  for (const p of posiciones.gotaMonedas ?? []) {
    items.push({
      x: p.x,
      y: p.y,
      width: p.w ?? 22,
      height: p.h ?? 22,
      type: 'gota',
      kind: 'moneda',
      value: eco.valorMoneda,
    })
  }
  if (posiciones.fajoFuego) {
    const p = posiciones.fajoFuego
    items.push({
      x: p.x,
      y: p.y,
      width: p.w ?? 36,
      height: p.h ?? 28,
      type: 'fuego',
      kind: 'fajo',
      value: eco.valorFajo,
    })
  }
  if (posiciones.fajoGota) {
    const p = posiciones.fajoGota
    items.push({
      x: p.x,
      y: p.y,
      width: p.w ?? 36,
      height: p.h ?? 28,
      type: 'gota',
      kind: 'fajo',
      value: eco.valorFajo,
    })
  }

  return items
}
