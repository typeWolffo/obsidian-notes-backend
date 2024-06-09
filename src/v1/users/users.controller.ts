import { Request, Response, Router } from "express";
import { UsersService } from "./users.service";
import { ErrorHandler } from "../../exceptions";

export class UsersController {
  public routes = Router();

  constructor(
    private readonly usersService: UsersService,
    private readonly errorHandler: ErrorHandler
  ) {
    this.routes.get("/users", this.index);
    this.routes.get("/users/:id", this.getById);
    this.routes.delete("/users/:id", this.delete);
    this.routes.patch("/users/:id", this.update);
  }

  index = async (_req: Request, res: Response) => {
    try {
      const users = await this.usersService.findMany();
      res.status(200).json({ data: users });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const user = await this.usersService.findById(req.params.id);

      res.status(200).json({ data: user });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.usersService.delete(req.params.id);

      res.status(200).send("User deleted");
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      await this.usersService.update(req.params.id, req.body);

      res.status(200).send("User updated");
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };
}
