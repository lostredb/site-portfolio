import { db } from "@lunarweb/database";
import * as schema from "@lunarweb/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",

		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: "user",
				input: false,
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					return {
						data: {
							...user,
							role:
								user.email === import.meta.env.MAIN_ADMIN_EMAIL
									? "admin"
									: "user",
						},
					};
				},
			},
		},
	},
});
