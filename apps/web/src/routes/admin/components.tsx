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
import { Input } from "@/components/ui/input";
import { queryClient } from "@/utils/orpc";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod/v4";

export const Route = createFileRoute("/admin/components")({
	component: RouteComponent,
	beforeLoad(ctx) {
		if (ctx.context.session?.user.role !== "admin") {
			throw redirect({ to: "/" });
		}
	},
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
				form.reset();
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

	const form = useForm({
		defaultValues: {
			name: "",
			engName: "",
			year: "",
		},
		onSubmit: ({ value }) => {
			createComponentsMutation.mutate({
				...value,
				image: fileId[0],
			});
		},
		validators: {
			onSubmit: z.object({
				name: z
					.string()
					.min(3, "Минимальное возможное имя должно содержать 3 символа"),
				engName: z
					.string()
					.min(3, "Минимальное возможное имя должно содержать 3 символа"),
				year: z
					.string()
					.min(4, "Минимально 4 символа, это же не дизайн египетских пирамид"),
			}),
		},
	});

	const Field = form.Field;

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
							<form
								onSubmit={(e) => {
									e.preventDefault();
									form.handleSubmit();
								}}
								className="flex flex-col gap-3"
							>
								<FileInput
									fileIds={fileId}
									setFileIds={setFileId}
									setIsLoading={setIsLoading}
								/>
								<Field name="name">
									{(f) => (
										<div className="flex flex-col gap-2">
											<p className="text-white">
												{f.state.meta.errors[0] ? (
													<p>
														{f.state.meta.errors.map((e, index) => (
															<p
																key={index.toString() + "EL"}
																className="text-red-500 text-[12px]"
															>
																{e?.message}
															</p>
														))}
													</p>
												) : (
													"Имя"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Введите имя компонента"
											/>
										</div>
									)}
								</Field>
								<Field name="engName">
									{(f) => (
										<div className="flex flex-col gap-2">
											<p className="text-white">
												{f.state.meta.errors[0] ? (
													<p>
														{f.state.meta.errors.map((e, index) => (
															<p
																key={index.toString() + "EL"}
																className="text-red-500 text-[12px]"
															>
																{e?.message}
															</p>
														))}
													</p>
												) : (
													"Имя (Английский)"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Введите имя компонента"
											/>
										</div>
									)}
								</Field>
								<Field name="year">
									{(f) => (
										<div className="flex flex-col gap-2">
											<p className="text-white">
												{f.state.meta.errors[0] ? (
													<p>
														{f.state.meta.errors.map((e, index) => (
															<p
																key={index.toString() + "EL"}
																className="text-red-500 text-[12px]"
															>
																{e?.message}
															</p>
														))}
													</p>
												) : (
													"Год"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Введите год создания"
											/>
										</div>
									)}
								</Field>
								<Button
									disabled={isPending && isLoading}
									type="submit"
									className="to-white from-white w-full text-black hover:text-white hover:bg-white/50 cursor-pointer"
								>
									{isPending ? "Добавляем..." : "Добавить"}
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<div className="md:grid flex flex-col grid-cols-4 gap-3">
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
