import express, { Request, Response, NextFunction } from "express";
import authenticate, { AuthenticatedRequest } from "../middlewares/authenticate";

const router = express.Router();

router.post(
  "/submit",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const userId = authenticatedReq.user?.id;
      
      if (!userId) {
        console.log(res.status(401).json({ error: "Unauthorized" }));
        return; 
      }
      
      // Xử lý lưu câu trả lời
      console.log(res.status(200).json({ message: "Answer submitted successfully" }));
      return; 
    } catch (error) {
      return next(error);
    }
  }
);

export default router;