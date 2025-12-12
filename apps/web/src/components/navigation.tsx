import { cn } from "@/lib/utils";
import { queryClient } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	ComponentIcon,
	FileTextIcon,
	FolderOpenIcon,
	HomeIcon,
	LanguagesIcon,
	SunIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

const navButns = [
	{
		id: "main",
		icon: HomeIcon,
		label: "Главная",
		eng: "Main",
		link: "/",
	},
	{
		id: "projects",
		icon: FolderOpenIcon,
		label: "Проекты",
		eng: "Projects",
		link: "/projects",
	},
	{
		id: "coop",
		icon: FileTextIcon,
		label: "Сотрудничество",
		eng: "Cooperation",
		link: "/cooperation",
	},
	{
		id: "components",
		icon: ComponentIcon,
		label: "Компоненты",
		eng: "Components",
		link: "/components",
	},
];

export function Navigation({ active }: { active: string }) {
	const [lang, setLang] = useState<"ru" | "en">("ru");

	const { data: language, isLoading } = useQuery({
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
		if (language && !isLoading) {
			setLang(language);
		}
	}, [isLoading, language]);

	const changeLanguage = async () => {
		const language = lang === "ru" ? "en" : "ru";

		const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/lang`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				language,
			}),
			credentials: "include",
		});

		if (!res.ok) {
			toast.error("Set lang error");
		} else {
			queryClient.invalidateQueries({
				queryKey: ["language"],
			});
		}
	};

	return (
		<div className="flex p-1.5 items-center bg-radial from-[#1c1c1c]/95 to-[#111111]/80 via-[#1c1c1c]/95 rounded-[12px] fixed bottom-12 border border-white/10 shadow-lg translate-x-1/2 right-1/2 z-50">
			<div className="flex gap-1.5 items-center pr-1.5 border-r border-white/10">
				{navButns.map((b) => (
					<div key={b.id}>
						<Link
							to={b.link}
							className={cn(
								"p-[8px] flex text-white gap-1.5 leading-5 items-center rounded-[6px] transition-colors duration-150 ease-in-out",
								b.id === active ? "bg-white/10" : "hover:bg-white/5",
							)}
						>
							<b.icon className="size-4.5" />
							{b.id === active ? (
								<motion.p
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.4, stiffness: 100 }}
								>
									{lang === "ru" ? b.label : b.eng}
								</motion.p>
							) : (
								""
							)}
						</Link>
					</div>
				))}
			</div>
			<div className="flex gap-1.5 items-center pl-1.5">
				<button
					type="button"
					className={cn(
						"text-white p-1.5 transition-colors duration-150 ease-in-out rounded-[6px] cursor-pointer",
						lang === "ru" ? "hover:bg-white/5" : "bg-white/10",
					)}
					onClick={changeLanguage}
				>
					<LanguagesIcon className="size-4.5" />
				</button>
			</div>
		</div>
	);
}
