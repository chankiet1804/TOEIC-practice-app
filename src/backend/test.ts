import sequelize from "./config/database";  // Đường dẫn đến file config của bạn

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err));
