import { db } from "@lunarweb/database";
import { protectedProcedure, publicProcedure } from "../orpc";
import { paramsSchema, projectSchema } from "@lunarweb/shared/schemas";
import { projectImages, projects } from "@lunarweb/database/schema";
import { eq } from "drizzle-orm/gel-core/expressions";
import { z } from "zod/v4";
import { InvalidateCached, ServeCached } from "@lunarweb/redis";

export const projectRouter = {
	get: publicProcedure.handler(async () => {
		const projects = await ServeCached(["projects"], 2 * 60 * 60, async () => {
			const result = await db.query.projects.findMany({
				with: {
					preview: true,
					images: true,
				},
			});

			return result.length > 0 ? result : null;
		});

		return projects;
	}),

	create: protectedProcedure
		.input(
			projectSchema.extend({
				imageIds: z.string().array().optional(),
			}),
		)
		.handler(async ({ input }) => {
			await InvalidateCached(["projects"]);
			const [project] = await db.insert(projects).values(input).returning();

			if (input.imageIds && input.imageIds.length > 0) {
				await Promise.all(
					input.imageIds.map(async (i) => {
						await db
							.insert(projectImages)
							.values({ projectId: project.id, imageId: i });
					}),
				);
			}
		}),

	delete: protectedProcedure
		.input(paramsSchema)
		.handler(async ({ input: params }) => {
			await InvalidateCached(["projects"]);
			await db.delete(projects).where(eq(projects.id, params.key));
		}),

	edit: protectedProcedure
		.input(
			projectSchema.extend({
				id: z.string(),
				imageIds: z.string().array().optional(),
			}),
		)
		.handler(async ({ input }) => {
			await InvalidateCached(["projects"]);
			await db.update(projects).set(input).where(eq(projects.id, input.id));
		}),
};
