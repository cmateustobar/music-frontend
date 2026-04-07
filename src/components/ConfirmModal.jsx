import { AnimatePresence, motion } from "framer-motion";

function ConfirmModal({ isOpen, onClose, onConfirm, title }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 px-4 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="ds-modal panel-edge relative w-full max-w-md overflow-hidden rounded-[30px] p-6 text-center"
          >
            <div className="pointer-events-none absolute inset-0">
              <motion.div
                animate={{ opacity: [0.45, 0.7, 0.45] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_34%)]"
              />
              <div className="absolute inset-x-0 top-0 h-px bg-white/28" />
              <div className="absolute left-0 top-0 h-full w-px bg-white/12" />
            </div>

            <div className="relative">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.04 }}
                className="text-xs uppercase tracking-[0.35em] text-cyan-100/55"
              >
                Acción delicada
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="mt-3 font-serif text-2xl text-white"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="mt-3 text-sm leading-6 text-slate-300/70"
              >
                Esta acción quitará la pista de tu colección actual.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.16 }}
                className="mt-8 flex justify-center gap-3"
              >
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="btn-secondary state-hover-lift state-active-press rounded-full px-5 py-2.5 text-white transition hover:bg-white/[0.12]"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="state-hover-lift state-active-press rounded-full border border-red-200/18 bg-[linear-gradient(145deg,rgba(239,68,68,0.92),rgba(248,113,113,0.78))] px-5 py-2.5 font-medium text-white shadow-[0_14px_28px_rgba(239,68,68,0.22)] transition hover:brightness-110"
                >
                  Eliminar
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ConfirmModal;
