/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  getMovies,
  deleteMovie,
  updateMovie,
  getMovieById,
} from "../services/movie.service";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface Movie {
  id: number;
  createdById: number;
  title: string;
  genre?: string;
  year: number;
}

const MovieList: React.FC = () => {
  const auth = useContext(AuthContext);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [singleMovie, setSingleMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await getMovies(page, limit);
      setMovies(res.data.movies || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
    setLoading(false);
  };
  const fetchMovieById = async (id: number) => {
    try {
      const res = await getMovieById(id);
      setSingleMovie(res.data);
    } catch (error) {
      setError("Failed to fetch movie details.");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchMovies();
  }, [page]);

  const handleDelete = async (id: number) => {
    await deleteMovie(id);
    fetchMovies();
  };
  const handleUpdate = async (id: number) => {
    if (!title.trim() || !year.trim()) {
      setError("Title and Year are required.");
      return;
    }
    const yrNum = Number(year);
    if (isNaN(yrNum)) {
      setError("Year must be a number.");
      return;
    }

    try {
      await updateMovie(id, {
        title: title.trim(),
        genre: genre.trim() || undefined,
        year: yrNum,
      });
      setTitle("");
      setGenre("");
      setYear("");
      fetchMovies();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update movie");
    }
  };

  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);

  const startEditing = (movie: Movie) => {
    setEditingMovieId(movie.id);
    setTitle(movie.title);
    setGenre(movie.genre || "");
    setYear(movie.year.toString());
  };

  const cancelEditing = () => {
    setEditingMovieId(null);
    setTitle("");
    setGenre("");
    setYear("");
  };
  return (
    <div className="justify-self-center">
      <h2>Movie List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <div>Loading...</div>}
      <div className="flex justify-between ">
        <ul className="py-5">
          {movies.map((m) => (
            <li
              key={m.id}
              className="w-full px-10  bg-[#0000006c]  rounded-md "
            >
              <div className="space-x-5 space-y-5 flex p-2 mb-5">
                <div>
                  <span className="flex gap-6">
                    title: <p>{m.title}</p>
                  </span>
                  <span className="flex gap-2">
                    Genre: <p>({m.genre && `${m.genre}`})</p>
                  </span>
                  <span className="flex gap-5">
                    Year: <p>({m.year})</p>
                  </span>
                </div>
                <button className="h-max" onClick={() => fetchMovieById(m.id)}>
                  View
                </button>
                <div className="">
                  {auth.user?.userId === m.createdById ? (
                    <div className="space-x-5">
                      <button onClick={() => startEditing(m)}>Edit</button>
                      <button onClick={() => handleDelete(m.id)}>Delete</button>
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {editingMovieId !== null && (
          <form
            className="mx-10 h-max pb-4 space-y-3 bg-[#0000006c] p-2 rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              if (editingMovieId !== null) handleUpdate(editingMovieId);
            }}
          >
            <h3>Update Movie</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="space-x-2.5">
              <label>Title*: </label>
              <input
                className="border rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-x-1">
              <label>Genre: </label>
              <input
                className="border rounded-md"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div className="space-x-4">
              <label>Year: </label>
              <input
                className="border rounded-md"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="flex gap-5">
              <button type="submit">Update Movie</button>
              <button type="button" onClick={cancelEditing}>
                Cancel
              </button>
            </div>
          </form>
        )}
        {singleMovie && (
          <div className="absolute right-130 border py-3 p-3 rounded-md space-y-2">
            <h3>Details for: {singleMovie.title}</h3>
            <p>
              <strong>Genre:</strong> {singleMovie.genre || "N/A"}
            </p>
            <p>
              <strong>Year:</strong> {singleMovie.year}
            </p>
            <button onClick={() => setSingleMovie(null)}>Close Details</button>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieList;
