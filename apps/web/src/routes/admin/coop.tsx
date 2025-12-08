import { SideBar } from "@/components/side-bar";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/coop")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex">
			<SideBar active="coop" />
			<div className="flex flex-col gap-8 py-12 container">
				<div className="flex justify-between items-center">
					<Link to="/cooperation">
						<h1 className="text-[28px] text-white font-semibold">
							Сотрудничество
						</h1>
					</Link>
				</div>
			</div>
		</div>
	);
}
