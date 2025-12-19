import { Navigation } from "@/components/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import Image from "@/components/ui/image";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	async loader(ctx) {
		return {
			info: await ctx.context.orpc.info.get.call(),
		};
	},
});

function HomeComponent() {
	const { info: initialData } = Route.useLoaderData();

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
		<div className="relative will-change-auto overflow-hidden min-h-screen px-4 md:px-0 w-full flex flex-col justify-between items-center bg-black/50">
			<div
				className="absolute inset-0 
				before:content-[''] before:absolute before:inset-0
				before:bg-[url('/image.png')] 
				before:opacity-25 before:mix-blend-overlay before:pointer-events-none
				after:content-[''] after:absolute after:inset-0
				after:bg-[url('/bg.svg')] after:bg-center after:bg-cover
				after:opacity-5 after:pointer-events-none"
			/>
			<motion.div
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, stiffness: 100 }}
				className="md:absolute hidden md:block w-[200vh] will-change-auto -translate-x-1/2 translate-y-1/2 left-1/10 h-[100vh] opacity-30 rounded-[100%] bottom-1/2 mix-blend-soft-light bg-[radial-gradient(88.6vh_47.2vh_at_center,#FAFAFA_0%,transparent_100%)]"
			/>
			<motion.div
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, stiffness: 100 }}
				className="md:absolute hidden md:block w-[400vh] will-change-auto translate-x-1/2 -translate-y-1/2 -top-1 right-70 h-[190vh] opacity-30 rounded-[100%] bottom-1/2 mix-blend-soft-light bg-[radial-gradient(88.6vh_47.2vh_at_center,#FAFAFA_0%,transparent_100%)]"
			/>
			<div />
			<BlurFade
				direction="up"
				duration={0.6}
				variant={{
					hidden: { y: 100 },
					visible: { y: 0 },
				}}
				className="flex flex-col gap-5 w-full max-w-[630px] will-change-auto rounded-2xl bg-[#1C1C1C] p-5 z-50"
			>
				<div className="flex md:flex-row flex-col gap-4 md:gap-0 justify-between">
					<div className="flex gap-2">
						<Link to="/admin/main-admin" className="cursor-default">
							<Image
								src={initialData?.avatarImage || ""}
								alt=""
								width={256}
								height={256}
								className="size-12 rounded-[6px] overflow-hidden"
							/>
						</Link>
						<motion.div
							initial={{ x: -30, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.3, delay: 0.1 }}
							className="flex flex-col will-change-auto"
						>
							<TextAnimate
								as="p"
								animation="blurIn"
								by="word"
								className="text-white will-change-auto"
							>
								{lang === "ru" ? "Максим Анисимов" : "Maxim Anisimov"}
							</TextAnimate>
							<TextAnimate
								as="p"
								animation="blurIn"
								by="word"
								className="text-[#FAFAFA80] will-change-auto"
							>
								{lang === "ru" ? "UX/UI Дизайнер" : "UX/UI Designer"}
							</TextAnimate>
						</motion.div>
					</div>
					<motion.a
						initial={{ x: -30, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.2, stiffness: 100 }}
						target="_blank"
						href={initialData?.link || "https://t.me/rNEZHu"}
						className="w-fit will-change-auto"
					>
						<button
							type="button"
							className="
						bg-[url('/button-bg.svg')] bg-center bg-contain bg-no-repeat select-none
						pb-5 pt-3 px-4 hover:scale-95 transition-all duration-100 ease-in-out cursor-pointer
						text-[12px] text-white w-[134px] h-[48px]"
						>
							{lang === "ru" ? "Обсудить проект" : "Contact me"}
						</button>
					</motion.a>
				</div>
				{lang === "ru" ? (
					<motion.p
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{
							duration: 0.3,
							delay: 0.2,
							stiffness: 100,
						}}
						className="whitespace-pre-line text-white leading-[130%] will-change-auto"
					>
						Уже больше трёх лет создаю сайты и интерфейсы — от простых лендингов
						до сложных веб-проектов. <br />
						Работаю как в Tilda, так и с{" "}
						<a
							href={initialData?.devoloperLink}
							className={cn(
								initialData?.devoloperLink ? "text-[#FF3F0E]" : "text-white",
							)}
						>
							разработчиком
						</a>
						, когда нужно собрать что-то индивидуальное и масштабное. <br />
						<br />
						Люблю, когда дизайн не просто красивый, а решает задачи бизнеса и
						помогает пользователю чувствовать себя на своём месте. <br />
						<br />
						Загляни в моё портфолио — возможно, именно твой проект станет
						следующим.
					</motion.p>
				) : (
					<motion.p
						initial={{ y: 40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{
							duration: 0.6,
							delay: 0.2,
							stiffness: 100,
						}}
						className="whitespace-pre-line text-white leading-[130%] will-change-auto"
					>
						For over three years, I’ve been designing websites and interfaces —
						from simple landing pages to complex web projects. <br />I work in
						Tilda and also collaborate with a{" "}
						<a
							href={initialData?.devoloperLink}
							className={cn(
								initialData?.devoloperLink ? "text-[#FF3F0E]" : "text-white",
							)}
						>
							developer
						</a>{" "}
						when a project needs something more custom and scalable. <br />
						<br />I believe design should do more than look good — it should
						solve business problems and help users feel right at home. <br />
						<br />
						Take a look at my portfolio — your project might be the next one.
					</motion.p>
				)}

				<div className="flex flex-wrap gap-3">
					{initialData?.socials.map((s, index) => (
						<motion.a
							initial={{ x: 30, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: (index + 2) * 0.1,
								stiffness: 100,
							}}
							key={s.id}
							target="_blank"
							href={s?.link || ""}
							className="will-change-auto"
						>
							<Image
								src={s?.logo || ""}
								alt=""
								className="size-9 rounded-sm overflow-hidden"
							/>
						</motion.a>
					))}
				</div>
			</BlurFade>
			<div />
			<Navigation active="main" />
		</div>
	);
}
