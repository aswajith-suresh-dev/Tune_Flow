import { useEffect, useRef, useState } from "react";
import "../css/Home.css";

function Home({ songs }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(null);

const currentSong =
  currentIndex !== null && songs && songs.length > 0
    ? songs[currentIndex]
    : null;
  // ▶️ Play song when index changes
  useEffect(() => {
  const audio = audioRef.current;
  if (!audio || !currentSong) return;

  audio.src = `http://localhost:5000${currentSong.fileUrl}`;
  audio.load();

  audio.play()
    .then(() => setIsPlaying(true))
    .catch(() => setIsPlaying(false));
}, [currentSong]);
 useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const updateProgress = () => {
    setProgress(audio.currentTime);
  };

  const updateDuration = () => {
    setDuration(audio.duration || 0);
  };

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", updateDuration);

  return () => {
    audio.removeEventListener("timeupdate", updateProgress);
    audio.removeEventListener("loadedmetadata", updateDuration);
  };
}, []);
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
const seek = (e) => {
  const audio = audioRef.current;
  if (!audio || !duration) return;

  const percent = e.target.value;
  audio.currentTime = (percent / 100) * duration;
};
const togglePlay = () => {
  const audio = audioRef.current;
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    setIsPlaying(false);
  } else {
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  }
};
  return (
    <div className="home-container">

      {songs.length === 0 && <p>No songs found</p>}
      <div className="songs-grid">
        {songs.map((song, index) => (
          <div
            key={song._id}
            className={`song-card ${currentIndex === index ? "active" : ""}`}
            onClick={() => playSong(index)}
          >
            <img src="/music-cover.png" alt="cover" className="song-cover" />

            <div className="song-info">
              <p className="song-title">{song.title}</p>
              <p className="song-artist">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
      {/* PLAYER CONTROLS */}
      {currentSong && (
  <div className="player-box">
    {/* SONG INFO */}
    <div className="player-info">
      <strong>{currentSong.title}</strong><br />
      <span>{currentSong.artist}</span>
    </div>

    {/* PROGRESS BAR */}
    <input
      className="progress-bar"
      type="range"
      min="0"
      max="100"
      value={duration ? (progress / duration) * 100 : 0}
      onChange={seek}
    />

    {/* CONTROLS */}
    <div className="controls">
      <button onClick={playPrev}>⏮</button>
      <button onClick={togglePlay}>
        {isPlaying ? "⏸" : "▶"}
      </button>
      <button onClick={playNext}>⏭</button>
    </div>
  </div>
)}
      <audio ref={audioRef} />
    </div>
  );
}

export default Home;
