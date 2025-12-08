import { paramsSchema, socialSchema } from "@lunarweb/shared/schemas";
import { protectedProcedure } from "../orpc";
import { db } from "@lunarweb/database";
import { socials } from "@lunarweb/database/schema";
import { eq } from "drizzle-orm";

export const socialRouter = {
	create: protectedProcedure.input(socialSchema).handler(async ({ input }) => {
		await db.insert(socials).values(input);
	}),
	delete: protectedProcedure
		.input(paramsSchema)
		.handler(async ({ input: params }) => {
			await db.delete(socials).where(eq(socials.id, params.key));
		}),
};
