ALTER TABLE "temp_users" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "temp_users" ADD COLUMN "confirmed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "temp_users" ADD CONSTRAINT "temp_users_token_unique" UNIQUE("token");