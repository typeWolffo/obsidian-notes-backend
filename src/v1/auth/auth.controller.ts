import { Router, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ErrorHandler } from "../../exceptions";

export class AuthController {
  public routes = Router();

  constructor(
    private readonly authService: AuthService,
    private readonly errorHandler: ErrorHandler
  ) {
    this.routes.post("/register", this.register);
    this.routes.post("/confirm", this.confirmEmail);
    this.routes.post("/login", this.login);
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, password, email } = req.body;
      const result = await this.authService.register(username, password, email);

      res.status(201).json({ data: result });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  confirmEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const result = await this.authService.confirmRegistration(token);

      res.status(200).json({ data: result });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);

      const { refreshToken, token, ...userData } = user;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production", // TODO: test
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
      });
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
      });

      res.status(200).json({ data: userData });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };
}
