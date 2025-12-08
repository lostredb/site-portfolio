import { db } from "@lunarweb/database";
import { protectedProcedure, publicProcedure } from "../orpc";
import { infoSchema } from "@lunarweb/shared/schemas";
import { eq } from "drizzle-orm";
import { info } from "@lunarweb/database/schema";
import { ServeCached } from "@lunarweb/redis";

export const infoRouter = {
	get: publicProcedure.handler(async () => {
		const info = await db.query.info.findFirst({
			with: {
				socials: true,
			},
		});

		if (!info) {
			return null;
		}

		return info;
	}),
	post: protectedProcedure.input(infoSchema).handler(async ({ input }) => {
		const Info = await db.query.info.findFirst();

		if (Info) {
			await db.update(info).set(input).where(eq(info.id, Info.id));
		} else {
			await db.insert(info).values(input);
		}
	}),
};
