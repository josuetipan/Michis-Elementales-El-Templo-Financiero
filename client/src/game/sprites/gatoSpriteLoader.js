import { SPRITES_POR_TIPO, ACCIONES_GATO } from '../catSprites.js'

/**
 * Precarga imágenes PNG de gatos (sin variantes *Capa*) para dibujar en Canvas 2D.
 */
export class GatoSpriteLoader {
  constructor() {
    /** @type {Record<string, HTMLImageElement>} */
    this.imagenes = {}
    this.listo = false
  }

  async cargar() {
    const tareas = []

    for (const tipo of Object.keys(SPRITES_POR_TIPO)) {
      for (const accion of ACCIONES_GATO) {
        const src = SPRITES_POR_TIPO[tipo][accion]
        tareas.push(this._cargarImagen(`${tipo}_${accion}`, src))
      }
    }

    await Promise.all(tareas)
    this.listo = true
  }

  _cargarImagen(clave, src) {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.imagenes[clave] = img
        resolve()
      }
      img.onerror = () => {
        console.warn(`[GatoSpriteLoader] No se pudo cargar: ${src}`)
        resolve()
      }
      img.src = src
    })
  }

  obtener(tipo, accion) {
    return this.imagenes[`${tipo}_${accion}`] ?? null
  }

  destruir() {
    this.imagenes = {}
    this.listo = false
  }
}
