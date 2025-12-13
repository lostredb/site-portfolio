import { Navigation } from "@/components/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/cooperation")({
	component: RouteComponent,
	async loader(ctx) {
		return {
			services: await ctx.context.orpc.service.get.call(),
		};
	},
});

function RouteComponent() {
	const { services: initialData } = Route.useLoaderData();
	const [isXl, setIsXl] = useState<boolean>(false);

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

	useEffect(() => {
		const checkScreenSize = () => {
			setIsXl(window.innerWidth >= 1280);
		};
		console.log(isXl);

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => {
			window.removeEventListener("resize", checkScreenSize);
		};
	}, [isXl]);

	return (
		<div className="w-full container pt-4 md:py-12 flex flex-col gap-20 h-fit min-h-screen mb-26 md:mb-0">
			<Navigation active="coop" />
			<div className="w-full flex gap-1">
				<h1 className="text-white leading-10 text-[48px]">
					{lang === "ru" ? "Сотрудничество" : "Cooperation"}
				</h1>
			</div>
			<BlurFade direction="up" duration={0.6} className="relative w-full">
				<h1 className="text-white/10 text-[58px] md:text-[10vh] xl:text-[min(30vh,232px)] absolute top-7 md:top-0 leading-none -mt-6 translate-x-1/2 right-1/2 text-nowrap select-none">
					{lang === "ru" ? "Этапы работы" : "Stages of work"}
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12 md:mt-24 xl:mt-44">
					<BlurFade
						duration={0.4}
						direction="up"
						delay={0.2}
						className="flex flex-col text-white p-4 justify-between bg-[#1C1C1C] z-20 aspect-square rounded-2xl "
					>
						<div className="flex justify-between">
							<p className="text-[36px]">{lang === "ru" ? "Старт" : "Start"}</p>
							<p className="text-[36px] text-[#FAFAFA1A]">01</p>
						</div>
						<p className="whitespace-pre-line">
							{lang === "ru"
								? `Начинаю с брифа и технического
задания.
Определяю цели, сроки и стоимость,
чтобы задать чёткий вектор работы.`
								: `I start with a brief and technical specifications.
I define the goals, deadlines, and costs to set a clear direction for the work.`}
						</p>
					</BlurFade>
					<BlurFade
						duration={0.4}
						direction="up"
						delay={0.4}
						className="flex flex-col text-white p-4 justify-between bg-[#1C1C1C] z-20 aspect-square rounded-2xl xl:mt-32"
					>
						<div className="flex justify-between">
							<p className="text-[36px]">
								{lang === "ru" ? "Аналитика" : "Analytics"}
							</p>
							<p className="text-[36px] text-[#FAFAFA1A]">02</p>
						</div>
						<p className="whitespace-pre-line">
							{lang === "ru"
								? `Провожу анализ конкурентов
и аудитории.
Формирую структуру проекта
и создаю прототип на основе
полученных данных.`
								: `I conduct competitor and audience analysis.
I form the project structure and create
a prototype based on the data obtained.`}
						</p>
					</BlurFade>

					<BlurFade
						duration={0.4}
						direction="up"
						delay={0.6}
						className="flex flex-col text-white p-4 justify-between bg-[#1C1C1C] z-20 aspect-square rounded-2xl xl:mt-64"
					>
						<div className="flex justify-between">
							<p className="text-[36px]">
								{lang === "ru" ? "Дизайн" : "Design"}
							</p>
							<p className="text-[36px] text-[#FAFAFA1A]">03</p>
						</div>
						<p className="whitespace-pre-line">
							{lang === "ru"
								? `Разрабатываю концепцию
и визуальный стиль.
Прорабатываю UX/UI до мелочей,
чтобы создать цельный
и выразительный продукт.`
								: `I develop the concept and visual style.
I work out every detail of UX/UI
to create a cohesive and expressive product.`}
						</p>
					</BlurFade>

					<BlurFade
						duration={0.4}
						direction="up"
						delay={0.8}
						className="flex flex-col text-white p-4 justify-between bg-[#1C1C1C] z-20 aspect-square rounded-2xl xl:mt-16"
					>
						<div className="flex justify-between">
							<p className="text-[36px]">
								{lang === "ru" ? "Запуск" : "Launch"}
							</p>
							<p className="text-[36px] text-[#FAFAFA1A]">04</p>
						</div>
						<p className="whitespace-pre-line">
							{lang === "ru"
								? `Подключаю домен и формы,
настраиваю базовое SEO и тестирую
всё перед передачей.
После финальных проверок проект
готов к запуску.`
								: `I connect the domain and forms,
set up basic SEO, and test everything
before handover.
After final checks, the project
is ready for launch.`}
						</p>
					</BlurFade>
				</div>
			</BlurFade>
			<BlurFade
				inView={true}
				direction="up"
				duration={0.4}
				className="relative w-full"
			>
				<h1 className="text-white/10 text-[40px] sm:text-[8vh] 2xl:text-[min(25vh,170px)] absolute top-7 md:top-0 leading-none -mt-6 translate-x-1/2 right-1/2 text-nowrap select-none">
					{lang === "ru" ? "Услуги и стоимость" : "Services and prices"}
				</h1>
				<div className="md:grid flex flex-col gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6 mb-4 mt-10 md:mb-18 md:mt-18 xl:mt-32">
					{initialData?.map((s, index) => {
						return (
							<BlurFade
								key={s.id}
								direction="up"
								duration={0.4}
								delay={(index + 1) * 0.2}
								style={{
									gridColumn: isXl
										? Math.floor(index / 3) % 2 === 0
											? (index % 3) + 1
											: (index % 3) + 2
										: (index % 2) + 1,
								}}
								className={cn(
									"flex flex-col justify-between gap-16 p-4 aspect-square rounded-2xl bg-[#1C1C1C] z-20 text-white",
								)}
							>
								<div className="flex flex-col gap-2">
									<p className="text-[32px] leading-[1.3]">
										{lang === "ru" ? s.title : s.engTitle}
									</p>
									<p className="whitespace-pre-line w-[85%]">
										{lang === "ru" ? s.description : s.engDescription}
									</p>
								</div>
								<div className="flex flex-col">
									<p className="text-[24px]">
										{lang === "ru" ? s.price : s.engPrice}
									</p>
									<p className="text-[#FAFAFA]/40">
										{lang === "ru" ? s.deadline : s.engDeadline}
									</p>
								</div>
							</BlurFade>
						);
					})}
					<BlurFade
						direction="up"
						duration={0.4}
						delay={initialData?.length ? (initialData.length + 1) * 0.2 : 0.2}
						className="flex flex-col justify-between gap-16 p-4 aspect-square rounded-2xl bg-[#1C1C1C] z-20 text-white"
					>
						<div className="flex flex-col gap-2">
							<p className="text-[32px] leading-[1.3]">
								{lang === "ru" ? "Индивидуальный запрос" : "Individual request"}
							</p>
							<p>
								{lang === "ru"
									? "Разработаем решение под ваши задачи, сроки и бюджет. Реализуем проект «под ключ»."
									: "We'll develop a solution tailored to your needs, timeframe, and budget. We deliver a turnkey project."}
							</p>
						</div>
						<div className="flex flex-col">
							<p className="text-[24px]">
								{lang === "ru" ? "Индивидуально" : "Individual"}
							</p>
							<p className="text-[#FAFAFA]/40">
								{lang === "ru" ? "От 12 рабочих дней" : "from 12 work days"}
							</p>
						</div>
					</BlurFade>
				</div>
			</BlurFade>
		</div>
	);
}
