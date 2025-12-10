import * as pg from "drizzle-orm/pg-core";
import { commonFields } from "./utils";

export const services = pg.pgTable("services", {
	...commonFields,
	title: pg.text("title").notNull(),
	engTitle: pg.text("eng_title").notNull(),
	description: pg.text("description").notNull(),
	engDescription: pg.text("eng_description").notNull(),
	price: pg.text("price").default("от 25 000 ₽").notNull(),
	engPrice: pg.text("eng_price").default("from 325 $").notNull(),
	deadline: pg.text("deadline").default("от 12 дней").notNull(),
	engDeadline: pg.text("eng_deadline").default("from 12 days").notNull(),
});
