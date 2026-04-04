import { useState } from "react";

function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      } else {
        alert(data.error || "Error al iniciar sesión");
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

      <div className="bg-[#181818] p-8 rounded-xl space-y-4 w-80">

        <h2 className="text-2xl font-bold text-white">Iniciar sesión</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-black text-white rounded outline-none"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-black text-white rounded outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 text-black p-2 rounded font-semibold hover:scale-105 transition"
        >
          Entrar
        </button>

        <button
          onClick={onClose}
          className="w-full text-gray-400 text-sm"
        >
          Cancelar
        </button>

      </div>

    </div>
  );
}

export default Login;