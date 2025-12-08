import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
	ComponentIcon,
	FileTextIcon,
	FolderOpenIcon,
	HomeIcon,
} from "lucide-react";

const navButns = [
	{
		id: "main",
		icon: HomeIcon,
		label: "Главная",
		link: "/admin/main-admin",
	},
	{
		id: "projects",
		icon: FolderOpenIcon,
		label: "Проекты",
		link: "/admin/projects",
	},
	{
		id: "coop",
		icon: FileTextIcon,
		label: "Сотрудничество",
		link: "/admin/coop",
	},
	{
		id: "components",
		icon: ComponentIcon,
		label: "Компоненты",
		link: "/admin/components",
	},
];

export function SideBar({ active }: { active: string }) {
	return (
		<div
			className="
		flex flex-col w-full gap-7 bg-black/70
		fixed top-0 left-0
		md:h-screen md:sticky md:top-0 md:max-w-50 md:p-6
		"
		>
			<div className="flex md:flex-col w-full gap-3 text-white overflow-x-auto">
				{navButns.map((n) => (
					<Link
						key={n.id}
						to={n.link}
						className={cn(
							"text-white py-1 px-2 rounded-sm w-full text-center md:text-start",
							active === n.id ? "bg-white/10" : "",
						)}
					>
						{n.label}
					</Link>
				))}
				<div className="fixed md:hidden top-0 right-0 bg-linear-to-l from-black to-black/10 w-10 h-8 z-50" />
			</div>
		</div>
	);
}
