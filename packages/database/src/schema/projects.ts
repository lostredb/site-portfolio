import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { files } from "./file";
import { relations } from "drizzle-orm";

export const projects = pg.pgTable("projects", {
	...commonFields,
	preview: pg
		.varchar("preview", { length: 255 })
		.notNull()
		.references(() => files.id, { onDelete: "cascade" }),
	url: pg.text("url").notNull(),
	title: pg.text("title").notNull(),
	description: pg.text("description").notNull(),
	engDescription: pg.text("eng_description").notNull(),
	characteristics: pg.text("characteristics").array(),
	engCharacteristics: pg.text("eng_characteristics").array(),
});

export const projectToFileAndProjectImagesRelation = relations(
	projects,
	({ one, many }) => ({
		preview: one(files, {
			fields: [projects.preview],
			references: [files.id],
		}),
		images: many(projectImages),
	}),
);

export const projectImages = pg.pgTable("project_images", {
	id: pg
		.varchar("id", { length: 255 })
		.notNull()
		.$defaultFn(() => Bun.randomUUIDv7()),
	projectId: pg
		.varchar("project_id", { length: 255 })
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	imageId: pg
		.varchar("image_id", { length: 255 })
		.notNull()
		.references(() => files.id, { onDelete: "cascade" }),
});

export const projectImagesToProjectAndFilesRelation = relations(
	projectImages,
	({ one }) => ({
		project: one(projects, {
			fields: [projectImages.projectId],
			references: [projects.id],
		}),
		file: one(files, {
			fields: [projectImages.imageId],
			references: [files.id],
		}),
	}),
);
