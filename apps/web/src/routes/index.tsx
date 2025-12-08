import { Navigation } from "@/components/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import Image from "@/components/ui/image";
import { TextAnimate } from "@/components/ui/text-animate";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

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

	return (
		<div
			className=" 
		bg-black/70
		bg-[url('../../bg.svg')] bg-center bg-cover
		min-h-screen h-fit w-full flex flex-col justify-between gap-4 items-center
		bg-blend-overlay p-4 md:p-0"
		>
			<div />
			<BlurFade
				direction="up"
				duration={0.6}
				variant={{
					hidden: { y: 100 },
					visible: { y: 0 },
				}}
				className="flex flex-col gap-5 w-full max-w-[630px] rounded-2xl bg-[#1C1C1C] p-5"
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
							className="flex flex-col"
						>
							<TextAnimate
								as="p"
								animation="blurIn"
								by="word"
								className="text-white"
							>
								Максим Анисимов
							</TextAnimate>
							<TextAnimate
								as="p"
								animation="blurIn"
								by="word"
								className="text-[#FAFAFA80]"
							>
								UI/UX Дизайнер
							</TextAnimate>
						</motion.div>
					</div>
					<motion.a
						initial={{ x: -30, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.2, stiffness: 100 }}
						target="_blank"
						href={initialData?.link || "https://t.me/rNEZHu"}
						className="w-fit"
					>
						<button
							type="button"
							className="
						bg-[url('../../button-bg.svg')] bg-center bg-contain bg-no-repeat select-none
						pb-5 pt-3 px-4 active:scale-95 transition-all duration-100 ease-in-out cursor-pointer
						text-[12px] text-white w-fit"
						>
							Обсудить проект
						</button>
					</motion.a>
				</div>
				<TextAnimate
					as="p"
					animation="fadeIn"
					delay={0.2}
					by="word"
					duration={0.4}
					className="whitespace-pre-line text-white leading-5"
				>
					{initialData?.about || ""}
				</TextAnimate>
				<div className="flex gap-3">
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
						>
							<Image src={s?.logo || ""} alt="" className="size-9" />
						</motion.a>
					))}
				</div>
			</BlurFade>
			<div />
			<Navigation active="main" />
		</div>
	);
}
