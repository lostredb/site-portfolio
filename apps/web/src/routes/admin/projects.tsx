import { SideBar } from "@/components/side-bar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Image from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/utils/orpc";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod/v4";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileInput } from "@/components/ui/image-input";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { CheckBoxLabel } from "@/components/checkBoxLabel";

export const Route = createFileRoute("/admin/projects")({
	component: RouteComponent,
	beforeLoad(ctx) {
		if (ctx.context.session?.user.role !== "admin") {
			throw redirect({ to: "/" });
		}
	},
});

function RouteComponent() {
	const { orpc } = Route.useRouteContext();
	const [fileIds, setFileIds] = useState<string[]>([]);
	const [previewId, setPreviewId] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [characteristics, setCharacteristics] = useState<string[]>([]);
	const [engCharacteristics, setEngCharacteristics] = useState<string[]>([]);

	const { data: initialData } = useQuery(orpc.project.get.queryOptions());
	const { data: characts } = useQuery(orpc.charact.get.queryOptions());

	useEffect(() => {
		if (previewId.length > 1) {
			setPreviewId([previewId[previewId.length - 1]]);
		}
	}, [previewId]);

	const createProjectMutation = useMutation(
		orpc.project.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.project.get.queryKey(),
				});
				form.reset();
				setFileIds([]);
				setPreviewId([]);
				setCharacteristics([]);
				toast.success("Проект успешно создан");
			},
		}),
	);

	const deleteProjectMutation = useMutation(
		orpc.project.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.project.get.queryKey(),
				});
			},
		}),
	);

	const deleteCharactMutation = useMutation(
		orpc.charact.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.charact.get.queryKey(),
				});
				toast.success("Характеристика удалена");
			},
		}),
	);

	const isPending = createProjectMutation.isPending;

	const form = useForm({
		defaultValues: {
			url: "",
			title: "",
			description: "",
			engDescription: "",
		},
		onSubmit: async ({ value }) => {
			if (previewId.length < 1) {
				return toast.error("Необходимо загрузить превью");
			}
			await createProjectMutation.mutateAsync({
				...value,
				preview: previewId[0],
				imageIds: fileIds,
				characteristics: characteristics,
				engCharacteristics: engCharacteristics,
			});
		},
		validators: {
			onSubmit: z.object({
				url: z.url("Неккоректная ссылка"),
				title: z
					.string()
					.min(3, "Минимальный заголвоок должен состоять из 3-х символов"),
				description: z
					.string()
					.min(
						10,
						"Минимальное колличество символов в описании должно быть равно 10",
					),
				engDescription: z
					.string()
					.min(
						10,
						"Минимальное колличество символов в описании должно быть равно 10",
					),
			}),
		},
	});

	const addOrRemoveCharact = (char: { rus: string; eng: string }) => {
		setCharacteristics((prev) =>
			prev.includes(char.rus)
				? prev.filter((c) => c !== char.rus)
				: [...prev, char.rus],
		);
		setEngCharacteristics((prev) =>
			prev.includes(char.eng)
				? prev.filter((c) => c !== char.eng)
				: [...prev, char.eng],
		);
	};

	const Field = form.Field;

	return (
		<div className="flex">
			<SideBar active="projects" />
			<div className="flex flex-col gap-8 py-12 container">
				<div className="flex justify-between items-center">
					<Link to="/projects">
						<h1 className="text-[28px] text-white font-semibold">Проекты</h1>
					</Link>
					<Dialog>
						<DialogTrigger className="p-3 bg-white rounded-lg hover:opacity-80 transition-all duration-200 ease-in-out active:bg-transparent active:text-white active:outline active:outline-white">
							Создать проект
						</DialogTrigger>
						<DialogContent className="bg-[#1C1C1C] max-h-full overflow-y-auto">
							<DialogHeader>
								<DialogTitle className="text-white">
									Создание проекта
								</DialogTitle>
							</DialogHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									form.handleSubmit();
								}}
								className="flex flex-col gap-3"
							>
								<Field name="url">
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
													"Ссылка на проект"
												)}
											</p>
											<Input
												className="text-white"
												value={f.state.value}
												onChange={(e) => f.handleChange(e.target.value)}
												onBlur={f.handleBlur}
												placeholder="Введите ссылку"
											/>
										</div>
									)}
								</Field>
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
								<div className="flex gap-3 items-start">
									<div className="lex flex-col gap-3 w-full">
										<p className="text-white">Превью</p>
										<FileInput
											className="max-w-50"
											fileIds={previewId}
											setFileIds={setPreviewId}
											setIsLoading={setLoading}
										/>
									</div>
									<div className="lex flex-col gap-3 w-full">
										<p className="text-white">Фото проекта</p>
										<FileInput
											fileIds={fileIds}
											setFileIds={setFileIds}
											setIsLoading={setLoading}
											multiple
										/>
									</div>
								</div>
								<div className="flex flex-col gap-3">
									<p className="text-white">Характеристики</p>
									<div className="grid grid-cols-2 gap-3">
										{characts?.map((c) => (
											<CheckBoxLabel
												key={c.rus}
												checked={characteristics.includes(c.rus)}
												title={c.rus}
												onClick={() => addOrRemoveCharact(c)}
											/>
										))}
									</div>
								</div>
								<Button
									disabled={isPending && loading}
									type="submit"
									className="to-white from-white text-black hover:text-white hover:bg-white/50 cursor-pointer"
								>
									Создать
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				<div className="flex flex-col gap-3">
					<CreateCharact />
					<div className="flex flex-col gap-2">
						{characts?.map((c) => (
							<div
								key={c.id}
								className="p-3 flex justify-between bg-[#1c1c1c] text-white rounded-lg border border-white/10 items-center"
							>
								<div className="flex flex-col gap-1">
									<p>Русский: {c.rus}</p>
									<p>Английский: {c.eng}</p>
								</div>
								<button
									type="button"
									className="rounded-sm p-3 group cursor-pointer transition-colors duration-150 ease-in-out bg-white/10 hover:bg-red-700"
									onClick={() => deleteCharactMutation.mutate({ key: c.id })}
								>
									<Trash2Icon className="size-5 text-red-700 group-hover:text-white transition-colors duration-150 ease-in-out" />
								</button>
							</div>
						))}
					</div>
				</div>
				<table>
					<thead>
						<tr className="text-white/50">
							<td className="hidden md:block p-3 bg-[#1C1C1C] rounded-tl-lg">
								Превью
							</td>
							<td className="p-3 bg-[#1C1C1C]">Заголовок</td>
							<td className="p-3 bg-[#1C1C1C]">Описание</td>
							<td className="p-3 bg-[#1c1c1c] rounded-tr-lg">Действия</td>
						</tr>
					</thead>
					<tbody>
						{initialData?.map((p) => (
							<tr key={p.id} className="text-white border-b border-[#1C1C1C]">
								<td className="hidden md:block p-4 border-l border-r border-[#1C1C1C]">
									<Image
										src={p?.preview?.id || ""}
										alt=""
										className="max-w-64 aspect-video"
									/>
								</td>
								<td className="p-4 border-r border-[#1C1C1C]">
									<div className="flex flex-col gap-3">
										<p>{p.title}</p>
									</div>
								</td>
								<td className="p-4 border-r border-[#1C1C1C]">
									<div className="flex flex-col gap-3">
										<p>{p.description}</p>
										<p>{p.engDescription}</p>
									</div>
								</td>
								<td className="p-4 border-r border-[#1C1C1C]">
									<div className="flex gap-3 justify-center">
										<Dialog>
											<DialogTrigger asChild>
												<button type="button" className="flex items-end">
													<Edit2Icon className="size-5 hover:text-purple-500 transition-all duration-150 ease-in-out cursor-pointer" />
												</button>
											</DialogTrigger>
											<DialogContent className="bg-[#1C1C1C] max-h-full overflow-y-auto text-white">
												<DialogHeader>
													<DialogTitle className="text-md">
														Изменение проекта: {p.title}
													</DialogTitle>
												</DialogHeader>
												<EditProject project={p} />
											</DialogContent>
										</Dialog>

										<button
											type="button"
											onClick={() =>
												deleteProjectMutation.mutate({ key: p.id })
											}
										>
											<Trash2Icon className="size-5 hover:text-red-600 transition-all duration-150 ease-in-out cursor-pointer" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

type Project = {
	id: string;
	title: string;
	createdAt: Date;
	serial: number;
	deletedAt: Date | null;
	description: string;
	url: string;
	preview: string & {
		id: string;
		createdAt: Date;
		serial: number;
		fileName: string;
		fileSize: number;
		contentType: string;
		deletedAt: Date | null;
	};
	engDescription: string;
	characteristics: string[] | null;
	engCharacteristics: string[] | null;
	images: {
		id: string;
		projectId: string;
		imageId: string;
	}[];
};

function EditProject({ project }: { project: Project }) {
	const { orpc } = Route.useRouteContext();
	const { data: characts } = useQuery(orpc.charact.get.queryOptions());
	const [fileIds, setFileIds] = useState<string[]>(
		project.images.map((i) => i.imageId),
	);
	const [previewId, setPreviewId] = useState<string[]>([project.preview.id]);
	const [loading, setLoading] = useState<boolean>(false);
	const [characteristics, setCharacteristics] = useState<string[]>(
		project?.characteristics
			? project.characteristics.filter((c) =>
					characts?.some((ch) => ch.rus === c),
				)
			: [],
	);
	const [engCharacteristics, setEngCharacteristics] = useState<string[]>(
		project?.engCharacteristics
			? project.engCharacteristics.filter((ec) =>
					characts?.some((c) => c.eng === ec),
				)
			: [],
	);

	const editProjectMutation = useMutation(
		orpc.project.edit.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.project.get.queryKey(),
				});
				toast.success("Проект успешно обновлен");
			},
		}),
	);

	useEffect(() => {
		if (previewId.length > 1) {
			setPreviewId([previewId[previewId.length - 1]]);
		}
	}, [previewId]);

	const isPending = editProjectMutation.isPending;

	const form = useForm({
		defaultValues: {
			url: project.url,
			title: project.title,
			description: project.description,
			engDescription: project.engDescription,
		},
		onSubmit: async ({ value }) => {
			if (previewId.length < 1) {
				return toast.error("Необходимо загрузить превью");
			}
			await editProjectMutation.mutateAsync({
				...value,
				preview: previewId[0],
				imageIds: fileIds,
				characteristics: characteristics,
				engCharacteristics: engCharacteristics,
				id: project.id,
			});
		},
		validators: {
			onSubmit: z.object({
				url: z.url("Неккоректная ссылка"),
				title: z
					.string()
					.min(3, "Минимальный заголвоок должен состоять из 3-х символов"),
				description: z
					.string()
					.min(
						10,
						"Минимальное колличество символов в описании должно быть равно 10",
					),
				engDescription: z
					.string()
					.min(
						10,
						"Минимальное колличество символов в описании должно быть равно 10",
					),
			}),
		},
	});

	const Field = form.Field;

	const addOrRemoveCharact = (char: { rus: string; eng: string }) => {
		setCharacteristics((prev) =>
			prev.includes(char.rus)
				? prev.filter((c) => c !== char.rus)
				: [...prev, char.rus],
		);
		setEngCharacteristics((prev) =>
			prev.includes(char.eng)
				? prev.filter((c) => c !== char.eng)
				: [...prev, char.eng],
		);
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="flex flex-col gap-3"
		>
			<Field name="url">
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
								"Ссылка на проект"
							)}
						</p>
						<Input
							className="text-white"
							value={f.state.value}
							onChange={(e) => f.handleChange(e.target.value)}
							onBlur={f.handleBlur}
							placeholder="Введите ссылку"
						/>
					</div>
				)}
			</Field>
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
			<div className="flex gap-3 items-start">
				<div className="lex flex-col gap-3 w-full">
					<p className="text-white">Превью</p>
					<FileInput
						className="max-w-50"
						fileIds={previewId}
						setFileIds={setPreviewId}
						setIsLoading={setLoading}
					/>
				</div>
				<div className="lex flex-col gap-3 w-full">
					<p className="text-white">Фото проекта</p>
					<FileInput
						fileIds={fileIds}
						setFileIds={setFileIds}
						setIsLoading={setLoading}
						multiple
					/>
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<p className="text-white">Характеристики</p>
				<div className="grid grid-cols-2 gap-3">
					{characts?.map((c) => (
						<CheckBoxLabel
							key={c.rus}
							checked={characteristics.includes(c.rus)}
							title={c.rus}
							onClick={() => addOrRemoveCharact(c)}
						/>
					))}
				</div>
			</div>
			<Button
				disabled={isPending && loading}
				type="submit"
				className="to-white from-white text-black hover:text-white hover:bg-white/50 cursor-pointer"
			>
				Изменить
			</Button>
		</form>
	);
}

