import { Router, Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  public routes = Router();

  constructor(private readonly authService: AuthService) {
    this.routes.post("/register", this.register);
    this.routes.post("/confirm", this.confirmEmail);
    this.routes.post("/login", this.login);
  }

  register = async (req: Request, res: Response) => {
    try {
      const { nickname, password, email } = req.body;
      const result = await this.authService.register(nickname, password, email);
      res.status(201).json({ data: result });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to register user.");
    }
  };

  confirmEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      await this.authService.confirmRegistration(token);
      res.status(200).send("Email confirmed");
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to confirm email.");
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);

      if (!user) {
        return res.status(401).send("Invalid email or password");
      }

      const { refreshToken, token, ...userData } = user;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.status(200).json({ data: userData });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to login user.");
    }
  };
}
