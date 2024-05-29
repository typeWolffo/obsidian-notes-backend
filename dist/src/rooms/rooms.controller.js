"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsController = void 0;
const express_1 = require("express");
class RoomsController {
    constructor(roomsService) {
        this.roomsService = roomsService;
        this.routes = (0, express_1.Router)();
        this.index = async (_req, res) => {
            try {
                const rooms = await this.roomsService.getRooms();
                res.status(200).json({ data: rooms });
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Failed to fetch notes.");
            }
        };
        this.getById = async (req, res) => {
            try {
                const room = await this.roomsService.getRoomById(req.params.id);
                if (!room) {
                    return res.status(204).send("Room not found");
                }
                res.status(200).json({ data: room });
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Failed to fetch notes.");
            }
        };
        this.create = async (req, res) => {
            try {
                const room = await this.roomsService.createRoom(req.body);
                res.status(201).json({ data: room });
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Failed to fetch notes.");
            }
        };
        this.update = async (req, res) => {
            try {
                const room = await this.roomsService.updateRoom(req.params.id, req.body);
                res.status(200).json({ data: room });
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Failed to fetch notes.");
            }
        };
        this.delete = async (req, res) => {
            try {
                await this.roomsService.deleteRoom(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Failed to fetch notes.");
            }
        };
        this.routes.get("/rooms", this.index);
        this.routes.get("/rooms/:id", this.getById);
        this.routes.post("/rooms", this.create);
        this.routes.delete("/rooms/:id", this.delete);
        this.routes.patch("/rooms/:id", this.update);
    }
}
exports.RoomsController = RoomsController;
