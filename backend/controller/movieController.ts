import express from "express";
import { Movie } from "../models";

export const createMovie = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { title, genre, year } = req.body;
    if (!title || !year)
      return res.status(400).json({ error: "Title and year are required." });
    const movie = await Movie.create({
      title,
      genre,
      year,
      createdById: userId,
    });
    return res.status(201).json(movie);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getMoviesData = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const offset = (page - 1) * size;

    const { rows: movies, count } = await Movie.findAndCountAll({
      limit: size,
      offset,
    });

    const totalPages = Math.ceil(count / size);

    res.json({
      movies,
      totalPages,
      totalItems: count,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getMoviesByDataId = async (req, res) => {
  try {
    const id = req.params.id;
    const getMovieId = await Movie.findByPk(id);
    if (!getMovieId) return res.status(404).json({ error: "Movie not found" });
    res.json(getMovieId);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, genre, year } = req.body;

    const movie = await Movie.findByPk(id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    if (title !== undefined) movie.title = title;
    if (genre !== undefined) movie.genre = genre;
    if (year !== undefined) movie.year = year;

    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Movie.destroy({ where: { id } });

    if (deleted === 0)
      return res.status(404).json({ error: "Movie not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
