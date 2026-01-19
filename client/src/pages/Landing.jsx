import "../css/landing.css";

function Landing() {
  return (
    <div className="landing"> 
      {/* HERO SECTION */}
      <section className="hero">
        <h1>Feel the Music</h1>
        <p>All your music one place.</p>
        <div className="hero-actions">
          <a href="/login" className="primary-btn">
            Get Started
          </a>
        </div>
      </section>
      <section className="features">
        <div className="features-wrapper">
          <div className="features-grid">
            <div className="feature text">
              <h2>Create Playlists</h2>
              <p>
                Organize your favorite songs into playlists and enjoy music your
                way. Build playlists for focus, fun, or late-night sessions.
                Your music, structured just the way you like it.
              </p>
            </div>

            <div className="feature image">
              <img src="/undraw_online-media_opxh.svg" alt="Playlist feature" />
            </div>

            <div className="feature image">
              <img src="/undraw_audio-player_7uwh.svg" alt="Music player" />
            </div>

            <div className="feature text">
              <h2>Powerful Music Player</h2>
              <p>
                Play, pause, skip, and take full control of your music with a
                clean, modern player. Enjoy a smooth listening experience
                designed to keep the focus on your sound, not distractions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 Music Player. Built with ❤️</p>
      </footer>
    </div>
  );
}

export default Landing;
