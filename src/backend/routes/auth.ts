import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();
const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: any; // Hoặc kiểu dữ liệu cụ thể của bạn
}


// Register route
router.post("/register", async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword });
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Login route
router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;