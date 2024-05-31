CREATE TABLE IF NOT EXISTS "tempUsers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"nickname" text NOT NULL,
	"password" text NOT NULL,
	"created_at" text DEFAULT (CURRENT_TIMESTAMP),
	"updated_at" text DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT "tempUsers_email_unique" UNIQUE("email")
);
