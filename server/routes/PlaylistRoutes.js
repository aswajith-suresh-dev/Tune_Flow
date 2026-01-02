import express from "express";
import {
  createPlaylist,
  getMyPlaylists,
  addSongToPlaylist,
} from "../controllers/PlaylistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPlaylist);
router.get("/mine", protect, getMyPlaylists);
router.post("/add-song", protect, addSongToPlaylist);

export default router;