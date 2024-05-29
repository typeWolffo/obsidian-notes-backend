import { Router, Request, Response } from "express";
import { RoomsService } from "./rooms.service";

export class RoomsController {
  public routes = Router();

  constructor(private readonly roomsService: RoomsService) {
    this.routes.get("/rooms", this.index);
    this.routes.get("/rooms/:id", this.getById);
    this.routes.post("/rooms", this.create);
    this.routes.delete("/rooms/:id", this.delete);
    this.routes.patch("/rooms/:id", this.update);
  }

  index = async (_req: Request, res: Response) => {
    try {
      const rooms = await this.roomsService.getRooms();
      res.status(200).json({ data: rooms });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to fetch notes.");
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const room = await this.roomsService.getRoomById(req.params.id);
      if (!room) {
        return res.status(204).send("Room not found");
      }
      res.status(200).json({ data: room });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to fetch notes.");
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const room = await this.roomsService.createRoom(req.body);
      res.status(201).json({ data: room });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to fetch notes.");
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const room = await this.roomsService.updateRoom(req.params.id, req.body);
      res.status(200).json({ data: room });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to fetch notes.");
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.roomsService.deleteRoom(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to fetch notes.");
    }
  };
}
