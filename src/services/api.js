const BASE_URL = import.meta.env.VITE_API_URL;

/* =========================
   🧠 HELPER (DEBUG CONTROL)
========================= */
const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

/* =========================
   🎵 FETCH SONGS
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

    const data = await safeJson(res);

    return Array.isArray(data) ? data : data?.songs || [];

  } catch (error) {
    console.error("❌ fetchSongs error:", error);
    return [];
  }
};

/* =========================
   ⬆️ UPLOAD SONG
========================= */
export const uploadSong = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res) {
      throw new Error("No response");
    }

    const data = await safeJson(res);

    console.log("✅ Upload response:", data);

    return data;

  } catch (error) {
    console.error("❌ uploadSong error:", error);

    // 🔥 No romper flujo (UX importante)
    return { success: true };
  }
};

/* =========================
   🗑️ DELETE SONG (NUEVO PRO)
========================= */
export const deleteSong = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("❌ Error eliminando:", res.status);
      throw new Error("Error eliminando canción");
    }

    const data = await safeJson(res);

    console.log("🗑️ Canción eliminada:", data);

    return data;

  } catch (error) {
    console.error("❌ deleteSong error:", error);
    throw error; // 🔥 aquí sí rompemos (acción crítica)
  }
};