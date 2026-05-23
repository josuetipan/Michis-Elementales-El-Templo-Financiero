import { useState } from 'react'
import './App.css'

const MICHIS_ELEMENTALES = [
  {
    id: 'fuego',
    nombre: 'Ember',
    elemento: 'Fuego',
    icono: '🔥',
    rol: 'Gastos impulsivos — te avisa antes de quemar el tesoro',
    color: 'var(--fuego)',
    meta: 80,
  },
  {
    id: 'agua',
    nombre: 'Marea',
    elemento: 'Agua',
    icono: '💧',
    rol: 'Ahorro fluido — adapta tu presupuesto al mes',
    color: 'var(--agua)',
    meta: 65,
  },
  {
    id: 'tierra',
    nombre: 'Raíz',
    elemento: 'Tierra',
    icono: '🌿',
    rol: 'Fondo de emergencia — raíces firmes para imprevistos',
    color: 'var(--tierra)',
    meta: 45,
  },
  {
    id: 'aire',
    nombre: 'Brisa',
    elemento: 'Aire',
    icono: '💨',
    rol: 'Inversiones ligeras — visión clara a largo plazo',
    color: 'var(--aire)',
    meta: 55,
  },
]

function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(valor)
}

function App() {
  const [tesoro, setTesoro] = useState(12500)
  const [tipoMovimiento, setTipoMovimiento] = useState(null)
  const [montoInput, setMontoInput] = useState('')

  function aplicarMovimiento() {
    if (!tipoMovimiento) return
    const monto = parseFloat(montoInput)
    if (!monto || monto <= 0) return

    setTesoro((prev) =>
      tipoMovimiento === 'ingreso'
        ? prev + monto
        : Math.max(0, prev - monto),
    )
    setMontoInput('')
    setTipoMovimiento(null)
  }

  function abrirFormulario(tipo) {
    setTipoMovimiento(tipo)
    setMontoInput('')
  }

  const progresoGlobal = Math.min(100, Math.round((tesoro / 20000) * 100))

  return (
    <div className="app">
      <header className="header">
        <div className="header__emblema" aria-hidden="true">
          🐱⛩️
        </div>
        <h1 className="header__titulo">El Templo Financiero</h1>
        <p className="header__subtitulo">
          Michis Elementales — custodios de tu tesoro sagrado
        </p>
      </header>

      <section className="tesoro" aria-labelledby="tesoro-titulo">
        <p className="tesoro__etiqueta" id="tesoro-titulo">
          Tesoro del templo
        </p>
        <p className="tesoro__monto">{formatearMoneda(tesoro)}</p>
        <div className="tesoro__acciones">
          <button
            type="button"
            className="btn"
            onClick={() => abrirFormulario('ingreso')}
          >
            Ofrenda (+)
          </button>
          <button
            type="button"
            className="btn btn--secundario"
            onClick={() => abrirFormulario('gasto')}
          >
            Gasto (−)
          </button>
        </div>
        {tipoMovimiento && (
          <form
            className="formulario"
            onSubmit={(e) => {
              e.preventDefault()
              aplicarMovimiento()
            }}
          >
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Monto"
              value={montoInput}
              onChange={(e) => setMontoInput(e.target.value)}
              aria-label={
                tipoMovimiento === 'ingreso'
                  ? 'Monto de la ofrenda'
                  : 'Monto del gasto'
              }
              autoFocus
            />
            <button type="submit" className="btn">
              {tipoMovimiento === 'ingreso' ? 'Registrar ofrenda' : 'Registrar gasto'}
            </button>
            <button
              type="button"
              className="btn btn--secundario"
              onClick={() => setTipoMovimiento(null)}
            >
              Cancelar
            </button>
          </form>
        )}
      </section>

      <h2 className="seccion-titulo">Guardianes elementales</h2>
      <div className="michis">
        {MICHIS_ELEMENTALES.map((michi) => {
          const progreso = Math.min(100, Math.round((progresoGlobal * michi.meta) / 100))
          return (
            <article key={michi.id} className="michi-card">
              <div className="michi-card__icono" aria-hidden="true">
                {michi.icono}
              </div>
              <h3 className="michi-card__nombre">
                {michi.nombre} · {michi.elemento}
              </h3>
              <p className="michi-card__rol">{michi.rol}</p>
              <div className="michi-card__barra">
                <div
                  className="michi-card__progreso"
                  style={{ width: `${progreso}%`, background: michi.color }}
                />
              </div>
              <p className="michi-card__meta">Armonía: {progreso}%</p>
            </article>
          )
        })}
      </div>

      <footer className="footer">
        <p>Proyecto React + Vite · Michis Elementales</p>
      </footer>
    </div>
  )
}

export default App
