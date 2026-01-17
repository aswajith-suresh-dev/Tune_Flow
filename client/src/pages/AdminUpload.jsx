import { useState } from "react";
import "../css/admin.css";

function AdminUpload({ onUploadSuccess, songs = [] }) {
  const [editingSong, setEditingSong] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);

  // ✅ GET TOKEN ONCE
  const token = localStorage.getItem("token");

  /* ---------------- SAVE (UPLOAD / UPDATE) ---------------- */
  const handleSave = async () => {
    if (!title || !artist) {
      alert("Please fill all fields");
      return;
    }

    try {
      let response;

      // ✏️ UPDATE SONG
      if (editingSong) {
        response = await fetch(`/api/songs/${editingSong._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, artist }),
        });
      }

      // ➕ UPLOAD SONG
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      alert(editingSong ? "Song updated 🎶" : "Song uploaded 🎵");

      // reset
      setTitle("");
      setArtist("");
      setFile(null);
      setEditingSong(null);

      // ✅ refresh list
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      alert(error.message);
    }
  };

  /* ---------------- DELETE SONG ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this song?")) return;

    try {
      const res = await fetch(`/api/songs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      alert(data.message);

      // ✅ refresh list
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      alert(error.message);
    }
  };

  /* ---------------- EDIT MODE ---------------- */
  const handleEdit = (song) => {
    setEditingSong(song);
    setTitle(song.title);
    setArtist(song.artist);
  };

  /* ---------------- UI ---------------- */
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
                <span>
                  {song.title}-{song.artist}
                </span>
                <br />
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
