import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db.ts";

interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

interface MovieAttributesCreate extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, MovieAttributesCreate>
  implements UserAttributes
{
  declare id: number;
  declare username: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "Users",
    sequelize,
  }
);

export default User;
