import { useState } from "react";

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
          headers: {
            "Content-Type": "application/json",
          },
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

      // reset form
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
    if (!window.confirm("Are you sure you want to delete this song?")) return;

    try {
      const res = await fetch(`/api/songs/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      alert(data.message);

      onUploadSuccess();
    } catch {
      alert("Delete failed");
    }
  };

  // 🔹 EDIT (prefill form)
  const handleEdit = (song) => {
    setEditingSong(song);
    setTitle(song.title);
    setArtist(song.artist);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* FORM */}
      <div
        style={{
          width: "320px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          {editingSong ? "Edit Song ✏️" : "Admin – Upload Song 🎵"}
        </h2>

        <input
          type="text"
          placeholder="Song Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Artist Name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        {!editingSong && (
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: "10px" }}
          />
        )}

        <button style={{ width: "100%" }} onClick={handleSave}>
          {editingSong ? "Save Changes" : "Upload Song"}
        </button>
      </div>

      {/* SONG LIST */}
      <div style={{ width: "320px" }}>
        <h3>Uploaded Songs</h3>

        {songs.length === 0 && <p>No songs available</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {songs.map((song) => (
            <li
              key={song._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                border: "1px solid #ccc",
                padding: "6px",
                borderRadius: "5px",
              }}
            >
              <span>{song.title}</span>

              <div>
                <button
                  onClick={() => handleEdit(song)}
                  style={{
                    marginRight: "5px",
                    background: "orange",
                    border: "none",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(song._id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminUpload;
