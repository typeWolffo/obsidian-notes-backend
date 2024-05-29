"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const notes_service_1 = require("./notes/notes.service");
const notes_controller_1 = require("./notes/notes.controller");
const rooms_controller_1 = require("./rooms/rooms.controller");
const rooms_service_1 = require("./rooms/rooms.service");
const drizzle_config_1 = require("./drizzle-config");
function build() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(new notes_controller_1.NotesController(new notes_service_1.NotesService()).routes);
    app.use(new rooms_controller_1.RoomsController(new rooms_service_1.RoomsService(drizzle_config_1.db)).routes);
    app.get("/healthcheck", (_req, res) => {
        res.json({
            api: "ok",
        });
    });
    return app;
}
exports.build = build;
