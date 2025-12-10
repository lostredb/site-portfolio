import { InvalidateCached, ServeCached } from "@lunarweb/redis";
import { protectedProcedure, publicProcedure } from "../orpc";
import { db } from "@lunarweb/database";
import { paramsSchema, serviceSchema } from "@lunarweb/shared/schemas";
import { services } from "@lunarweb/database/schema";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";

export const serviceRouter = {
	get: publicProcedure.handler(async () => {
		return await ServeCached(["services"], 2 * 60 * 60, async () => {
			const services = await db.query.services.findMany();

			if (!services) {
				return null;
			}

			return services;
		});
	}),
	create: protectedProcedure.input(serviceSchema).handler(async ({ input }) => {
		await InvalidateCached(["services"]);
		await db.insert(services).values(input);
	}),
	delete: protectedProcedure.input(paramsSchema).handler(async ({ input }) => {
		await InvalidateCached(["services"]);
		await db.delete(services).where(eq(services.id, input.key));
	}),
	edit: protectedProcedure
		.input(
			serviceSchema.partial().extend({
				id: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			await InvalidateCached(["services"]);
			await db.update(services).set(input).where(eq(services.id, input.id));
		}),
};
