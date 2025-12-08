import { Navigation } from "@/components/navigation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/components")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full container pt-4 md:py-12 flex flex-col gap-12 h-fit min-h-screen mb-26 md:mb-0">
			<Navigation active="components" />
			<div className="w-full flex gap-1">
				<h1 className="text-white leading-10 text-[48px]">Компоненты</h1>
			</div>
		</div>
	);
}
