import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Kiểm tra DB_DIALECT đã được load chưa
if (!process.env.DB_DIALECT) {
  throw new Error("DB_DIALECT is missing. Please check your .env file.");
}

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: process.env.DB_DIALECT as "mysql" ,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err: Error) => console.log("Error: " + err.message));

export default sequelize;
