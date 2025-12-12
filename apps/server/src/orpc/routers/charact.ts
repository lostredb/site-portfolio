import { z } from "zod/v4";
import { protectedProcedure } from "../orpc";
import { characteristics } from "@lunarweb/database/schema";
import { db } from "@lunarweb/database";
import { paramsSchema } from "@lunarweb/shared/schemas";
import { eq } from "drizzle-orm/gel-core/expressions";

export const charactRouter = {
	get: protectedProcedure.handler(async () => {
		return await db.query.characteristics.findMany();
	}),

	add: protectedProcedure
		.input(z.object({ rus: z.string(), eng: z.string() }))
		.handler(async ({ input }) => {
			await db.insert(characteristics).values(input);
		}),

	delete: protectedProcedure.input(paramsSchema).handler(async ({ input }) => {
		await db.delete(characteristics).where(eq(characteristics.id, input.key));
	}),
};
