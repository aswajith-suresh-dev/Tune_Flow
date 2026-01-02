import { useEffect, useRef, useState } from "react";

function Home({ songs }) {
  const audioRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(null);

  const currentSong =
    currentIndex !== null ? songs[currentIndex] : null;

  // ▶️ Play song when index changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = `http://localhost:5000${currentSong.fileUrl}`;
      audioRef.current.play();
    }
  }, [currentIndex, currentSong]);

  const playSong = (index) => {
    setCurrentIndex(index);
  };

  const playNext = () => {
    if (currentIndex === null) return;
    setCurrentIndex((currentIndex + 1) % songs.length);
  };

  const playPrev = () => {
    if (currentIndex === null) return;
    setCurrentIndex(
      currentIndex === 0 ? songs.length - 1 : currentIndex - 1
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>🎶 Music Player</h1>

      {songs.length === 0 && <p>No songs found</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {songs.map((song, index) => {
          const isPlaying = index === currentIndex;

          return (
            <li
              key={song._id}
              onClick={() => playSong(index)}
              style={{
                cursor: "pointer",
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "6px",
                border: isPlaying ? "2px solid #4caf50" : "1px solid #ccc",
                background: isPlaying ? "#eaffea" : "#fff",
                fontWeight: isPlaying ? "bold" : "normal",
              }}
            >
              {isPlaying ? "▶️ " : "🎵 "}
              {song.title} – {song.artist}
            </li>
          );
        })}
      </ul>

      {/* PLAYER CONTROLS */}
      {currentSong && (
        <>
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Now Playing: <strong>{currentSong.title}</strong>
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <button onClick={playPrev}>⏮ Prev</button>
            <button onClick={playNext}>Next ⏭</button>
          </div>

          <audio
            ref={audioRef}
            controls
            style={{ width: "100%", marginTop: "10px" }}
          />
        </>
      )}
    </div>
  );
}

export default Home;
