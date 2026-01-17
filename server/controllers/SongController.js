import fs from "fs";
import path from "path";
import Song from "../models/Song.js";

export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Build absolute path safely
    const filePath = path.join(
      process.cwd(),
      song.fileUrl.startsWith("/") ? song.fileUrl.slice(1) : song.fileUrl,
    );

    // Delete file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete DB record
    await Song.findByIdAndDelete(id);

    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};
// @desc    Update song details
// @route   PUT /api/songs/:id
export const updateSong = async (req, res) => {
  console.log("UPDATE HIT");
  console.log("PARAMS:", req.params);
  console.log("BODY:", req.body);

  try {
    const { id } = req.params;
    const { title, artist } = req.body;

    const song = await Song.findById(id);
    console.log("FOUND SONG:", song);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    song.title = title;
    song.artist = artist;

    await song.save();

    res.json({ message: "Song updated successfully", song });
  } catch (error) {
    console.error("🔥 REAL UPDATE ERROR:", error);
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch songs" });
  }
};

// @desc    Add a new song
// @route   POST /api/songs
// @access  Admin (for now, manual)
export const addSong = async (req, res) => {
  try {
    const { title, artist } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const song = await Song.create({
      title,
      artist,
      fileUrl: `/uploads/songs/${req.file.filename}`,
    });

    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
