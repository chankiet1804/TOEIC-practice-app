import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
//import { AuthenticatedRequest } from '../types/custom';

export interface AuthenticatedRequest extends Request {
    user?: {
      id: string;
    };
  }

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) : void => {
  const token = req.headers.authorization;
  if (!token){ console.log( res.status(401).json({ message: "Unauthorized" }));
    return;
}

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
  
};

export default authenticate;