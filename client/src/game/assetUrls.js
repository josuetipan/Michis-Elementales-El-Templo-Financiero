/**
 * Rutas de imágenes centralizadas en /src/assets (raíz del repo).
 * Vite resuelve @assets y emite URLs con hash en build.
 */
const modulos = {
  ...import.meta.glob('@assets/Image/*.{png,jpg,jpeg,webp,gif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
  ...import.meta.glob('@assets/*.{png,jpg,jpeg,webp,gif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
}

/**
 * @param {string} rutaRelativa Ej: "Image/lobby.png" o "ingreso.png"
 * @returns {string}
 */
export function assetUrl(rutaRelativa) {
  const normalizada = rutaRelativa.replace(/^\//, '').replace(/\\/g, '/')

  for (const [clave, url] of Object.entries(modulos)) {
    const key = clave.replace(/\\/g, '/')
    if (key.endsWith(`/src/assets/${normalizada}`) || key.endsWith(`@assets/${normalizada}`)) {
      return url
    }
  }

  console.warn(`[assetUrls] No encontrado: ${rutaRelativa}`)
  return ''
}

/** Devuelve la URL o un fallback si el archivo aún no existe */
export function assetUrlConFallback(rutaRelativa, fallbackRelativa) {
  const url = assetUrl(rutaRelativa)
  if (url) return url
  return assetUrl(fallbackRelativa)
}

export const FONDO_LOBBY_URL = assetUrl('Image/lobby.png')
export const FONDO_MAPA_URL = assetUrl('Image/FondoMapa.png')
export const INGRESO_URL = assetUrlConFallback('Image/ingreso.png', 'ingreso.png')
export const CUADRO_MODAL_URL = assetUrl('Image/cuadro.png')
export const FLECHA_BTN_URL = assetUrl('Image/flecha.png')
export const CASA_BTN_URL = assetUrl('Image/casabtn.png')

export const GATO_FUEGO_QUIETO = assetUrl('Image/GatoFuegoQuieto.png')
export const GATO_FUEGO_CAPA = assetUrlConFallback(
  'Image/GatoFuegoQuietoCapa.png',
  'Image/GatoFuegoQuieto.png',
)
export const GATO_GOTA_QUIETO = assetUrl('Image/GatoAguaQuieto.png')
export const GATO_GOTA_CAPA = assetUrlConFallback(
  'Image/GatoAguaQuietoCapa.png',
  'Image/GatoAguaQuieto.png',
)
