/**
 * Atlas de sprites (sprite sheet) para el templo y monedas.
 *
 * Cada frame define coordenadas de recorte en la imagen fuente:
 * { sx, sy, sw, sh } — origen y tamaño en píxeles del atlas.
 *
 * Uso:
 *   const atlas = new SpriteAtlas('/sprites/templo-atlas.png')
 *   await atlas.cargar()
 *   atlas.dibujar(ctx, 'suelo', destX, destY, destW, destH)
 */

/** Definición de frames — ajusta sx/sy cuando tengas el PNG real */
export const FRAMES_ATLAS = {
  suelo: { sx: 0, sy: 0, sw: 32, sh: 32 },
  charco_deuda: { sx: 32, sy: 0, sw: 32, sh: 32 },
  charco_inflacion: { sx: 64, sy: 0, sw: 32, sh: 32 },
  charco_gasto: { sx: 96, sy: 0, sw: 32, sh: 32 },
  moneda_fuego: { sx: 0, sy: 32, sw: 16, sh: 16 },
  moneda_gota: { sx: 16, sy: 32, sw: 16, sh: 16 },
  gato_fuego: { sx: 32, sy: 32, sw: 28, sh: 40 },
  gato_gota: { sx: 64, sy: 32, sw: 28, sh: 40 },
}

export class SpriteAtlas {
  constructor(url) {
    this.url = url
    this.imagen = null
    this.listo = false
    this._promesa = null
  }

  /** Precarga la imagen; tolera fallo (el renderer usará colores) */
  cargar() {
    if (this._promesa) return this._promesa
    if (!this.url) {
      this.listo = false
      return Promise.resolve(false)
    }

    this._promesa = new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.imagen = img
        this.listo = true
        resolve(true)
      }
      img.onerror = () => {
        this.listo = false
        resolve(false)
      }
      img.src = this.url
    })

    return this._promesa
  }

  /**
   * Recorta y dibuja un frame del atlas en destino.
   * destW/destH escalan el sprite al tamaño deseado en pantalla.
   */
  dibujar(ctx, frameId, destX, destY, destW, destH) {
    if (!this.listo || !this.imagen) return false

    const frame = FRAMES_ATLAS[frameId]
    if (!frame) return false

    ctx.drawImage(
      this.imagen,
      frame.sx,
      frame.sy,
      frame.sw,
      frame.sh,
      destX,
      destY,
      destW,
      destH,
    )
    return true
  }

  destruir() {
    this.imagen = null
    this.listo = false
    this._promesa = null
  }
}
