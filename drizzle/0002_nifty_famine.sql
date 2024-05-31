ALTER TABLE "tempUsers" RENAME TO "temp_users";--> statement-breakpoint
ALTER TABLE "temp_users" DROP CONSTRAINT "tempUsers_email_unique";--> statement-breakpoint
ALTER TABLE "temp_users" ADD CONSTRAINT "temp_users_email_unique" UNIQUE("email");