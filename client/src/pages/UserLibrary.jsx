import { useEffect, useRef, useState } from "react";
import "../css/UserLibrary.css";

function UserLibrary({ songs }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const audioRef = useRef(null);
  const token = localStorage.getItem("token");

  // 🔁 Fetch playlists
  const fetchPlaylists = async () => {
    const res = await fetch("/api/playlists/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPlaylists(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // ➕ Create playlist
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

  // ➕ Add song to playlist
  const addSongToPlaylist = async (songId) => {
    if (!selectedPlaylist) return;

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

    setPlaylists((prev) =>
      prev.map((pl) =>
        pl._id === updatedPlaylist._id ? updatedPlaylist : pl
      )
    );
    setSelectedPlaylist(updatedPlaylist);
  };

  // ▶️ Play song
  const playSong = (song) => {
    if (!audioRef.current) return;

    audioRef.current.src = `http://localhost:5000${song.fileUrl}`;
    audioRef.current.load();
    audioRef.current.play();

    setCurrentSong(song);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
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

      {/* MAIN LAYOUT */}
      <div style={{ display: "flex", gap: "30px" }}>
        {/* LEFT PANEL */}
        <div style={{ width: "30%" }}>
          <h3>🎵 Playlists</h3>

          {playlists.map((pl) => (
            <div
              key={pl._id}
              onClick={() => {
                setSelectedPlaylist(pl);
                setIsAddMode(false);
              }}
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

        {/* RIGHT PANEL */}
        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {!selectedPlaylist && (
            <p style={{ color: "#777" }}>
              Select a playlist to view or add songs
            </p>
          )}

          {selectedPlaylist && (
            <>
              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>
                  {isAddMode
                    ? "➕ Add Songs"
                    : `📂 ${selectedPlaylist.name}`}
                </h3>

                <button onClick={() => setIsAddMode(!isAddMode)}>
                  {isAddMode ? "⬅ Back" : "➕ Add Songs"}
                </button>
              </div>

              {/* CONTENT */}
              {!isAddMode && (
                <>
                  {selectedPlaylist.songs.length === 0 && (
                    <p>No songs yet</p>
                  )}

                  <div className="playlist-grid">
                    {selectedPlaylist.songs.map((song) => (
                      <div
                        key={song._id}
                        className="playlist-song-card"
                        onClick={() => playSong(song)}
                      >
                        <img
                          src="/music-cover.png"
                          alt="cover"
                          className="playlist-song-cover"
                        />
                        <div>
                          <p>{song.title}</p>
                          <p>{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {isAddMode &&
                songs.map((song) => {
                  const alreadyAdded =
                    selectedPlaylist.songs.some(
                      (s) => String(s._id) === String(song._id)
                    );

                  return (
                    <div
                      key={song._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
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
            </>
          )}
        </div>
      </div>

      {/* AUDIO PLAYER */}
      <div style={{ marginTop: "20px" }}>
        {currentSong && (
          <p>
            Now Playing: <strong>{currentSong.title}</strong>
          </p>
        )}
        <audio ref={audioRef} controls style={{ width: "100%" }} />
      </div>
    </div>
  );
}

export default UserLibrary;