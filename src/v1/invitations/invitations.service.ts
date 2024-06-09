import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Database } from "../../common";
import { invitations, userRooms, users } from "../../drizzle-config";
import { EmailService } from "../../common/mailer/email.service";
import { HttpException } from "../../exceptions";
import { Response } from "express";

export class InvitationsService {
  constructor(private readonly db: Database) {}

  async inviteUser(email: string, roomId: string, inviterId: string) {
    const token = uuidv4();
    const emailService = new EmailService();

    const [result] = await this.db
      .insert(invitations)
      .values({
        email,
        roomId,
        inviterId,
        token,
      })
      .returning();

    if (!result) {
      throw new HttpException(500, "Failed to send invitation");
    }

    const inviteLink = `http://localhost:5147/accept-invitation?token=${token}`;
    await emailService.sendMail(
      email,
      "Invitation to join room",
      `<p>You have been invited to join the room! Click <a href="${inviteLink}">here</a> to accept the invitation.</p>`
    );

    return result;
  }

  async acceptInvitation(token: string, res: Response) {
    const [invitation] = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.token, token));

    if (!invitation) {
      throw new HttpException(404, "Invitation not found");
    }

    const [userId] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, invitation.email));

    if (!userId) {
      res.redirect(301, "http://example.com");
    }

    const [result] = await this.db
      .insert(userRooms)
      .values({
        userId: userId.id,
        roomId: invitation.roomId,
      })
      .returning();

    if (!result) {
      throw new HttpException(500, "Failed to accept invitation");
    }

    await this.db.delete(invitations).where(eq(invitations.token, token));

    return result;
  }
}
