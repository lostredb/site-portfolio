import Elysia, { status, t } from "elysia";
import { z } from "zod/v4";
import { publicProcedure } from "../orpc";

export const languageServices = new Elysia()
	.get("/lang", ({ cookie: { lang } }) => {
		return { language: lang?.value || "ru" };
	})

	.post(
		"/lang",
		({ body, cookie: { lang } }) => {
			if (body.language !== "ru" && body.language !== "en") {
				return status(404);
			}
			lang.value = body.language;
			lang.set({
				httpOnly: true,
				secure: import.meta.env.NODE_ENV === "production",
				maxAge: 365 * 24 * 60 * 60,
				path: "/",
				sameSite: "lax",
			});
		},
		{
			body: t.Object({
				language: t.String(),
			}),
		},
	);
