"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitations = exports.rooms = exports.userRooms = exports.users = exports.roleEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const timestamps = {
    createdAt: (0, pg_core_1.text)("created_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`),
    updatedAt: (0, pg_core_1.text)("updated_at")
        .default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => new Date().toISOString()),
};
exports.roleEnum = (0, pg_core_1.pgEnum)("role_enum", ["admin", "user"]);
exports.users = (0, pg_core_1.pgTable)("users", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), email: (0, pg_core_1.text)("email").notNull().unique(), nickname: (0, pg_core_1.text)("nickname").notNull(), password: (0, pg_core_1.text)("password").notNull(), role: (0, exports.roleEnum)("role").notNull().default("user") }, timestamps));
exports.userRooms = (0, pg_core_1.pgTable)("user_rooms", {
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => exports.users.id),
    roomId: (0, pg_core_1.uuid)("room_id")
        .notNull()
        .references(() => exports.rooms.id),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.roomId] }),
    };
});
exports.rooms = (0, pg_core_1.pgTable)("rooms", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), name: (0, pg_core_1.text)("name").notNull(), creatorId: (0, pg_core_1.uuid)("creator_id")
        .notNull()
        .references(() => exports.users.id) }, timestamps));
exports.invitations = (0, pg_core_1.pgTable)("invitations", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), email: (0, pg_core_1.text)("email").notNull(), roomId: (0, pg_core_1.uuid)("room_id")
        .notNull()
        .references(() => exports.rooms.id), inviterId: (0, pg_core_1.uuid)("inviter_id")
        .notNull()
        .references(() => exports.users.id), token: (0, pg_core_1.text)("token").notNull().unique() }, timestamps));
