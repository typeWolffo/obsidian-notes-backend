"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_config_1 = require("../drizzle-config");
class RoomsService {
    constructor(db) {
        this.db = db;
    }
    async getRooms() {
        const response = await this.db.select().from(drizzle_config_1.rooms);
        return response;
    }
    async getRoomById(id) {
        const [room] = await this.db.select().from(drizzle_config_1.rooms).where((0, drizzle_orm_1.eq)(drizzle_config_1.rooms.id, id));
        if (!room) {
            return null;
        }
        return room;
    }
    async createRoom(room) {
        const [newRoom] = await this.db.insert(drizzle_config_1.rooms).values(room).returning();
        return newRoom;
    }
    async updateRoom(id, room) {
        const [updatedRoom] = await this.db
            .update(drizzle_config_1.rooms)
            .set(room)
            .where((0, drizzle_orm_1.eq)(drizzle_config_1.rooms.id, id))
            .returning();
        return updatedRoom;
    }
    async deleteRoom(id) {
        await this.db.delete(drizzle_config_1.rooms).where((0, drizzle_orm_1.eq)(drizzle_config_1.rooms.id, id));
    }
}
exports.RoomsService = RoomsService;
