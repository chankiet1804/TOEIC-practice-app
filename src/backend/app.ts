import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import authRoutes from "./routes/auth";
import answerRoutes from "./routes/answers";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/answers", answerRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("Database sync failed", err));
