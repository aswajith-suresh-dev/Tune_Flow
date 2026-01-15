import { useState } from "react";
import "../css/admin.css";

function AdminUpload({ onUploadSuccess, songs = [] }) {
  const [editingSong, setEditingSong] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);

  // 🔹 SAVE (UPLOAD or UPDATE)
  const handleSave = async () => {
    if (!title || !artist) {
      alert("Please fill all fields");
      return;
    }

    try {
      let response;

      // ✏️ EDIT MODE
      if (editingSong) {
        response = await fetch(`/api/songs/${editingSong._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, artist }),
        });
      }
      // ➕ UPLOAD MODE
      else {
        if (!file) {
          alert("Please select a song file");
          return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("song", file);

        response = await fetch("/api/songs", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Operation failed");
      }

      alert(editingSong ? "Song updated 🎶" : "Song uploaded 🎵");

      setTitle("");
      setArtist("");
      setFile(null);
      setEditingSong(null);

      onUploadSuccess();
    } catch (error) {
      alert(error.message);
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this song?")) return;

    try {
      const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message);
      onUploadSuccess();
    } catch {
      alert("Delete failed");
    }
  };

  // 🔹 EDIT
  const handleEdit = (song) => {
    setEditingSong(song);
    setTitle(song.title);
    setArtist(song.artist);
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">🎛 Admin Dashboard</h1>

      <div className="admin-layout">
        {/* LEFT: FORM */}
        <div className="admin-form">
          <h2>{editingSong ? "Edit Song ✏️" : "Upload Song 🎵"}</h2>

          <input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />

          {!editingSong && (
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          )}

          <button onClick={handleSave}>
            {editingSong ? "Save Changes" : "Upload Song"}
          </button>
        </div>

        {/* RIGHT: SONG LIST */}
        <div className="admin-songs">
          <h3>Uploaded Songs</h3>

          {songs.length === 0 && <p>No songs available</p>}

          <ul>
            {songs.map((song) => (
              <li key={song._id} className="admin-song-item">
                <span>{song.title}</span>

                <div className="admin-actions">
                  <button
                    className="admin-edit"
                    onClick={() => handleEdit(song)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-delete"
                    onClick={() => handleDelete(song._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;