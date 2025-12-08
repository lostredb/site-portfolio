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
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_image_id_files_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_preview_files_id_fk" FOREIGN KEY ("preview") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;