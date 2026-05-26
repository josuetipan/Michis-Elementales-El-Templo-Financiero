import { FONDO_MAPA_URL } from './assetUrls.js'

export { FONDO_MAPA_URL }

export function cargarImagen(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => {
      console.warn(`[mapAssets] No se pudo cargar: ${src}`)
      resolve(null)
    }
    img.src = src
  })
}

/** Dibuja la imagen cubriendo todo el mundo (object-fit: cover) */
export function dibujarFondoMapa(ctx, imagen, anchoMundo, altoMundo) {
  if (!imagen?.width) return false

  const ratioImg = imagen.width / imagen.height
  const ratioMundo = anchoMundo / altoMundo
  let dw
  let dh
  let dx
  let dy

  if (ratioImg > ratioMundo) {
    dh = altoMundo
    dw = dh * ratioImg
    dx = (anchoMundo - dw) / 2
    dy = 0
  } else {
    dw = anchoMundo
    dh = dw / ratioImg
    dx = 0
    dy = (altoMundo - dh) / 2
  }

  ctx.drawImage(imagen, dx, dy, dw, dh)
  return true
}
