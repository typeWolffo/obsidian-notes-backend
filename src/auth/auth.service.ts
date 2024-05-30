import bcrypt from "bcryptjs";
import { Database } from "../common";
import { users } from "../drizzle-config";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { env } from "../env";

export class AuthService {
  constructor(private readonly db: Database) {}

  async register(nickname: string, password: string, email: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.db.insert(users).values({
      nickname,
      email,
      password: hashedPassword,
    });

    return result;
  }

  async login(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!user || !isValidPassword) {
      return null;
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ id: user.id }, env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token, refreshToken };
  }
}
