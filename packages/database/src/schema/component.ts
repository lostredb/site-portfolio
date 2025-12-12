import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { files } from "./file";

export const components = pg.pgTable("components", {
	...commonFields,
	image: pg
		.varchar("image", { length: 255 })
		.notNull()
		.references(() => files.id, { onDelete: "cascade" }),
	name: pg.text("name").notNull(),
	engName: pg.text("eng_name").notNull(),
	year: pg.text("year").notNull(),
});
