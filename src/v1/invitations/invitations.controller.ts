import { Request, Response, Router } from "express";
import { InvitationsService } from "./invitations.service";
import { ErrorHandler } from "../../exceptions";

export class InvitationsController {
  public routes = Router();

  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly errorHandler: ErrorHandler
  ) {
    this.routes.post("/invite", this.invite);
    this.routes.post("/accept-invite", this.accept);
  }

  invite = async (req: Request, res: Response) => {
    try {
      const { email, roomId, inviterId } = req.body;
      const result = await this.invitationsService.inviteUser(
        email,
        roomId,
        inviterId
      );

      res.status(201).json({ data: result });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };

  accept = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const result = await this.invitationsService.acceptInvitation(token, res);

      res.status(200).json({ data: result });
    } catch (error) {
      this.errorHandler.handleError(error, res);
    }
  };
}
