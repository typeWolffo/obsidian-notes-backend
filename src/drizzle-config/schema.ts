import { sql } from "drizzle-orm";
import { pgEnum, pgTable, uuid, text, primaryKey } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date().toISOString()),
};

export const roleEnum = pgEnum("role_enum", ["admin", "user"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  nickname: text("nickname").notNull(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("user"),
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
