import { create } from 'zustand'

/**
 * Estado de entrada del jugador (teclas activas).
 * Compartido entre el bucle Canvas y futuros sistemas de red.
 */
export const usePlayerStore = create((set) => ({
  teclas: {},

  /** Marca una tecla como presionada o liberada */
  setTecla: (codigo, presionada) =>
    set((s) => ({
      teclas: { ...s.teclas, [codigo]: presionada },
    })),

  limpiarTeclas: () => set({ teclas: {} }),
}))
