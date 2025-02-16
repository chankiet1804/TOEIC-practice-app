import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false, // Nếu không sử dụng createdAt, updatedAt
  }
);

export default User;
