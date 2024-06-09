import { Router, Request, Response } from "express";
import { NotesService } from "./notes.service";
import { ErrorHandler } from "../../exceptions";

export class NotesController {
  public routes = Router();

  constructor(
    private readonly notesService: NotesService,
    private readonly errorHandler: ErrorHandler
  ) {
    this.routes.get("/notes", this.index);
  }

  index = async (_req: Request, res: Response) => {
    try {
      const notes = await this.notesService.getNotes();
      res.status(200).json({ data: notes });
    } catch (error) {
      console.error(error);
      this.errorHandler.handleError(error, res);
    }
  };
}
