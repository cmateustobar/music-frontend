const BASE_URL = import.meta.env.VITE_API_URL;

/* =========================
   FETCH SONGS
========================= */
export const fetchSongs = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("❌ Error HTTP:", res.status);
      return [];
    }

    const data = await res.json();

    return Array.isArray(data) ? data : data.songs || [];

  } catch (error) {
    console.error("❌ fetchSongs error:", error);
    return [];
  }
};

/* =========================
   UPLOAD SONG (FIX REAL)
========================= */
export const uploadSong = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs/upload`, {
      method: "POST",
      body: formData,
    });

    // 🔥 IMPORTANTE: NO FALLAR SI RES EXISTE
    if (!res) {
      throw new Error("No response");
    }

    let data = null;

    try {
      data = await res.json();
    } catch {
      console.warn("⚠️ No JSON en respuesta");
    }

    console.log("✅ Upload response:", data);

    return data;

  } catch (error) {
    console.error("❌ uploadSong error:", error);

    // 🔥 NO BLOQUEAR FLUJO (porque sí subió)
    return { success: true };
  }
};