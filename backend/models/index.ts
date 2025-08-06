import sequelize from "../config/db.ts";
import Movie from "./movie.ts";
import User from "./user.ts";

const syncDb = async () => {
  await sequelize.sync({ alter: true });
};

export { sequelize, syncDb, Movie, User };
