import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { files } from "./file";
import { relations } from "drizzle-orm";
import { info } from "./info";

export const socials = pg.pgTable("socials", {
	...commonFields,
	logo: pg.varchar("logo", { length: 255 }).references(() => files.id),
	link: pg.text("link"),
	infoId: pg
		.varchar("info_id", { length: 255 })
		.notNull()
		.references(() => info.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const socialToFileRealtion = relations(socials, ({ one }) => ({
	logo: one(files, {
		fields: [socials.logo],
		references: [files.id],
	}),
	info: one(info, {
		fields: [socials.infoId],
		references: [info.id],
	}),
}));
