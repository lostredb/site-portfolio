import { SideBar } from "@/components/side-bar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { orpc, queryClient } from "@/utils/orpc";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod/v4";

export const Route = createFileRoute("/admin/coop")({
	component: RouteComponent,
	beforeLoad(ctx) {
		if (ctx.context.session?.user.role !== "admin") {
			throw redirect({ to: "/" });
		}
	},
});

function RouteComponent() {
	const { orpc } = Route.useRouteContext();

	const { data: services } = useQuery(orpc.service.get.queryOptions());

	const createServiceMutation = useMutation(
		orpc.service.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.service.get.queryKey(),
				});
				toast.success("Услуга успешно создана");
			},
		}),
	);

	const deleteServiceMutation = useMutation(
		orpc.service.delete.mutationOptions({
			onSuccess: async () => {
				queryClient.invalidateQueries({
					queryKey: orpc.service.get.queryKey(),
				});
			},
		}),
	);

	const isPending = createServiceMutation.isPending;

	const form = useForm({
		defaultValues: {
			title: "",
			engTitle: "",
			description: "",
			engDescription: "",
			price: "",
			engPrice: "",
			deadline: "",
			engDeadline: "",
		},
		onSubmit: async ({ value }) => {
			await createServiceMutation.mutateAsync(value);
			form.reset();
		},
		validators: {
			onSubmit: z.object({
				title: z.string().min(3, "Заголвок слишком мал"),
				engTitle: z.string().min(3, "Заголвок слишком мал"),
				description: z
					.string()
					.min(10, "Описание должно состоять минимум из 10-ти смиволов"),
				engDescription: z
					.string()
					.min(10, "Описание должно состоять минимум из 10-ти смиволов"),
				price: z.string().min(4, "Минимально 4 символа"),
				engPrice: z.string().min(4, "Минимально 4 символа"),
				deadline: z.string().min(4, "Минимально 4 символа"),
				engDeadline: z.string().min(4, "Минимально 4 символа"),
			}),
		},
	});

	const Field = form.Field;

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
					<Dialog>
						<DialogTrigger className="p-3 bg-white rounded-lg hover:opacity-80 transition-all duration-200 ease-in-out active:bg-transparent active:text-white active:outline active:outline-white">
							Создать услугу
						</DialogTrigger>
						<DialogContent className="bg-[#1C1C1C] max-h-full overflow-y-auto">
							<DialogHeader>
								<DialogTitle className="text-white">Сздание услуги</DialogTitle>
							</DialogHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									form.handleSubmit();
								}}
								className="flex flex-col gap-3"
							>
								<Field name="title">
									{(f) => (
										<div key={f.name} className="flex flex-col gap-3">
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
													"Заголовок"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Введите заголовок"
											/>
										</div>
									)}
								</Field>
								<Field name="engTitle">
									{(f) => (
										<div key={f.name} className="flex flex-col gap-3">
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
													"Заголовок (Английский)"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Введите заголовок"
											/>
										</div>
									)}
								</Field>
								<Field name="description">
									{(f) => (
										<div key={f.name} className="flex flex-col gap-3">
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
													"Описание"
												)}
											</p>
											<Input
												className="text-white"
												size="textarea"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Введите описание"
											/>
										</div>
									)}
								</Field>
								<Field name="engDescription">
									{(f) => (
										<div key={f.name} className="flex flex-col gap-3">
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
													"Описание (Английский)"
												)}
											</p>
											<Input
												className="text-white"
												size="textarea"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Введите описание"
											/>
										</div>
									)}
								</Field>
								<Field name="price">
									{(f) => (
										<div key={f.name} className="flex flex-col gap-3">
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
													"Стоимость"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Пример: (От 25 000 ₽)"
											/>
										</div>
									)}
								</Field>
								<Field name="engPrice">
									{(f) => (
										<div key={f.name} className="flex flex-col gap-3">
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
													"Стоимость (Английский)"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Пример: (from 325 $)"
											/>
										</div>
									)}
								</Field>
								<Field name="deadline">
									{(f) => (
										<div key={f.name} className="flex flex-col gap-3">
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
													"Сроки"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Пример: (От 12 рабочих дней)"
											/>
										</div>
									)}
								</Field>
								<Field name="engDeadline">
									{(f) => (
										<div key={f.name} className="flex flex-col gap-3">
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
													"Сроки (Английский)"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Пример: (from 12 work days)"
											/>
										</div>
									)}
								</Field>
								<Button
									disabled={isPending}
									type="submit"
									className="to-white from-white text-black hover:text-white hover:bg-white/50 cursor-pointer"
								>
									Создать
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<div className="grid md:grid-cols-4 grid-cols-1 gap-6">
					{services?.map((s) => (
						<div
							key={s.id}
							className="flex flex-col justify-between gap-16 p-4 rounded-2xl bg-[#1C1C1C] z-20 text-white"
						>
							<div className="flex flex-col gap-2">
								<p className="text-[32px]">{s.title}</p>
								<p>{s.description}</p>
							</div>
							<div className="flex justify-between items-end">
								<div className="flex flex-col">
									<p className="text-[24px]">{s.price}</p>
									<p className="text-[#FAFAFA]/40">{s.deadline}</p>
								</div>
								<div className="flex gap-4">
									<Dialog>
										<DialogTrigger>
											<Edit2Icon className="size-5 cursor-pointer" />
										</DialogTrigger>
										<DialogContent className="bg-[#1C1C1C] max-h-full overflow-y-auto">
											<DialogHeader>
												<DialogTitle className="text-white">
													Изменение услуги
												</DialogTitle>
											</DialogHeader>
											<EditService service={s} />
										</DialogContent>
									</Dialog>
									<button
										type="button"
										onClick={() => deleteServiceMutation.mutate({ key: s.id })}
									>
										<Trash2Icon className="size-5 cursor-pointer" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

type Service = {
	id: string;
	title: string;
	createdAt: Date;
	serial: number;
	deletedAt: Date | null;
	description: string;
	engTitle: string;
	engDescription: string;
	price: string;
	engPrice: string;
	deadline: string;
	engDeadline: string;
};

function EditService({ service }: { service: Service }) {
	const editServiceMutation = useMutation(
		orpc.service.edit.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.service.get.queryKey(),
				});
				toast.success("Данные успешно обновлены");
			},
		}),
	);

	const isPending = editServiceMutation.isPending;

	const form = useForm({
		defaultValues: {
			title: service.title,
			engTitle: service.engTitle,
			description: service.description,
			engDescription: service.engDescription,
			price: service.price,
			engPrice: service.engPrice,
			deadline: service.deadline,
			engDeadline: service.engDeadline,
		},
		onSubmit: async ({ value }) => {
			await editServiceMutation.mutateAsync({ ...value, id: service.id });
			form.reset();
		},
		validators: {
			onSubmit: z.object({
				title: z.string().min(3, "Заголвок слишком мал"),
				engTitle: z.string().min(3, "Заголвок слишком мал"),
				description: z
					.string()
					.min(10, "Описание должно состоять минимум из 10-ти смиволов"),
				engDescription: z
					.string()
					.min(10, "Описание должно состоять минимум из 10-ти смиволов"),
				price: z.string().min(4, "Минимально 4 символа"),
				engPrice: z.string().min(4, "Минимально 4 символа"),
				deadline: z.string().min(4, "Минимально 4 символа"),
				engDeadline: z.string().min(4, "Минимально 4 символа"),
			}),
		},
	});

	const Field = form.Field;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="flex flex-col gap-3"
		>
			<Field name="title">
				{(f) => (
					<div key={f.name} className="flex flex-col gap-3">
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
								"Заголовок"
							)}
						</p>
						<Input
							className="text-white"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							onBlur={f.handleBlur}
							placeholder="Введите заголовок"
						/>
					</div>
				)}
			</Field>
			<Field name="engTitle">
				{(f) => (
					<div key={f.name} className="flex flex-col gap-3">
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
								"Заголовок (Английский)"
							)}
						</p>
						<Input
							className="text-white"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							onBlur={f.handleBlur}
							placeholder="Введите заголовок"
						/>
					</div>
				)}
			</Field>
			<Field name="description">
				{(f) => (
					<div key={f.name} className="flex flex-col gap-3">
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
								"Описание"
							)}
						</p>
						<Input
							className="text-white"
							size="textarea"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							onBlur={f.handleBlur}
							placeholder="Введите описание"
						/>
					</div>
				)}
			</Field>
			<Field name="engDescription">
				{(f) => (
					<div key={f.name} className="flex flex-col gap-3">
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
								"Описание (Английский)"
							)}
						</p>
						<Input
							className="text-white"
							size="textarea"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							onBlur={f.handleBlur}
							placeholder="Введите описание"
						/>
					</div>
				)}
			</Field>
			<Field name="price">
				{(f) => (
					<div key={f.name} className="flex flex-col gap-3">
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
								"Стоимость"
							)}
						</p>
						<Input
							className="text-white"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							onBlur={f.handleBlur}
							placeholder="Пример: (От 25 000 ₽)"
						/>
					</div>
				)}
			</Field>
			<Field name="engPrice">
				{(f) => (
					<div key={f.name} className="flex flex-col gap-3">
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
								"Стоимость (Английский)"
							)}
						</p>
						<Input
							className="text-white"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							onBlur={f.handleBlur}
							placeholder="Пример: (from 325 $)"
						/>
					</div>
				)}
			</Field>
			<Field name="deadline">
				{(f) => (
					<div key={f.name} className="flex flex-col gap-3">
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
								"Сроки"
							)}
						</p>
						<Input
							className="text-white"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							onBlur={f.handleBlur}
							placeholder="Пример: (От 12 рабочих дней)"
						/>
					</div>
				)}
			</Field>
			<Field name="engDeadline">
				{(f) => (
					<div key={f.name} className="flex flex-col gap-3">
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
								"Сроки (Английский)"
							)}
						</p>
						<Input
							className="text-white"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							onBlur={f.handleBlur}
							placeholder="Пример: (from 12 work days)"
						/>
					</div>
				)}
			</Field>
			<Button
				disabled={isPending}
				type="submit"
				className="to-white from-white text-black hover:text-white hover:bg-white/50 cursor-pointer"
			>
				Создать
			</Button>
		</form>
	);
}
