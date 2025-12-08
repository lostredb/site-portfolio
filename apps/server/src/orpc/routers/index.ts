import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { userRouter } from "./user";
import { infoRouter } from "./info";
import { socialRouter } from "./social";
import { projectRouter } from "./project";
import { serviceRouter } from "./services";

export const appRouter = {
	user: userRouter,
	info: infoRouter,
	social: socialRouter,
	project: projectRouter,
	service: serviceRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterOutputs = InferRouterOutputs<AppRouter>;
export type AppRouterInputs = InferRouterInputs<AppRouter>;
