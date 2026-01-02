import { useEffect, useState } from "react";

function UserLibrary({ songs = [] }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const token = localStorage.getItem("token");

  /* ---------------- FETCH PLAYLISTS ---------------- */
  const fetchPlaylists = async () => {
    try {
      const res = await fetch("/api/playlists/mine", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPlaylists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch playlists", err);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  /* ---------------- CREATE PLAYLIST ---------------- */
  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    await fetch("/api/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newPlaylistName }),
    });

    setNewPlaylistName("");
    fetchPlaylists();
  };

  /* ---------------- ADD SONG ---------------- */
  const addSongToPlaylist = async (songId) => {
    if (!selectedPlaylist) {
      alert("Select a playlist first");
      return;
    }

    const res = await fetch("/api/playlists/add-song", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        playlistId: selectedPlaylist._id,
        songId,
      }),
    });

    const updatedPlaylist = await res.json();

    // 🔥 REAL-TIME STATE UPDATE
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl._id === updatedPlaylist._id ? updatedPlaylist : pl
      )
    );

    setSelectedPlaylist(updatedPlaylist);
  };

  /* ---------------- SAFE ACCESS ---------------- */
  const playlistSongs = selectedPlaylist?.songs || [];

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1>🎧 My Library</h1>

      {/* CREATE PLAYLIST */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="New playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
        <button onClick={createPlaylist}>Create</button>
      </div>

      <div style={{ display: "flex", gap: "30px" }}>
        {/* PLAYLIST LIST */}
        <div style={{ width: "30%" }}>
          <h3>🎵 Playlists</h3>

          {playlists.length === 0 && <p>No playlists yet</p>}

          {playlists.map((pl) => (
            <div
              key={pl._id}
              onClick={() =>
                setSelectedPlaylist({
                  ...pl,
                  songs: Array.isArray(pl.songs) ? pl.songs : [],
                })
              }
              style={{
                padding: "8px",
                cursor: "pointer",
                background:
                  selectedPlaylist?._id === pl._id
                    ? "#e6ffe6"
                    : "#f5f5f5",
                marginBottom: "6px",
              }}
            >
              {pl.name}
            </div>
          ))}
        </div>

        {/* SONG LIST */}
        <div style={{ width: "70%" }}>
          <h3>➕ All Songs</h3>

          {songs.map((song) => {
            const alreadyAdded = playlistSongs.some(
              (s) => String(s._id) === String(song._id)
            );

            return (
              <div
                key={song._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>
                  🎵 {song.title} – {song.artist}
                </span>

                <button
                  disabled={alreadyAdded}
                  onClick={() => addSongToPlaylist(song._id)}
                >
                  {alreadyAdded ? "Added" : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* PLAYLIST CONTENT */}
      {selectedPlaylist && (
        <div style={{ marginTop: "30px" }}>
          <h3>📂 {selectedPlaylist.name}</h3>

          {playlistSongs.length === 0 && <p>No songs yet</p>}

          {playlistSongs.map((song) => (
            <p key={song._id}>
              🎶 {song.title} – {song.artist}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserLibrary;