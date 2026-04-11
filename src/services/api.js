const BASE_URL = import.meta.env.VITE_API_URL;

/* =========================
   🧠 VALIDACIÓN BASE URL
========================= */
if (!BASE_URL) {
  console.error("❌ VITE_API_URL no está definida");
}

/* =========================
   🧠 HELPER JSON
========================= */
const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

/* =========================
   🔐 HELPER TOKEN
========================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

/* =========================
   🎵 FETCH SONGS
========================= */
export const fetchSongs = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs`);

    if (!res.ok) {
      console.error("❌ Error HTTP:", res.status);
      return [];
    }

    const data = await safeJson(res);

    return Array.isArray(data) ? data : data?.songs || [];

  } catch (error) {
    console.error("❌ fetchSongs error:", error);
    return [];
  }
};

/* =========================
   ⬆️ UPLOAD SONG (🔐 PROTEGIDO)
========================= */
export const uploadSong = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs/upload`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(), // 🔐 token incluido
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      console.error("❌ Upload error:", errorData);
      throw new Error("No autorizado o error en upload");
    }

    const data = await safeJson(res);

    console.log("✅ Upload response:", data);

    return data;

  } catch (error) {
    console.error("❌ uploadSong error:", error);
    throw error; // 🔥 ahora sí rompe (correcto)
  }
};

/* =========================
   🗑️ DELETE SONG (🔐 PROTEGIDO)
========================= */
export const deleteSong = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(), // 🔐 token incluido
      },
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      console.error("❌ Error eliminando:", errorData);
      throw new Error("No autorizado o error eliminando");
    }

    const data = await safeJson(res);

    console.log("🗑️ Canción eliminada:", data);

    return data;

  } catch (error) {
    console.error("❌ deleteSong error:", error);
    throw error;
  }
};

/* =========================
   🔐 LOGIN
========================= */
export const login = async (credentials) => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      console.error("❌ Login error:", errorData);
      throw new Error("Credenciales inválidas");
    }

    const data = await safeJson(res);

    // 🔐 GUARDAR TOKEN
    if (data?.accessToken) {
      localStorage.setItem("token", data.accessToken);
    }

    return data;

  } catch (error) {
    console.error("❌ login error:", error);
    throw error;
  }
};

/* =========================
   🚪 LOGOUT
========================= */
export const logout = () => {
  localStorage.removeItem("token");
};

export const uploadSongsBulk = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs/upload/bulk`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      console.error("Bulk upload error:", errorData);
      throw new Error(errorData?.message || "No se pudo completar la carga masiva");
    }

    return await safeJson(res);
  } catch (error) {
    console.error("uploadSongsBulk error:", error);
    throw error;
  }
};

export const importSongFromUrl = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs/import-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      console.error("Import URL error:", errorData);
      throw new Error(errorData?.message || "No se pudo importar la cancion");
    }

    return await safeJson(res);
  } catch (error) {
    console.error("importSongFromUrl error:", error);
    throw error;
  }
};
