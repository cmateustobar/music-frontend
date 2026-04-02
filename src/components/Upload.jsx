import { useState } from "react";
import { uploadSong } from "../services/api";

const Upload = ({ onUpload }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audio || !image) {
      alert("Faltan archivos");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio", audio);
    formData.append("image", image);

    try {
      const newSong = await uploadSong(formData);
      onUpload(newSong);

      setTitle("");
      setArtist("");
      setAudio(null);
      setImage(null);

      alert("Canción subida 🚀");
    } catch (error) {
      console.error(error);
      alert("Error al subir");
    }
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Subir canción</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-black p-2 rounded"
        />

        <input
          type="text"
          placeholder="Artista"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="bg-black p-2 rounded"
        />

        <input type="file" onChange={(e) => setAudio(e.target.files[0])} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button className="bg-green-500 py-2 rounded font-semibold">
          Subir
        </button>
      </form>
    </div>
  );
};

export default Upload;