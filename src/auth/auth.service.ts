import bcrypt from "bcryptjs";
import { Database } from "../common";
import { tempUsers, users } from "../drizzle-config";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { v4 as uuidv4 } from "uuid";
import { EmailService } from "../invitations/email.service";

export class AuthService {
  constructor(private readonly db: Database) {}

  async register(nickname: string, password: string, email: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = uuidv4();
    const emailService = new EmailService();

    const tempUser = {
      nickname,
      email,
      password: hashedPassword,
      token: confirmationToken,
      confirmed: false,
    };

    await this.db.insert(tempUsers).values(tempUser);

    const confirmationUrl = `http://localhost:5143/confirm-registration?token=${confirmationToken}`;
    await emailService.sendMail(
      email,
      "Confirm Your Registration",
      `<p>Please confirm your registration by clicking <a href="${confirmationUrl}">here</a>.</p>`
    );

    return { message: "Registration successful, please confirm your email." };
  }

  async confirmRegistration(token: string) {
    const [tempUser] = await this.db
      .select()
      .from(tempUsers)
      .where(eq(tempUsers.token, token));

    if (!tempUser) {
      return { message: "Invalid token." };
    }

    if (tempUser.confirmed) {
      return { message: "Email already confirmed." };
    }

    await this.db.insert(users).values({
      nickname: tempUser.nickname,
      email: tempUser.email,
      password: tempUser.password,
    });

    await this.db
      .update(tempUsers)
      .set({ confirmed: true })
      .where(eq(tempUsers.token, token));

    return { message: "Email confirmed." };
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
