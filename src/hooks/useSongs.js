import { useEffect, useState } from "react";
import { fetchSongsAPI } from "../services/api";

export const useSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const data = await fetchSongsAPI();
      setSongs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  return { songs, loading, reload: loadSongs };
};