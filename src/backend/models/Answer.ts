import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class Answer extends Model {
  public id!: number;
  public userId!: number;
  public questionId!: number;
  public answer!: string;
}

Answer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    questionId: { type: DataTypes.INTEGER, allowNull: false },
    answer: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "Answer",
    tableName: "answers",
    timestamps: false, // Nếu không sử dụng createdAt, updatedAt
  }
);

// Thiết lập quan hệ với User
Answer.belongsTo(User, { foreignKey: "userId" });

export default Answer;
