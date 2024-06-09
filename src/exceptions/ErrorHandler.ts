import { Response } from "express";
import { HttpException } from "./HttpException";

export class ErrorHandler {
  handleError(error: unknown, res: Response) {
    console.error(error);
    if (error instanceof HttpException) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
