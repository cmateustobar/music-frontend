import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Disc3, Mail, LockKeyhole, X } from "lucide-react";

function Login({ onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const endpoint = isRegister ? "register" : "login";

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Completa email y contraseña para continuar.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (isRegister) {
        if (!res.ok) {
          setErrorMessage(data.error || "No pudimos crear tu cuenta.");
          return;
        }

        setSuccessMessage("Cuenta creada. Ahora inicia sesion.");
        setIsRegister(false);
        setPassword("");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
        return;
      }

      setErrorMessage(data.error || "No pudimos iniciar sesion.");
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexion. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="surface-glass-strong panel-edge relative w-full max-w-md overflow-hidden rounded-[30px] p-6 sm:p-7"
        >
          <button
            onClick={onClose}
            className="btn-icon state-hover-lift absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-cyan-300 via-teal-300 to-violet-300 text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,0.24)]">
              <Disc3 size={20} />
            </div>
            <div>
              <p className="type-kicker text-slate-300/38">PulseBeat</p>
              <h2 className="mt-2 font-display text-[1.6rem] leading-none tracking-[-0.05em] text-white">
                {isRegister ? "Crear cuenta" : "Iniciar sesion"}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-300/60">
            {isRegister
              ? "Crea tu acceso para publicar musica y guardar tu coleccion."
              : "Entra para subir musica, guardar favoritas y personalizar tu experiencia."}
          </p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-200/74">
                <Mail size={14} /> Email
              </span>
              <input
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ds-input w-full px-4 py-3 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-200/74">
                <LockKeyhole size={14} /> Contraseña
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ds-input w-full px-4 py-3 text-sm"
              />
            </label>

            {(errorMessage || successMessage) && (
              <div
                className={`rounded-[18px] border px-4 py-3 text-sm ${
                  errorMessage
                    ? "border-red-300/16 bg-red-500/10 text-red-100"
                    : "border-emerald-300/16 bg-emerald-500/10 text-emerald-100"
                }`}
              >
                {errorMessage || successMessage}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary state-hover-lift flex w-full items-center justify-center rounded-[20px] px-4 py-3.5 font-medium disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? isRegister
                  ? "Creando..."
                  : "Entrando..."
                : isRegister
                  ? "Crear cuenta"
                  : "Entrar"}
            </button>

            <button
              onClick={() => {
                setIsRegister((value) => !value);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="w-full text-sm text-slate-300/64 transition hover:text-white"
            >
              {isRegister
                ? "Ya tienes cuenta? Inicia sesion"
                : "No tienes cuenta? Registrate"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Login;
