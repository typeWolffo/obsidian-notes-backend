import { InferInsertModel, eq } from "drizzle-orm";
import { Database } from "../common";
import { rooms } from "../drizzle-config";

export class RoomsService {
  constructor(private readonly db: Database) {}

  async getRooms() {
    const response = await this.db.select().from(rooms);
    return response;
  }

  async getRoomById(id: string) {
    const [room] = await this.db.select().from(rooms).where(eq(rooms.id, id));

    if (!room) {
      return null;
    }

    return room;
  }

  async createRoom(
    room: InferInsertModel<typeof rooms>
  ): Promise<InferInsertModel<typeof rooms>> {
    const [newRoom] = await this.db.insert(rooms).values(room).returning();
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
    return updatedRoom;
  }

  async deleteRoom(id: string) {
    await this.db.delete(rooms).where(eq(rooms.id, id));
  }
}
