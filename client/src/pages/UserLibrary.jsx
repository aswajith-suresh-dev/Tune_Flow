import { useEffect, useRef, useState } from "react";

function UserLibrary({ songs }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [currentSong, setCurrentSong] = useState(null);

  const audioRef = useRef(null);
  const token = localStorage.getItem("token");

  // 🔁 Fetch playlists
  const fetchPlaylists = async () => {
    const res = await fetch("/api/playlists/mine", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setPlaylists(data);
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

    // 🔥 update UI instantly
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl._id === updatedPlaylist._id ? updatedPlaylist : pl
      )
    );
    setSelectedPlaylist(updatedPlaylist);
  };

  // ▶️ PLAY SONG (THIS WAS MISSING)
  const playSong = (song) => {
    if (!audioRef.current) return;

    audioRef.current.src = `http://localhost:5000${song.fileUrl}`;
    audioRef.current.load(); // VERY IMPORTANT
    audioRef.current.play();

    setCurrentSong(song);
  };

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
        {/* LEFT: PLAYLISTS */}
        <div style={{ width: "30%" }}>
          <h3>🎵 Playlists</h3>

          {playlists.map((pl) => (
            <div
              key={pl._id}
              onClick={() => setSelectedPlaylist(pl)}
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

        {/* RIGHT: ALL SONGS */}
        <div style={{ width: "70%" }}>
          <h3>➕ All Songs</h3>

          {songs.map((song) => {
            const alreadyAdded =
              selectedPlaylist?.songs?.some(
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

      {/* PLAYLIST SONGS */}
      {selectedPlaylist && (
        <div style={{ marginTop: "30px" }}>
          <h3>📂 {selectedPlaylist.name}</h3>

          {selectedPlaylist.songs.length === 0 && <p>No songs yet</p>}

          {selectedPlaylist.songs.map((song) => (
            <div
              key={song._id}
              style={{ cursor: "pointer", marginBottom: "6px" }}
              onClick={() => playSong(song)}
            >
              ▶️ {song.title} – {song.artist}
            </div>
          ))}
        </div>
      )}

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