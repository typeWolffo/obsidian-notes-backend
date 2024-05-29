import { eq } from "drizzle-orm";
import { db } from "../drizzle-config";
import { users, rooms } from "../drizzle-config/schema";

export class UsersService {
  async findMany() {
    return db.select().from(users);
  }

  async findOneById(id: string) {
    return db.select().from(users).where(eq(users.id, id));
  }
}
