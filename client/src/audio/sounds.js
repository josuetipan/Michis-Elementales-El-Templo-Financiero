import { Howl } from 'howler'

/**
 * Configuración de audio con Howler.js.
 * Los archivos en /public/audio se añadirán en iteraciones posteriores.
 */
const crearSonido = (src, opciones = {}) =>
  new Howl({
    src: [src],
    preload: false,
    volume: 0.6,
    ...opciones,
  })

export const sonidos = {
  moneda: crearSonido('/audio/moneda.mp3', { volume: 0.5 }),
  peaje: crearSonido('/audio/peaje.mp3'),
  gameOver: crearSonido('/audio/gameover.mp3'),
  victoria: crearSonido('/audio/victoria.mp3'),
  musicaNivel1: crearSonido('/audio/nivel1.mp3', { loop: true, volume: 0.35 }),
}

/** Reproduce un SFX si el recurso está disponible (evita errores en dev sin assets) */
export function reproducir(id) {
  const s = sonidos[id]
  if (!s) return
  try {
    s.play()
  } catch {
    /* assets pendientes */
  }
}

export function detenerMusica() {
  sonidos.musicaNivel1?.stop()
}
