import { InferInsertModel, eq } from "drizzle-orm";
import { Database } from "../../common";
import { users } from "../../drizzle-config";
import { HttpException } from "../../exceptions";

export class UsersService {
  constructor(private readonly db: Database) {}

  async findMany() {
    const allUsers = await this.db.select().from(users);
    return allUsers;
  }

  async findById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return user;
  }

  async delete(id: string) {
    const [user] = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!user) {
      throw new HttpException(500, "Failed to delete user");
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async update(id: string, data: Partial<InferInsertModel<typeof users>>) {
    const [user] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();

    if (!user) {
      throw new HttpException(500, "Failed to update user");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
