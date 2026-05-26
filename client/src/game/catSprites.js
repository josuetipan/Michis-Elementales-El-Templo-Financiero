import { assetUrl } from './assetUrls.js'

/**
 * Rutas de sprites por personaje y acción (sin variantes *Capa*).
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
    quieto: assetUrl('Image/GatoFuegoQuieto.png'),
    caminando: assetUrl('Image/GatoFuegoCaminando.png'),
    salto: assetUrl('Image/GatoFuegoSalto.png'),
    aterizaje: assetUrl('Image/GatoFuegoAterizaje.png'),
    lanzando: assetUrl('Image/GatoFuegoLanzandoFuego.png'),
  },
  gota: {
    quieto: assetUrl('Image/GatoAguaQuieto.png'),
    caminando: assetUrl('Image/GatoAguaCaminando.png'),
    salto: assetUrl('Image/GatoAguaSalto.png'),
    aterizaje: assetUrl('Image/GatoAguaAterizaje.png'),
    lanzando: assetUrl('Image/GatoAguaLanzandoChorro.png'),
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
