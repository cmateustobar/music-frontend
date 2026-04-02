const BASE_URL = import.meta.env.VITE_API_URL;

export const getSongs = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/songs`);

    if (!res.ok) {
      throw new Error("Error al obtener canciones");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error en getSongs:", error);
    return [];
  }
};