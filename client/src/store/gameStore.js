import { create } from 'zustand'

/** Estado global del juego: economía, nivel y pantalla activa */
export const useGameStore = create((set, get) => ({
  pantalla: 'lobby',
  nivelActual: 0,
  bolsaFuego: 0,
  cofreGota: 0,
  vidas: 3,
  metaCofre: 200,
  /** Incrementa al reintentar para remontar el canvas */
  runId: 0,

  /** Lobby: bono $20 a Fuego antes del nivel 1 */
  iniciarDesdeLobby: () =>
    set({
      pantalla: 'juego',
      nivelActual: 1,
      bolsaFuego: 20,
      cofreGota: 0,
    }),

  setPantalla: (pantalla) => set({ pantalla }),

  setNivel: (nivelActual) => set({ nivelActual }),

  agregarBolsaFuego: (monto) =>
    set((s) => ({ bolsaFuego: s.bolsaFuego + monto })),

  agregarCofreGota: (monto) =>
    set((s) => ({ cofreGota: s.cofreGota + monto })),

  pagarPeajeFuego: (monto) =>
    set((s) => ({
      bolsaFuego: Math.max(0, s.bolsaFuego - monto),
    })),

  /** Restaura economía al cargar progreso desde API (futuro) */
  cargarProgreso: ({ nivelActual, bolsaFuego, cofreGota }) =>
    set({
      nivelActual: nivelActual ?? 0,
      bolsaFuego: Number(bolsaFuego) || 0,
      cofreGota: Number(cofreGota) || 0,
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
      nivelActual: 0,
      bolsaFuego: 0,
      cofreGota: 0,
      vidas: 3,
      runId: 0,
    }),

  /** Meta: cofre Gota >= $200 */
  metaCumplida: () => get().cofreGota >= get().metaCofre,
}))
