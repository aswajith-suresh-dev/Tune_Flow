import "../css/landing.css";

function Landing() {
  return (
    <div className="landing">
      {/* HERO SECTION */}
      <section className="hero">
        <h1>Feel the Music</h1>
        <p>
          Stream, organize, and enjoy your favorite tracks in one place.
        </p>
        <div className="hero-actions">
          <a href="/login" className="primary-btn">Get Started</a>
          <a href="/home" className="secondary-btn">Explore Music</a>
        </div>
      </section>
<section className="features">
    <div className="features-wrapper">
  <div className="features-grid">
    
    <div className="feature text">
      <h2>Create Playlists</h2>
      <p>
        Organize your favorite songs into playlists and enjoy
        music your way.
      </p>
    </div>

    <div className="feature image">
      <img src="/feature-playlist.png" alt="Playlist feature" />
    </div>

    <div className="feature image">
      <img src="/feature-player.png" alt="Music player" />
    </div>

    <div className="feature text">
      <h2>Powerful Music Player</h2>
      <p>
        Play, pause, skip, and control your music with a clean,
        modern player.
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