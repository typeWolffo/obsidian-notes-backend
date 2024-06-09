DROP TABLE "temp_users";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "confirmed_at" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "confirmation_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_confirmation_token_unique" UNIQUE("confirmation_token");