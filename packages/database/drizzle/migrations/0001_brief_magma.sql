CREATE TABLE "info" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"avatar_image" varchar(255),
	"about" text NOT NULL
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
ALTER TABLE "info" ADD CONSTRAINT "info_avatar_image_files_id_fk" FOREIGN KEY ("avatar_image") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "socials" ADD CONSTRAINT "socials_logo_files_id_fk" FOREIGN KEY ("logo") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "socials" ADD CONSTRAINT "socials_info_id_info_id_fk" FOREIGN KEY ("info_id") REFERENCES "public"."info"("id") ON DELETE cascade ON UPDATE cascade;