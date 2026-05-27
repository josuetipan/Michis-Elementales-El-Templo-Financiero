import { motion } from 'framer-motion'
import {
  CUADRO_MODAL_URL,
  FLECHA_BTN_URL,
  CASA_BTN_URL,
} from '../game/assetUrls.js'
import './ModalEntradaTemplo.css'

/**
 * Modal de peaje para entrar al Nivel 1 (El Despegue).
 */
export default function ModalEntradaTemplo({
  peaje,
  bolsaFuego,
  puedePagar,
  onConfirmar,
  onCerrar,
}) {
  return (
    <motion.div
      className="modal-entrada"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCerrar}
      role="presentation"
    >
      <motion.div
        className="modal-entrada__panel"
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-entrada-titulo"
      >
        <img src={CUADRO_MODAL_URL} alt="" className="modal-entrada__marco" aria-hidden="true" />

        <div className="modal-entrada__contenido">
          <div className="modal-entrada__cabecera">
            <h2 id="modal-entrada-titulo" className="modal-entrada__titulo">
              Puerta del Templo
            </h2>
          </div>

          <div className="modal-entrada__cuerpo">
            <p className="modal-entrada__texto">
              Para ingresar al <strong>primer mapa</strong> debes pagar{' '}
              <span className="modal-entrada__precio">${peaje}</span>.
              {bolsaFuego >= peaje
                ? ' Se descontará de la bolsa de Michi-Inversión.'
                : ' Recibirás el bono de bienvenida al confirmar.'}
            </p>

            <p className="modal-entrada__saldo">
              Tu bolsa: <span>${bolsaFuego}</span>
            </p>

            {!puedePagar && (
              <p className="modal-entrada__aviso">
                Necesitas al menos ${peaje}. Inicia la aventura para recibir el bono de
                bienvenida.
              </p>
            )}
          </div>

          <div className="modal-entrada__acciones">
            <motion.button
              type="button"
              className="modal-entrada__btn modal-entrada__btn--casa"
              aria-label="Cerrar y volver al lobby"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={onCerrar}
            >
              <img src={CASA_BTN_URL} alt="" />
            </motion.button>

            <motion.button
              type="button"
              className="modal-entrada__btn modal-entrada__btn--flecha"
              aria-label="Pagar e ingresar al primer mapa"
              whileHover={{ scale: puedePagar ? 1.05 : 1 }}
              whileTap={{ scale: puedePagar ? 0.94 : 1 }}
              onClick={onConfirmar}
              disabled={!puedePagar}
            >
              <img src={FLECHA_BTN_URL} alt="" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
