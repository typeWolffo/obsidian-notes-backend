import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { EmailService } from "../../common/mailer/email.service";
import { Database } from "../../common";
import { users } from "../../drizzle-config";
import { env } from "../../env";
import { HttpException } from "../../exceptions";

export class AuthService {
  constructor(private readonly db: Database) {}

  async register(username: string, password: string, email: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = uuidv4();
    const emailService = new EmailService();

    const newUser = {
      username,
      unregisteredEmail: email,
      password: hashedPassword,
      confirmationToken,
      confirmed: false,
    };

    const [result] = await this.db.insert(users).values(newUser).returning();

    const confirmationUrl = `http://localhost:5173/confirm-registration/${confirmationToken}`;
    await emailService.sendMail(
      email,
      "Confirm Your Registration",
      `<p>Please confirm your registration by clicking <a href="${confirmationUrl}">here</a>.</p>`
    );

    return result;
  }

  async confirmRegistration(token: string) {
    const [tempUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.confirmationToken, token));

    if (!tempUser) {
      throw new HttpException(400, "Invalid token.");
    }

    if (tempUser.confirmedAt) {
      throw new HttpException(400, "Email already confirmed.");
    }

    const [response] = await this.db
      .update(users)
      .set({
        confirmedAt: new Date().toISOString(),
        confirmationToken: null,
        username: tempUser.username,
        email: tempUser.unregisteredEmail,
        password: tempUser.password,
        unregisteredEmail: null,
      })
      .where(eq(users.confirmationToken, token))
      .returning();

    const { password: _, ...userWithoutPassword } = response;

    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      throw new HttpException(404, "User not found.");
    }

    if (!user.confirmedAt) {
      throw new HttpException(403, "Email not confirmed.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new HttpException(403, "Invalid email or password.");
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
