import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
	ComponentIcon,
	FileTextIcon,
	FolderOpenIcon,
	HomeIcon,
	LanguagesIcon,
	SunIcon,
} from "lucide-react";

const navButns = [
	{
		id: "main",
		icon: HomeIcon,
		label: "Главная",
		link: "/",
	},
	{
		id: "projects",
		icon: FolderOpenIcon,
		label: "Проекты",
		link: "/projects",
	},
	{
		id: "coop",
		icon: FileTextIcon,
		label: "Сотрудничество",
		link: "/cooperation",
	},
	{
		id: "components",
		icon: ComponentIcon,
		label: "Компоненты",
		link: "/components",
	},
];

export function Navigation({ active }: { active: string }) {
	return (
		<div className="flex p-1.5 items-center bg-[#1C1C1C] rounded-[12px] fixed bottom-12 border border-white/10 shadow-lg translate-x-1/2 right-1/2 z-50">
			<div className="flex gap-1.5 items-center pr-1.5 border-r border-white/10">
				{navButns.map((b) => (
					<div key={b.id}>
						<Link
							to={b.link}
							className={cn(
								"p-1.5 flex text-white gap-1 items-center rounded-[6px] transition-colors duration-150 ease-in-out",
								b.id === active ? "bg-white/10" : "hover:bg-white/5",
							)}
						>
							<b.icon className="size-4.5" />
							{b.id === active ? <p>{b.label}</p> : ""}
						</Link>
					</div>
				))}
			</div>
			<div className="flex gap-1.5 items-center pl-1.5">
				<button
					type="button"
					className="text-white p-1.5 hover:bg-white/10 transition-colors duration-150 ease-in-out rounded-[6px]"
				>
					<LanguagesIcon className="size-4.5" />
				</button>
			</div>
		</div>
	);
}
