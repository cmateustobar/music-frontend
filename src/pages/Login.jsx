import { useState } from "react";

function Login({ onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const endpoint = isRegister ? "register" : "login";

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (isRegister) {
        alert("Usuario creado, ahora inicia sesión");
        setIsRegister(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      } else {
        alert(data.error || "Error");
      }

    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

      <div className="bg-[#181818] p-8 rounded-xl space-y-4 w-80">

        <h2 className="text-2xl font-bold text-white">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-black text-white rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-black text-white rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-black p-2 rounded font-semibold"
        >
          {isRegister ? "Registrarse" : "Entrar"}
        </button>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-gray-400 w-full"
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>

        <button
          onClick={onClose}
          className="text-xs text-gray-500 w-full"
        >
          Cancelar
        </button>

      </div>

    </div>
  );
}

export default Login;