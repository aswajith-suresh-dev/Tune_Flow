import Playlist from "../models/Playlist.js";

// CREATE PLAYLIST
export const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Playlist name required" });
    }

    const playlist = await Playlist.create({
      name,
      user: req.user.id,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to create playlist" });
  }
};

// GET MY PLAYLISTS
export const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).populate(
      "songs"
    );
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch playlists" });
  }
};

// ADD SONG TO PLAYLIST
// ADD SONG TO PLAYLIST (BACKEND)
export const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: req.user.id,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    const updatedPlaylist = await Playlist.findById(
      playlist._id
    ).populate("songs");

    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Failed to add song" });
  }
};