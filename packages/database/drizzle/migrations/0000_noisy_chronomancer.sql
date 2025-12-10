CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer NOT NULL,
	"content_type" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "info" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"avatar_image" varchar(255),
	"about" text NOT NULL,
	"eng_about" text NOT NULL,
	"link" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "socials" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"logo" varchar(255),
	"link" text,
	"info_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_images" (
	"id" varchar(255) NOT NULL,
	"project_id" varchar(255) NOT NULL,
	"image_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"preview" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"eng_title" text NOT NULL,
	"description" text NOT NULL,
	"eng_description" text NOT NULL,
	"characteristics" text[],
	"eng_characteristics" text[]
);
--> statement-breakpoint
CREATE TABLE "components" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"image" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"title" text NOT NULL,
	"eng_title" text NOT NULL,
	"description" text NOT NULL,
	"eng_description" text NOT NULL,
	"price" text DEFAULT 'от 25 000 ₽' NOT NULL,
	"eng_price" text DEFAULT 'from 325 $' NOT NULL,
	"deadline" text DEFAULT 'от 12 дней' NOT NULL,
	"eng_deadline" text DEFAULT 'from 12 days' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info" ADD CONSTRAINT "info_avatar_image_files_id_fk" FOREIGN KEY ("avatar_image") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "socials" ADD CONSTRAINT "socials_logo_files_id_fk" FOREIGN KEY ("logo") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "socials" ADD CONSTRAINT "socials_info_id_info_id_fk" FOREIGN KEY ("info_id") REFERENCES "public"."info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_image_id_files_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_preview_files_id_fk" FOREIGN KEY ("preview") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "components_image_files_id_fk" FOREIGN KEY ("image") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;