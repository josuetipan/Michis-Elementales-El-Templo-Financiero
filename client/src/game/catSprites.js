/**
 * Rutas de sprites por personaje y acción.
 * Nombres de archivo: GatoFuego* / GatoAgua* (gota = agua en assets).
 */
export const ACCIONES_GATO = [
  'quieto',
  'caminando',
  'salto',
  'aterizaje',
  'lanzando',
]

export const SPRITES_POR_TIPO = {
  fuego: {
    quieto: '/assets/Image/GatoFuegoQuieto.png',
    caminando: '/assets/Image/GatoFuegoCaminando.png',
    salto: '/assets/Image/GatoFuegoSalto.png',
    aterizaje: '/assets/Image/GatoFuegoAterizaje.png',
    lanzando: '/assets/Image/GatoFuegoLanzandoFuego.png',
  },
  gota: {
    quieto: '/assets/Image/GatoAguaQuieto.png',
    caminando: '/assets/Image/GatoAguaCaminando.png',
    salto: '/assets/Image/GatoAguaSalto.png',
    aterizaje: '/assets/Image/GatoAguaAterizaje.png',
    lanzando: '/assets/Image/GatoAguaLanzandoChorro.png',
  },
}

/** Alias único para Assets.load de Pixi */
export function aliasTextura(tipo, accion) {
  return `gato_${tipo}_${accion}`
}

/** Lista plana { alias, src } para precarga */
export function listarRecursosSprites() {
  const recursos = []
  for (const tipo of Object.keys(SPRITES_POR_TIPO)) {
    for (const accion of ACCIONES_GATO) {
      recursos.push({
        alias: aliasTextura(tipo, accion),
        src: SPRITES_POR_TIPO[tipo][accion],
      })
    }
  }
  return recursos
}
