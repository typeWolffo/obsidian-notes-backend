import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  uuid,
  text,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: text("created_at").default(
    sql`TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`
  ),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date().toISOString()),
};

export const roleEnum = pgEnum("role_enum", ["admin", "user"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  unregisteredEmail: text("unregistered_email").unique(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("user"),
  confirmedAt: text("confirmed_at"),
  confirmationToken: text("confirmation_token").unique(),
  ...timestamps,
});

export const tempUsers = pgTable("temp_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  nickname: text("nickname").notNull(),
  password: text("password").notNull(),
  token: text("token").notNull().unique(),
  confirmed: boolean("confirmed").notNull().default(false),
  ...timestamps,
});

export const userRooms = pgTable(
  "user_rooms",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.roomId] }),
    };
  }
);

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id),
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => users.id),
  token: text("token").notNull().unique(),
  ...timestamps,
});
