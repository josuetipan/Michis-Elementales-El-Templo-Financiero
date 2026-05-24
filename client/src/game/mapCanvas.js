/**
 * Renderizado del mapa 100% Canvas — estilo Fireboy & Watergirl.
 */

import { TILE, normalizarCelda } from './tilemap/constants.js'

function esSuelo(valor) {
  return normalizarCelda(valor) === TILE.SUELO
}

/** Fondo del templo */
export function dibujarFondoTemplo(ctx, ancho, alto, tiempo = 0) {
  const grad = ctx.createLinearGradient(0, 0, 0, alto)
  grad.addColorStop(0, '#1a1528')
  grad.addColorStop(0.5, '#252035')
  grad.addColorStop(1, '#1a1020')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, ancho, alto)

  ctx.fillStyle = 'rgba(180, 70, 30, 0.12)'
  ctx.fillRect(0, 0, ancho * 0.48, alto)
  ctx.fillStyle = 'rgba(30, 100, 160, 0.12)'
  ctx.fillRect(ancho * 0.52, 0, ancho * 0.48, alto)

  ctx.strokeStyle = 'rgba(212, 175, 90, 0.05)'
  ctx.lineWidth = 1
  for (let y = 0; y < alto; y += 32) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(ancho, y)
    ctx.stroke()
  }

  const brillo = 0.03 + Math.sin(tiempo * 0.001) * 0.015
  ctx.fillStyle = `rgba(140, 100, 200, ${brillo})`
  ctx.fillRect(ancho * 0.35, alto * 0.1, ancho * 0.3, alto * 0.5)
}

/** Ledge con color de ruta: fuego=naranja, gota=azul, ambos/meta=oro */
export function dibujarLedge(ctx, x, y, size, lado = null) {
  const grosor = Math.max(10, size * 0.34)
  const sy = y

  const top = ctx.createLinearGradient(x, sy, x, sy + grosor)
  top.addColorStop(0, '#a89e94')
  top.addColorStop(1, '#6d6760')
  ctx.fillStyle = top
  ctx.fillRect(x, sy, size, grosor)

  const borde = {
    fuego: 'rgba(232, 93, 4, 0.85)',
    gota: 'rgba(0, 180, 216, 0.85)',
    ambos: 'rgba(244, 213, 141, 0.9)',
    meta: 'rgba(255, 215, 80, 1)',
  }
  ctx.strokeStyle = borde[lado] ?? 'rgba(212, 175, 90, 0.6)'
  ctx.lineWidth = lado === 'meta' ? 2.5 : 1.5
  ctx.strokeRect(x + 0.5, sy + 0.5, size - 1, grosor - 1)

  if (lado === 'meta') {
    ctx.fillStyle = 'rgba(255, 230, 150, 0.35)'
    ctx.fillRect(x, sy, size, grosor)
  }

  const ladrillo = size / 4
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'
  ctx.lineWidth = 1
  for (let i = 1; i < 4; i++) {
    const bx = x + i * ladrillo
    ctx.beginPath()
    ctx.moveTo(bx, sy)
    ctx.lineTo(bx, sy + grosor)
    ctx.stroke()
  }
}

/** Segmento de muro vertical (ladrillo plano, sin salir del tile) */
export function dibujarMuroSegmento(ctx, x, y, size) {
  const grad = ctx.createLinearGradient(x, y, x + size, y)
  grad.addColorStop(0, '#5a5550')
  grad.addColorStop(0.5, '#787068')
  grad.addColorStop(1, '#5a5550')
  ctx.fillStyle = grad
  ctx.fillRect(x, y, size, size)

  ctx.strokeStyle = 'rgba(0,0,0,0.2)'
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1)

  ctx.strokeStyle = 'rgba(212, 175, 90, 0.25)'
  ctx.beginPath()
  ctx.moveTo(x + size / 2, y + 4)
  ctx.lineTo(x + size / 2, y + size - 4)
  ctx.stroke()
}

/** Suelo inferior continuo */
export function dibujarSueloBase(ctx, x, y, size) {
  dibujarLedge(ctx, x, y, size, null)
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.fillRect(x, y + size * 0.34, size, size * 0.66)
}

