import { InvalidateCached, ServeCached } from "@lunarweb/redis";
import { protectedProcedure, publicProcedure } from "../orpc";
import { db } from "@lunarweb/database";
import { eq } from "drizzle-orm/gel-core/expressions";
import { paramsSchema } from "@lunarweb/shared/schemas";
import { components } from "@lunarweb/database/schema";
import { z } from "zod/v4";

export const componentRouter = {
	get: publicProcedure.handler(async () => {
		return await ServeCached(["components"], 2 * 60 * 60, async () => {
			return await db.query.components.findMany();
		});
	}),
	create: protectedProcedure
		.input(z.object({ image: z.string() }))
		.handler(async ({ input }) => {
			await InvalidateCached(["components"]);
			await db.insert(components).values(input);
		}),

	delete: protectedProcedure.input(paramsSchema).handler(async ({ input }) => {
		await InvalidateCached(["components"]);
		await db.delete(components).where(eq(components.id, input.key));
	}),
};
