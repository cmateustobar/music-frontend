import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Upload from "./Upload";

function UploadModal({ isOpen, onClose, onUpload }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/76 px-4 py-8 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl"
          >
            <button
              onClick={onClose}
              className="btn-icon state-hover-lift absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white"
            >
              <X size={18} />
            </button>

            <Upload onUpload={onUpload} onSuccess={onClose} compact />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default UploadModal;
