import { useEffect, useRef, useState } from "react";
import "../css/UserLibrary.css";

function UserLibrary({ songs }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const [currentSong, setCurrentSong] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(null);
  const audioRef = useRef(null);
  const token = localStorage.getItem("token");

  /* ---------------- FETCH PLAYLISTS ---------------- */
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

  /* ---------------- AUDIO: LOAD & PLAY ---------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = `http://localhost:5000${currentSong.fileUrl}`;
    audio.load();

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentSong]);

  /* ---------------- AUDIO EVENTS ---------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  /* ---------------- PLAYLIST ACTIONS ---------------- */
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
      prev.map((pl) => (pl._id === updatedPlaylist._id ? updatedPlaylist : pl)),
    );
    setSelectedPlaylist(updatedPlaylist);
  };

  /* ---------------- AUDIO CONTROLS ---------------- */
  const playSong = (song) => {
    const index = selectedPlaylist.songs.findIndex((s) => s._id === song._id);

    setCurrentIndex(index);
    setCurrentSong(song);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };
  const playNext = () => {
    if (!selectedPlaylist || currentIndex === null) return;

    const nextIndex = (currentIndex + 1) % selectedPlaylist.songs.length;

    setCurrentIndex(nextIndex);
    setCurrentSong(selectedPlaylist.songs[nextIndex]);
  };

  const playPrev = () => {
    if (!selectedPlaylist || currentIndex === null) return;

    const prevIndex =
      currentIndex === 0 ? selectedPlaylist.songs.length - 1 : currentIndex - 1;

    setCurrentIndex(prevIndex);
    setCurrentSong(selectedPlaylist.songs[prevIndex]);
  };
  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const percent = e.target.value;
    audio.currentTime = (percent / 100) * duration;
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: "20px", marginTop: "100px" }}>
      <h1 className="library-title"> My Playlists</h1>

      <div style={{ display: "flex", gap: "30px" }}>
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h3 style={{ color: "#6366f1" }}>🎵 Playlists</h3>

          <div className="playlist-create">
            <input
              placeholder="New playlist..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <button onClick={createPlaylist}>Create</button>
          </div>

          <div className="playlist-list">
            {playlists.map((pl) => (
              <div
                key={pl._id}
                onClick={() => {
                  setSelectedPlaylist(pl);
                  setIsAddMode(false);
                }}
                className={`playlist-item ${
                  selectedPlaylist?._id === pl._id ? "active" : ""
                }`}
              >
                {pl.name}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: "70%" }}>
          {!selectedPlaylist && (
            <p style={{ color: "#777" }}>
              Select a playlist to view or add songs
            </p>
          )}

          {selectedPlaylist && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>
                  {isAddMode ? "➕ Add Songs" : `📂 ${selectedPlaylist.name}`}
                </h3>

                <button onClick={() => setIsAddMode(!isAddMode)}>
                  {isAddMode ? "⬅ Back" : "➕ Add Songs"}
                </button>
              </div>

              {!isAddMode && (
                <div className="playlist-grid">
                  {selectedPlaylist.songs.length === 0 && <p>No songs yet</p>}

                  {selectedPlaylist.songs.map((song) => (
                    <div
                      key={song._id}
                      className={`playlist-song-card ${
                        currentSong?._id === song._id ? "active" : ""
                      }`}
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
              )}

              {isAddMode &&
                songs.map((song) => {
                  const alreadyAdded = selectedPlaylist.songs.some(
                    (s) => String(s._id) === String(song._id),
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

      {/* PLAYER */}
      {currentSong && (
        <div className="player-box">
          <div className="player-info">
            <strong>{currentSong.title}</strong>
            <span>{currentSong.artist}</span>
          </div>

          <input
            className="progress-bar"
            type="range"
            min="0"
            max="100"
            value={duration ? (progress / duration) * 100 : 0}
            onChange={seek}
          />

          <div className="controls">
            <button onClick={playPrev}>⏮</button>

            <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>

            <button onClick={playNext}>⏭</button>
          </div>
        </div>
      )}

      <audio ref={audioRef} />
    </div>
  );
}

export default UserLibrary;
