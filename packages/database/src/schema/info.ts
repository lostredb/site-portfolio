import * as pg from "drizzle-orm/pg-core";
import { files } from "./file";
import { relations } from "drizzle-orm";
import { socials } from "./social";

export const info = pg.pgTable("info", {
	id: pg
		.varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => Bun.randomUUIDv7()),
	avatarImage: pg
		.varchar("avatar_image", { length: 255 })
		.references(() => files.id, { onDelete: "cascade" }),
	about: pg.text("about").notNull(),
	engAbout: pg.text("eng_about").notNull(),
	link: pg.text().notNull(),
});

export const infoToSocialsRelation = relations(info, ({ many, one }) => ({
	avatar: one(files, {
		fields: [info.avatarImage],
		references: [files.id],
	}),
	socials: many(socials),
}));
