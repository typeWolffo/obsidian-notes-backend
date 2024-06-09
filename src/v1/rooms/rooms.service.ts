import { InferInsertModel, eq } from "drizzle-orm";
import { Database } from "../../common";
import { rooms } from "../../drizzle-config";
import { HttpException } from "../../exceptions";

export class RoomsService {
  constructor(private readonly db: Database) {}

  async getRooms() {
    const response = await this.db.select().from(rooms);

    return response;
  }

  async getRoomById(id: string) {
    const [room] = await this.db.select().from(rooms).where(eq(rooms.id, id));

    if (!room) {
      throw new HttpException(404, "Room not found");
    }

    return room;
  }

  async createRoom(
    room: InferInsertModel<typeof rooms>
  ): Promise<InferInsertModel<typeof rooms>> {
    const [newRoom] = await this.db.insert(rooms).values(room).returning();

    if (!newRoom) {
      throw new HttpException(500, "Failed to create room");
    }

    return newRoom;
  }

  async updateRoom(
    id: string,
    room: Partial<InferInsertModel<typeof rooms>>
  ): Promise<InferInsertModel<typeof rooms>> {
    const [updatedRoom] = await this.db
      .update(rooms)
      .set(room)
      .where(eq(rooms.id, id))
      .returning();

    if (!updatedRoom) {
      throw new HttpException(500, "Failed to update room");
    }

    return updatedRoom;
  }

  async deleteRoom(id: string) {
    const result = await this.db
      .delete(rooms)
      .where(eq(rooms.id, id))
      .returning();

    if (!result) {
      throw new HttpException(500, "Failed to delete room");
    }

    return result;
  }
}
