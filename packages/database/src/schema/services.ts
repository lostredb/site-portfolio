import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";

export const services = pg.pgTable("services", {
	...commonFields,
	title: pg.text("title").notNull(),
	description: pg.text("description").notNull(),
	price: pg.text("price").default("от 25 000 ₽").notNull(),
	deadline: pg.text("deadline").default("от 12 дней").notNull(),
});
