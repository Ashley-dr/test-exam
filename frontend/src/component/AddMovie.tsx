/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from "react";
import { addMovie } from "../services/movie.service";
import { AuthContext } from "../context/AuthContext";

const AddMovie: React.FC<{ onAdded: () => void }> = ({ onAdded }) => {
  const auth = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!auth.user) {
      setError("You must be logged in to add a movie.");
      return;
    }
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
      await addMovie({
        title: title.trim(),
        genre: genre.trim() || undefined,
        year: yrNum,
      });
      setTitle("");
      setGenre("");
      setYear("");
      onAdded();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add movie");
    }
  };

  return (
    <form
      className=" grid  py-4  justify-center w-full"
      onSubmit={handleSubmit}
    >
      <div className="grid space-y-5 py-4 bg-[#0000006c] rounded-md px-5 justify-center w-max">
        <h3>Add Movie</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="space-x-5">
          <label>Title: </label>
          <input
            className="border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-x-2">
          <label>Genre: </label>
          <input
            className="border rounded-md"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <div className="space-x-3">
          <label>Year*: </label>
          <input
            className="border rounded-md"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <button type="submit">Add Movie</button>
      </div>
    </form>
  );
};

export default AddMovie;
