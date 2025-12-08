import { ServeCached } from "@lunarweb/redis";
import { publicProcedure } from "../orpc";
import { db } from "@lunarweb/database";

export const componentRouter = {
	get: publicProcedure.handler(async () => {
		return await ServeCached(["components"], 2 * 60 * 60, async () => {
			return await db.query.components.findMany();
		});
	}),
};
