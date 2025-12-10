import { SideBar } from "@/components/side-bar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Image from "@/components/ui/image";
import { FileInput } from "@/components/ui/image-input";
import { queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/components")({
	component: RouteComponent,
});

function RouteComponent() {
	const { orpc } = Route.useRouteContext();

	const [fileId, setFileId] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { data: components } = useQuery(orpc.components.get.queryOptions());

	const createComponentsMutation = useMutation(
		orpc.components.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.components.get.queryKey(),
				});
				setFileId([]);
				toast.success("Компонент успешно добавлен");
			},
		}),
	);

	const deleteComponentMutation = useMutation(
		orpc.components.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.components.get.queryKey(),
				});
			},
		}),
	);

	const isPending = createComponentsMutation.isPending;

	useEffect(() => {
		if (fileId.length > 1) {
			setFileId([fileId[fileId.length - 1]]);
		}
	}, [fileId]);

	return (
		<div className="flex">
			<SideBar active="components" />
			<div className="flex flex-col gap-8 py-12 container">
				<div className="flex justify-between items-center">
					<Link to="/components">
						<h1 className="text-[28px] text-white font-semibold">Компоненты</h1>
					</Link>
					<Dialog>
						<DialogTrigger className="p-3 bg-white rounded-lg hover:opacity-80 transition-all duration-200 ease-in-out active:bg-transparent active:text-white active:outline active:outline-white">
							Добавить
						</DialogTrigger>
						<DialogContent className="bg-[#1C1C1C] max-h-full overflow-y-auto text-white">
							<DialogHeader>
								<DialogTitle>Добавление услуги</DialogTitle>
							</DialogHeader>
							<FileInput
								fileIds={fileId}
								setFileIds={setFileId}
								setIsLoading={setIsLoading}
							/>
							<Button
								disabled={isPending && isLoading}
								type="button"
								onClick={() =>
									createComponentsMutation.mutate({ image: fileId[0] })
								}
								className="to-white from-white text-black hover:text-white hover:bg-white/50 cursor-pointer"
							>
								{isPending ? "Добавляем..." : "Добавить"}
							</Button>
						</DialogContent>
					</Dialog>
				</div>
				<div className="grid grid-cols-4 gap-3">
					{components?.map((c) => (
						<div key={c.id} className="relative">
							<Image src={c.image} alt="" className="w-full" />
							<button
								type="button"
								className="rounded-sm p-3 group cursor-pointer transition-colors duration-150 ease-in-out bg-white/10 hover:bg-red-700 absolute top-4 right-4"
								onClick={() => deleteComponentMutation.mutate({ key: c.id })}
							>
								<Trash2Icon className="size-5 text-red-700 group-hover:text-white transition-colors duration-150 ease-in-out" />
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
