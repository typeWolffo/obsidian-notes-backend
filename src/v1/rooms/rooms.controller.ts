import { Router, Request, Response } from "express";
import { RoomsService } from "./rooms.service";
import { ErrorHandler } from "../../exceptions";

export class RoomsController {
  public routes = Router();

  constructor(
    private readonly roomsService: RoomsService,
    private readonly errorHandler: ErrorHandler
  ) {
    this.routes.get("/rooms", this.index);
    this.routes.get("/rooms/:id", this.getById);
    this.routes.post("/rooms", this.create);
    this.routes.delete("/rooms/:id", this.delete);
    this.routes.patch("/rooms/:id", this.update);
  }

  index = async (_req: Request, res: Response) => {
    try {
      const result = await this.roomsService.getRooms();

      res.status(200).json({ data: result });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const result = await this.roomsService.getRoomById(req.params.id);

      res.status(200).json({ data: result });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const result = await this.roomsService.createRoom(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const result = await this.roomsService.updateRoom(
        req.params.id,
        req.body
      );
      res.status(200).json({ data: result });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const result = await this.roomsService.deleteRoom(req.params.id);
      res.status(204).json({ data: result });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };
}