export function dibujarTileSuelo(ctx, x, y, size, grid, fila, col, filasTotal, lado = null) {
  const abajo = fila < filasTotal - 1 && esSuelo(grid[fila + 1][col])
  const arriba = fila > 0 && esSuelo(grid[fila - 1][col])

  if (fila >= filasTotal - 2) {
    dibujarSueloBase(ctx, x, y, size)
    return
  }

  if (!abajo || (abajo && !arriba)) {
    dibujarLedge(ctx, x, y, size, lado)
    return
  }

  if (abajo && arriba) {
    dibujarMuroSegmento(ctx, x, y, size)
  }
}

/** Flecha ↑ solo en tramos clave (no en todos) */
export function dibujarFlechasGuia(ctx, guias, tiempo = 0) {
  const bounce = Math.sin(tiempo * 0.005) * 2
  const claves = guias.filter((g) => g.lado !== 'meta')
  const paso = Math.max(1, Math.floor(claves.length / 4))

  claves.forEach((g, i) => {
    if (i % paso !== 0 && i !== claves.length - 1) return

    const color =
      g.lado === 'fuego' ? '#ff8c42' : g.lado === 'gota' ? '#48cae4' : '#f4d58d'

    ctx.fillStyle = color
    ctx.globalAlpha = 0.75
    ctx.font = 'bold 11px Outfit'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('↑', g.x, g.y - 8 + bounce)
    ctx.globalAlpha = 1
  })
}

/** Haz de luz vertical hacia la META */
export function dibujarHazMeta(ctx, puerta, altoMundo, tiempo = 0) {
  if (!puerta) return
  const cx = puerta.x + puerta.width / 2
  const pulso = 0.08 + Math.sin(tiempo * 0.003) * 0.04

  const haz = ctx.createLinearGradient(cx, puerta.y, cx, altoMundo)
  haz.addColorStop(0, `rgba(244, 213, 141, ${pulso + 0.1})`)
  haz.addColorStop(0.4, `rgba(244, 213, 141, ${pulso * 0.5})`)
  haz.addColorStop(1, 'rgba(244, 213, 141, 0)')
  ctx.fillStyle = haz
  ctx.fillRect(cx - 24, puerta.y, 48, altoMundo - puerta.y)
}

/** Letrero META arriba al centro (zona libre del HUD) */
export function dibujarMetaSalida(ctx, puerta, tiempo = 0) {
  if (!puerta) return
  const cx = puerta.x + puerta.width / 2
  const py = puerta.y - 2
  const brillo = 0.75 + Math.sin(tiempo * 0.004) * 0.2

  ctx.font = 'bold 11px Outfit'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillText('SUBE AQUÍ', cx, py - 14)

  ctx.fillStyle = `rgba(244, 213, 141, ${brillo})`
  ctx.font = 'bold 15px Cinzel'
  ctx.fillText('★ META ★', cx, py)
}

export function dibujarCharco(ctx, tipo, x, y, size, tiempo = 0) {
  const t = tiempo * 0.003
  const pad = 2
  const w = size - pad * 2
  const h = size * 0.38
  const sy = y

  if (tipo === 'R') {
    ctx.fillStyle = '#cc2222'
    ctx.fillRect(x + pad, sy, w, h)
    ctx.fillStyle = `rgba(255,180,0,${0.6 + Math.sin(t) * 0.2})`
    ctx.font = `bold ${h * 0.7}px Outfit`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('%', x + size / 2, sy + h / 2)
    return
  }

  if (tipo === 'A') {
    ctx.fillStyle = '#2288cc'
    ctx.fillRect(x + pad, sy, w, h)
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(t * 2) * 0.15})`
    ctx.fillRect(x + pad + 2, sy + 2, w * 0.5, h * 0.35)
    return
  }

  if (tipo === 'C') {
    ctx.fillStyle = '#558822'
    ctx.fillRect(x + pad, sy, w, h)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.arc(x + 8 + i * 9, sy + h / 2, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

export function dibujarZonaSalida(ctx, puerta, tiempo = 0) {
  dibujarMetaSalida(ctx, puerta, tiempo)
}
