import { Router, Request, Response } from "express";
import { NotesService } from "./notes.service";

export class NotesController {
  public routes = Router();

  constructor(private readonly notesService: NotesService) {
    this.routes.get("/notes", this.index);
  }

  index = async (_req: Request, res: Response) => {
    try {
      const notes = await this.notesService.getNotes();
      res.status(200).json({ data: notes });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to fetch notes.");
    }
  };
}
