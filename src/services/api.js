const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================
   🎵 OBTENER CANCIONES
========================= */
export const fetchSongs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/songs`);

    if (!response.ok) {
      throw new Error("Error al obtener canciones");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetchSongs:", error);
    return [];
  }
};

/* =========================
   ⬆️ SUBIR CANCIÓN
========================= */
export const uploadSong = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/songs/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al subir canción");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploadSong:", error);
    throw error;
  }
};