function CreateCharact() {
	const { orpc } = Route.useRouteContext();

	const createCharactMutation = useMutation(
		orpc.charact.add.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.charact.get.queryKey(),
				});
				form.reset();
				toast.success("Характеристика успешно создана");
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			rus: "",
			eng: "",
		},
		onSubmit: async ({ value }) => {
			await createCharactMutation.mutateAsync(value);
		},
	});

	const Field = form.Field;
	return (
		<div className="flex w-full">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="flex justify-between w-full items-center"
			>
				<div className="flex gap-3">
					<Field name="rus">
						{(f) => (
							<Input
								key={f.name}
								className="text-white"
								value={f.state.value}
								onChange={(e) => f.handleChange(e.target.value)}
								onBlur={f.handleBlur}
								placeholder="Характеристика (Русский)"
							/>
						)}
					</Field>
					<Field name="eng">
						{(f) => (
							<Input
								key={f.name}
								className="text-white"
								value={f.state.value}
								onChange={(e) => f.handleChange(e.target.value)}
								onBlur={f.handleBlur}
								placeholder="Характеристика (Английский)"
							/>
						)}
					</Field>
				</div>
				<Button
					type="submit"
					className="to-white from-white text-black hover:text-white hover:bg-white/50 cursor-pointer h-full"
				>
					Добавить
				</Button>
			</form>
		</div>
	);
}
