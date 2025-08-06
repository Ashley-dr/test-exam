import { Router } from "express";
import {
  createMovie,
  getMoviesData,
  getMoviesByDataId,
  updateMovie,
  deleteMovie,
} from "../controller/movieController";
import { authenticate } from "../middleware/authenticate";
const router = Router();

router.get("/movies", getMoviesData);
router.get("/movies/:id", getMoviesByDataId);
router.post("/movies", authenticate, createMovie);
router.put("/movies/:id", authenticate, updateMovie);
router.delete("/movies/:id", authenticate, deleteMovie);

export default router;
