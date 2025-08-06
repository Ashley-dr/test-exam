import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db.ts";

interface MovieAttributes {
  id: number;
  createdById: number;
  title: string;
  genre?: string;
  year: number;
}

interface MovieAttributesCreate extends Optional<MovieAttributes, "id"> {}

class Movie
  extends Model<MovieAttributes, MovieAttributesCreate>
  implements MovieAttributes
{
  declare id: number;
  declare createdById: number;
  declare title: string;
  declare genre?: string;
  declare year: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    createdById: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    title: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    genre: {
      type: new DataTypes.STRING(100),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "movies",
    sequelize,
  }
);

export default Movie;
