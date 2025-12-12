import { Navigation } from "@/components/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({
	component: RouteComponent,
	async loader({ context }) {
		return {
			projects: await context.orpc.project.get.call(),
		};
	},
});

function RouteComponent() {
	const { projects: initialData } = Route.useLoaderData();

	const { data: lang } = useQuery({
		queryKey: ["language"],
		queryFn: async () => {
			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/lang`, {
				method: "GET",
				credentials: "include",
			});
			if (!res.ok) {
				toast.error("fetch language error");
				throw new Error("Failed to fetch language");
			}
			const data = await res.json();

			return data.language;
		},
	});

	return (
		<div className="w-full container pt-4 md:py-12 flex flex-col gap-12 h-fit min-h-screen mb-26 md:mb-0">
			<Navigation active="projects" />

			<div className="w-fit flex gap-2 items-center relative">
				<h1 className="text-white leading-10 text-[48px]">
					{lang === "ru" ? "Проекты" : "Projects"}
				</h1>
				<div className="size-6 flex absolute top-0 -right-8 justify-center items-center rounded-full text-white ring ring-white opacity-30">
					<p className="select-none text-center leading-0">
						{initialData?.length || 0}
					</p>
				</div>
			</div>

			<div className="md:grid flex flex-col md:gap-12 gap-6 md:grid-cols-3">
				{initialData?.map((p, index) => (
					<a
						href={p.url}
						key={p.id}
						target="_blank"
						style={{
							gridRowStart:
								Math.floor(index / 3) * 2 + (index % 3 === 2 ? 2 : 1),
							gridRowEnd:
								index % 3 === 0
									? Math.floor(index / 3) * 2 + 3
									: Math.floor(index / 3) * 2 + 2,
						}}
						className={cn(
							"flex flex-col gap-2 group",
							Math.floor(index / 3) % 2 === 0
								? index % 3 === 0
									? "md:col-span-2"
									: "md:col-start-3"
								: index % 3 === 0
									? "md:col-span-2 md:col-start-2"
									: "md:col-start-1",
						)}
					>
						<BlurFade
							inView={true}
							direction="up"
							duration={0.6}
							delay={(index % 3) * 0.1}
							className="w-full h-full flex flex-col gap-2"
						>
							<div className="relative overflow-hidden">
								{p.preview?.id && (
									<Image
										src={p.preview.id}
										alt={p.title || ""}
										className="aspect-video rounded-[8px] overflow-hidden group-hover:scale-110 w-full transition-all duration-300 ease-in-out"
									/>
								)}

								{p.characteristics && p.characteristics.length > 0 && (
									<div className="flex flex-wrap gap-2 absolute right-4 top-4 rounded-[8px]">
										{lang === "ru"
											? p.characteristics.map((c) => (
													<div
														key={c}
														className="text-white text-[12px] px-1.5 py-1 bg-[#1C1C1C]/80 rounded-[8px] text-center backdrop-blur-sm"
													>
														<p>{c}</p>
													</div>
												))
											: p.engCharacteristics?.map((c) => (
													<div
														key={c}
														className="text-white text-[12px] px-1.5 py-1 bg-[#1C1C1C]/80 rounded-[8px] text-center backdrop-blur-sm"
													>
														<p>{c}</p>
													</div>
												))}
									</div>
								)}
							</div>

							<div className="flex flex-col gap-1">
								<motion.p
									initial={{ y: 100, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{
										duration: 0.6,
										stiffness: 100,
									}}
									className="text-white font-medium"
								>
									{p.title}
								</motion.p>

								<motion.p
									initial={{ y: 100, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{
										duration: 0.6,
										stiffness: 100,
									}}
									className={cn(
										"text-white/50 text-sm",
										index % 3 === 0 ? "max-w-105" : "",
									)}
								>
									{lang === "ru" ? p.description : p.engDescription}
								</motion.p>
							</div>
						</BlurFade>
					</a>
				))}
			</div>
		</div>
	);
}
