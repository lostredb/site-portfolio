import { z } from "zod/v4";

export const someSchema = z.object({
	test: z.string(),
});

export const infoSchema = z.object({
	avatarImage: z.string(),
	link: z.url(),
	devoloperLink: z.url(),
});

export const socialSchema = z.object({
	logo: z.string(),
	link: z.url(),
	infoId: z.string(),
});

export const paramsSchema = z.object({
	key: z.string(),
});

export const projectSchema = z.object({
	preview: z.string(),
	url: z.url(),
	title: z.string(),
	description: z.string(),
	engDescription: z.string(),
	characteristics: z.string().array().optional(),
	engCharacteristics: z.string().array().optional(),
});

export const serviceSchema = z.object({
	title: z.string(),
	engTitle: z.string(),
	description: z.string(),
	engDescription: z.string(),
	price: z.string(),
	engPrice: z.string(),
	deadline: z.string(),
	engDeadline: z.string(),
});
