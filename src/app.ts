import express, { Request, Response } from "express";
import "dotenv/config";
import { db } from "./drizzle-config";
import cors from "cors";
import { ErrorHandler } from "./exceptions";
import { AuthController } from "./v1/auth/auth.controller";
import { AuthService } from "./v1/auth/auth.service";
import { InvitationsController } from "./v1/invitations/invitations.controller";
import { InvitationsService } from "./v1/invitations/invitations.service";
import { NotesController } from "./v1/notes/notes.controller";
import { NotesService } from "./v1/notes/notes.service";
import { RoomsController } from "./v1/rooms/rooms.controller";
import { RoomsService } from "./v1/rooms/rooms.service";
import { UsersController } from "./v1/users/users.controller";
import { UsersService } from "./v1/users/users.service";
import { env } from "./env";

export function build() {
  const app = express();
  const errorHandler = new ErrorHandler();
  const apiBaseUrl = env.API_BASE_PATH;

  const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  app.use(express.json());

  app.use(
    apiBaseUrl,
    new NotesController(new NotesService(), errorHandler).routes
  );
  app.use(
    apiBaseUrl,
    new RoomsController(new RoomsService(db), errorHandler).routes
  );
  app.use(
    apiBaseUrl,
    new UsersController(new UsersService(db), errorHandler).routes
  );
  app.use(
    apiBaseUrl,
    new AuthController(new AuthService(db), errorHandler).routes
  );
  app.use(
    apiBaseUrl,
    new InvitationsController(new InvitationsService(db), errorHandler).routes
  );

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.json({
      api: "ok",
    });
  });

  return app;
}
