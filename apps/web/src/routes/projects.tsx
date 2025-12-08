import { Navigation } from "@/components/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import Image from "@/components/ui/image";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/projects")({
	component: RouteComponent,
	async loader({ context }) {
		return { projects: await context.orpc.project.get.call() };
	},
});

function RouteComponent() {
	const { projects: initialData } = Route.useLoaderData();

	return (
		<div className="w-full container pt-4 md:py-12 flex flex-col gap-12 h-fit min-h-screen mb-26 md:mb-0">
			<Navigation active="projects" />
			<div className="w-full flex gap-1">
				<h1 className="text-white leading-10 text-[48px]">Проекты</h1>
				<div className="size-6 text-center rounded-full text-white ring ring-white opacity-30 h-fit">
					<p>{initialData ? initialData.length.toString() : "0"}</p>
				</div>
			</div>
			<div className="md:grid flex flex-col md:gap-12 gap-4 md:grid-cols-3">
				{initialData?.map((p, index) => (
					<BlurFade
						direction="up"
						duration={0.6}
						delay={index * 0.1}
						key={p.id}
						style={{
							gridRowStart:
								Math.floor(index / 3) * 2 + (index % 3 === 2 ? 2 : 1),
							gridRowEnd:
								index % 3 === 0
									? Math.floor(index / 3) * 2 + 3
									: Math.floor(index / 3) * 2 + 2,
						}}
						className={cn(
							"flex flex-col gap-2",
							Math.floor(index / 3) % 2 === 0
								? index % 3 === 0
									? "md:col-span-2"
									: "md:col-start-3"
								: index % 3 === 0
									? "md:col-span-2 md:col-start-2"
									: "md:col-start-1",
						)}
					>
						<div className="relative">
							<Image
								src={p.preview.id}
								alt=""
								className="aspect-video roudned-[8px] overflow-hidden"
							/>
							<div className="flex flex-wrap gap-2 absolute right-4 top-4 rounded-[8px]">
								{p.characteristics?.map((c) => (
									<div
										key={c}
										className="text-white text-[12px] px-1.5 py-1 bg-[#1C1C1C] rounded-[8px] text-center"
									>
										<p>{c}</p>
									</div>
								))}
							</div>
						</div>
						<div className="flex flex-col">
							<TextAnimate
								animation="blurIn"
								duration={0.6}
								// delay={(index + 1) * 0.1}
								className="text-white"
							>
								{p.title}
							</TextAnimate>
							<TextAnimate
								animation="blurIn"
								duration={0.6}
								// delay={(index + 2) * 0.1}
								className={cn(
									"text-white/50",
									index % 3 === 0 ? "max-w-105" : "",
								)}
							>
								{p.description}
							</TextAnimate>
						</div>
					</BlurFade>
				))}
			</div>
		</div>
	);
}
