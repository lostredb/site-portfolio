import { Navigation } from "@/components/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Image from "@/components/ui/image";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/components")({
	component: RouteComponent,
	async loader(ctx) {
		return {
			components: await ctx.context.orpc.components.get.call(),
		};
	},
});

function RouteComponent() {
	const { components: initialData } = Route.useLoaderData();

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
			<Navigation active="components" />
			<div className="w-fit flex gap-2 items-center relative">
				<h1 className="text-white leading-10 text-[48px]">
					{lang === "ru" ? "Компоненты" : "Components"}
				</h1>
				<div className="size-6 flex absolute top-0 -right-8 justify-center items-center rounded-full text-white ring ring-white opacity-30">
					<p className="select-none text-center leading-0">
						{initialData?.length || 0}
					</p>
				</div>
			</div>
			<div className="md:grid flex flex-col grid-cols-4 gap-2">
				{initialData?.map((c, index) => {
					const row: number = Math.floor(index / 3);
					const positionInRow: number = row === 2 ? index % 2 : index % 3;

					let columnStart: number;
					if (row === 0) {
						columnStart = positionInRow === 0 ? 1 : positionInRow === 1 ? 2 : 4;
					} else if (row === 1) {
						columnStart = positionInRow === 0 ? 1 : positionInRow === 1 ? 3 : 4;
					} else {
						columnStart = positionInRow === 0 ? 2 : 3;
					}
					return (
						<BlurFade
							style={{
								gridColumn: columnStart,
							}}
							key={c.id}
							direction="up"
							delay={index * 0.3}
						>
							<Dialog>
								<DialogTrigger>
									<Image
										src={c.image}
										alt=""
										className="w-full rounded-2xl overflow-hidden"
									/>
								</DialogTrigger>
								<DialogContent className="text-white bg-[#1c1c1c] outline-0 border-0 rounded-2xl p-4">
									<DialogHeader>
										<DialogTitle>
											{lang === "ru"
												? "Просмотр компонента"
												: "Watching component"}
										</DialogTitle>
									</DialogHeader>
									<Image
										src={c.image}
										alt=""
										className="w-full rounded-[12px] aspect-square overflow-hidden border border-[#333333]"
									/>
									<div className="flex flex-col gap-2">
										<div className="flex flex-col gap-1">
											<p className="text-sm text-white/50 leading-[1]">
												{lang === "ru" ? "Название:" : "Title:"}
											</p>
											<p className="leading-[1]">
												{lang === "ru" ? c.name : c.engName}
											</p>
										</div>
										<div className="flex flex-col gap-1">
											<p className="text-sm text-white/50 leading-[1]">
												{lang === "ru" ? "Год:" : "Year:"}
											</p>
											<p className="leading-[1]">{c.year}</p>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</BlurFade>
					);
				})}
			</div>
		</div>
	);
}
