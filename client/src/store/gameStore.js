import { create } from 'zustand'
import {
  META_COFRE,
  BONO_BIENVENIDA,
  PEaje_ENTRADA_NIVEL_1,
  obtenerEconomia,
} from '../game/economiaNiveles.js'

/**
 * Estado global: economía, fases del lobby y progreso de niveles.
 */
export const useGameStore = create((set, get) => ({
  pantalla: 'lobby',
  /** intro → bono → peaje (puerta nivel 1) */
  faseLobby: 'intro',
  mensajeLobby: null,
  nivelActual: 0,
  bolsaFuego: 0,
  cofreGota: 0,
  vidas: 3,
  metaCofre: META_COFRE,
  capasDesbloqueadas: false,
  runId: 0,

  /** Paso 1: Iniciar Aventura → bono $20 a Fuego */
  iniciarAventura: () => {
    set({
      faseLobby: 'peaje',
      bolsaFuego: BONO_BIENVENIDA,
      cofreGota: 0,
      mensajeLobby: `¡Bono de Bienvenida Otorgado: $${BONO_BIENVENIDA}!`,
    })
  },

  /** Paso 2: Pagar Entrada $20 → abre Nivel 1 */
  pagarEntradaTemplo: () => {
    const { bolsaFuego } = get()
    if (bolsaFuego < PEaje_ENTRADA_NIVEL_1) return false
    set({
      pantalla: 'juego',
      faseLobby: 'intro',
      nivelActual: 1,
      bolsaFuego: bolsaFuego - PEaje_ENTRADA_NIVEL_1,
      mensajeLobby: null,
      runId: get().runId + 1,
    })
    return true
  },

  setPantalla: (pantalla) => set({ pantalla }),
  setMensajeLobby: (mensajeLobby) => set({ mensajeLobby }),

  setNivel: (nivelActual) => set({ nivelActual }),

  agregarBolsaFuego: (monto) =>
    set((s) => ({ bolsaFuego: s.bolsaFuego + monto })),

  agregarCofreGota: (monto) =>
    set((s) => ({ cofreGota: s.cofreGota + monto })),

  pagarPeajeFuego: (monto) =>
    set((s) => ({
      bolsaFuego: Math.max(0, s.bolsaFuego - monto),
    })),

  /**
   * Al cruzar la puerta de salida: cobra peaje y avanza o victoria.
   * Nivel 1: peaje $20 → Fuego queda con ~$10 si recogió todo.
   */
  completarNivelActual: () => {
    const { nivelActual, bolsaFuego, cofreGota } = get()
    const eco = obtenerEconomia(nivelActual)
    if (!eco || bolsaFuego < eco.peaje) return false

    const nuevaBolsa = bolsaFuego - eco.peaje

    if (nivelActual >= 3) {
      const metaOk = cofreGota >= META_COFRE
      set({
        bolsaFuego: nuevaBolsa,
        pantalla: 'victoria',
        capasDesbloqueadas: metaOk,
        nivelActual: 0,
      })
      return true
    }

    set({
      bolsaFuego: nuevaBolsa,
      nivelActual: nivelActual + 1,
      runId: get().runId + 1,
    })
    return true
  },

  cargarProgreso: ({ nivelActual, bolsaFuego, cofreGota, capasDesbloqueadas }) =>
    set({
      nivelActual: nivelActual ?? 0,
      bolsaFuego: Number(bolsaFuego) || 0,
      cofreGota: Number(cofreGota) || 0,
      capasDesbloqueadas: !!capasDesbloqueadas,
      pantalla: nivelActual > 0 ? 'juego' : 'lobby',
    }),

  perderVida: () => {
    const nuevasVidas = Math.max(0, get().vidas - 1)
    set({
      vidas: nuevasVidas,
      pantalla: 'gameover',
    })
  },

  reintentarNivel: () =>
    set((s) => ({
      pantalla: 'juego',
      runId: s.runId + 1,
    })),

  reiniciarPartida: () =>
    set({
      pantalla: 'lobby',
      faseLobby: 'intro',
      mensajeLobby: null,
      nivelActual: 0,
      bolsaFuego: 0,
      cofreGota: 0,
      vidas: 3,
      capasDesbloqueadas: false,
      runId: 0,
    }),

  metaCumplida: () => get().cofreGota >= get().metaCofre,

  peajeActual: () => {
    const n = get().nivelActual
    return n > 0 ? obtenerEconomia(n).peaje : 0
  },
}))
