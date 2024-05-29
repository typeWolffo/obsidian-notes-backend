import express, { Request, Response } from "express";
import "dotenv/config";
import { NotesService } from "./notes/notes.service";
import { NotesController } from "./notes/notes.controller";
import { RoomsController } from "./rooms/rooms.controller";
import { RoomsService } from "./rooms/rooms.service";
import { db } from "./drizzle-config";

export function build() {
  const app = express();

  app.use(express.json());
  app.use(new NotesController(new NotesService()).routes);
  app.use(new RoomsController(new RoomsService(db)).routes);

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.json({
      api: "ok",
    });
  });

  return app;
}
