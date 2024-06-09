ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "unregistered_email" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_unregistered_email_unique" UNIQUE("unregistered_email");