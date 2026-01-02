// import express from "express";
// import upload from "../config/multer.js";
// import { deleteSong } from "../controllers/SongController.js";


// import { getAllSongs, addSong } from "../controllers/SongController.js";

// const router = express.Router();

// // GET all songs (users listen)
// router.get("/", getAllSongs);

// // POST a new song (admin adds)
// router.post("/", upload.single("song"), addSong);
// router.delete("/:id", deleteSong);
// router.delete("/test", (req, res) => {
//   res.json({ message: "DELETE route working" });
// });

// export default router;
import express from "express";
import { getAllSongs, addSong, deleteSong, updateSong } from "../controllers/SongController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* ------------------ MULTER SETUP ------------------ */
const storage = multer.diskStorage({
  destination: "uploads/songs",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ------------------ ROUTES ------------------ */

// ✅ GET all songs
router.get("/", getAllSongs);
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("song"),
  addSong
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteSong
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateSong
);



export default router;


