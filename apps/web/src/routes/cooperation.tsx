import { Navigation } from "@/components/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

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
	// const { orpc } = Route.useRouteContext();

	// const { data: initialData } = useQuery(orpc.service.get.queryOptions());

	return (
		<div className="w-full container pt-4 md:py-12 flex flex-col gap-16 h-fit min-h-screen mb-26 md:mb-0">
			<Navigation active="coop" />
			<div className="w-full flex gap-1">
				<h1 className="text-white leading-10 text-[48px]">Сотрудничество</h1>
			</div>
			<BlurFade direction="up" duration={0.6} className="relative w-full">
				<h1 className="text-white/10 text-[58px] md:text-[min(30vh,232px)] absolute top-7 md:top-0 leading-none -mt-6 translate-x-1/2 right-1/2 text-nowrap select-none">
					Этапы работы
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 md:mt-44">
					<BlurFade
						duration={0.6}
						direction="up"
						delay={0.3}
						className="flex flex-col text-white p-4 justify-between bg-[#1C1C1C] z-20 h-[318px] rounded-2xl"
					>
						<div className="flex justify-between">
							<p className="text-[36px]">Старт</p>
							<p className="text-[36px] text-[#FAFAFA1A]">01</p>
						</div>
						<p>
							Начинаю с брифа и технического <br />
							задания. <br />
							Определяю цели, сроки и стоимость, <br />
							чтобы задать чёткий вектор работы.
						</p>
					</BlurFade>
					<BlurFade
						duration={0.6}
						direction="up"
						delay={0.6}
						className="flex flex-col text-white p-4 justify-between bg-[#1C1C1C] z-20 h-[318px] rounded-2xl md:mt-32"
					>
						<div className="flex justify-between">
							<p className="text-[36px]">Аналитика</p>
							<p className="text-[36px] text-[#FAFAFA1A]">02</p>
						</div>
						<p>
							Провожу анализ конкурентов <br />
							и аудитории. <br />
							Формирую структуру проекта <br />
							и создаю прототип на основе <br />
							полученных данных.
						</p>
					</BlurFade>
					<BlurFade
						duration={0.6}
						direction="up"
						delay={0.9}
						className="flex flex-col text-white p-4 justify-between bg-[#1C1C1C] z-20 h-[318px] rounded-2xl md:mt-64"
					>
						<div className="flex justify-between">
							<p className="text-[36px]">Дизайн</p>
							<p className="text-[36px] text-[#FAFAFA1A]">03</p>
						</div>
						<p>
							Разрабатываю концепцию <br />
							и визуальный стиль. <br />
							Прорабатываю UX/UI до мелочей, <br />
							чтобы создать цельный <br />
							и выразительный продукт.
						</p>
					</BlurFade>
					<BlurFade
						duration={0.6}
						direction="up"
						delay={1.2}
						className="flex flex-col text-white p-4 justify-between bg-[#1C1C1C] z-20 h-[318px] rounded-2xl md:mt-16"
					>
						<div className="flex justify-between">
							<p className="text-[36px]">Запуск</p>
							<p className="text-[36px] text-[#FAFAFA1A]">04</p>
						</div>
						<p>
							Подключаю домен и формы, <br />
							настраиваю базовое SEO и тестирую <br />
							всё перед передачей. <br />
							После финальных проверок проект <br />
							готов к запуску.
						</p>
					</BlurFade>
				</div>
			</BlurFade>
			<BlurFade direction="up" duration={0.6} className="relative w-full">
				<h1 className="text-white/10 text-[58px] md:text-[min(25vh,170px)] absolute top-7 md:top-0 leading-none -mt-6 translate-x-1/2 right-1/2 text-nowrap select-none">
					Услуги и стоимость
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-32">
					{initialData?.map((s, index) => (
						<BlurFade
							key={s.id}
							direction="up"
							duration={0.6}
							style={{
								gridColumnStart:
									Math.floor(index / 4) % 2 === 0
										? (index % 4) + 1
										: (index % 4) + 2,
							}}
							className={cn(
								"flex flex-col justify-between gap-16 p-4 rounded-2xl bg-[#1C1C1C] z-20 text-white",
							)}
						>
							<div className="flex flex-col gap-2">
								<p className="text-[32px]">{s.title}</p>
								<p>{s.description}</p>
							</div>
							<div className="flex flex-col">
								<p className="text-[24px]">{s.price}</p>
								<p className="text-[#FAFAFA]/40">{s.deadline}</p>
							</div>
						</BlurFade>
					))}
					<BlurFade
						direction="up"
						duration={0.6}
						delay={0.3}
						className="flex flex-col justify-between gap-16 p-4 rounded-2xl bg-[#1C1C1C] z-20 text-white"
					>
						<div className="flex flex-col gap-2">
							<p className="text-[32px]">Индивидуальный запрос</p>
							<p>
								Разработаем решение под ваши задачи, сроки и бюджет. Реализуем
								проект «под ключ».
							</p>
						</div>
						<div className="flex flex-col">
							<p className="text-[24px]">Индивидуально</p>
							<p className="text-[#FAFAFA]/40">От 12 рабочих дней</p>
						</div>
					</BlurFade>
				</div>
			</BlurFade>
		</div>
	);
}
