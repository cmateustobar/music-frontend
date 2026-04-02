const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchSongs = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs`);

    if (!res.ok) {
      throw new Error("Error al obtener canciones");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error en fetchSongs:", error);
    return [];
  }
};

export const uploadSong = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Error al subir canción");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error en uploadSong:", error);
  }
};