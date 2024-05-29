"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesController = void 0;
const express_1 = require("express");
class NotesController {
    constructor(notesService) {
        this.notesService = notesService;
        this.routes = (0, express_1.Router)();
        this.index = async (_req, res) => {
            try {
                const notes = await this.notesService.getNotes();
                res.status(200).json({ data: notes });
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Failed to fetch notes.");
            }
        };
        this.routes.get("/notes", this.index);
    }
}
exports.NotesController = NotesController;
