const BASE_URL = import.meta.env.VITE_API_URL;

/* =========================
   FETCH SONGS
========================= */
export const fetchSongs = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs`);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    console.log("🎵 canciones recibidas:", data);

    // 🔥 NORMALIZACIÓN
    return Array.isArray(data) ? data : data.songs || [];

  } catch (error) {
    console.error("❌ Error en fetchSongs:", error);
    return [];
  }
};

/* =========================
   UPLOAD SONG
========================= */
export const uploadSong = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    console.log("✅ canción subida:", data);

    return data;

  } catch (error) {
    console.error("❌ Error en uploadSong:", error);
    return null;
  }
};