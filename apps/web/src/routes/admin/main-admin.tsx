import { SideBar } from "@/components/side-bar";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { FileInput } from "@/components/ui/image-input";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/utils/orpc";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod/v4";

export const Route = createFileRoute("/admin/main-admin")({
	beforeLoad(ctx) {
		if (ctx.context.session?.user.role !== "admin") {
			throw redirect({ to: "/" });
		}
	},

	async loader(ctx) {
		const info = await ctx.context.orpc.info.get.call();
		return {
			image: info?.avatarImage,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { orpc } = Route.useRouteContext();
	const { image: initialData } = Route.useLoaderData();
	const [loading, setLoading] = useState<boolean>(false);

	const { data: info } = useQuery(orpc.info.get.queryOptions());

	const [fileIds, setFileIds] = useState<string[]>([
		initialData ? initialData : "",
	]);

	const createInfoMutation = useMutation(
		orpc.info.post.mutationOptions({
			onSuccess: async () => {
				queryClient.invalidateQueries({
					queryKey: orpc.info.get.queryKey(),
				});
				return toast.success("Данные обновлены");
			},
		}),
	);

	const deleteSocialMuattion = useMutation(
		orpc.social.delete.mutationOptions({
			onSuccess: async () => {
				queryClient.invalidateQueries({
					queryKey: orpc.info.get.queryKey(),
				});
				return toast.success("Социальная сеть успешно удалена");
			},
		}),
	);

	const pending = createInfoMutation.isPending;

	useEffect(() => {
		if (fileIds.length > 1) {
			setFileIds([fileIds[fileIds.length - 1]]);
		}
	}, [fileIds.length]);

	const form = useForm({
		defaultValues: {
			link: info?.link || "",
			devoloperLink: info?.devoloperLink || "",
		},
		onSubmit: async ({ value }) => {
			let fileId: string;

			if (fileIds.length < 1) {
				fileId = "";
			} else {
				fileId = fileIds[0];
			}
			await createInfoMutation.mutateAsync({
				...value,
				avatarImage: fileId,
			});
		},
		validators: {
			onSubmit: z.object({
				link: z.url("Неккоректная ссылка"),
				devoloperLink: z.url("Неккоректная ссылка"),
			}),
		},
	});

	const Field = form.Field;

	return (
		<div className="flex">
			<SideBar active="main" />
			<div className="flex flex-col gap-6 w-full h-fit min-h-screen bg-[#111111] p-8 container">
				<div className="flex justify-between items-center">
					<Link to="/">
						<h1 className="text-[28px] text-white font-semibold">Главная</h1>
					</Link>
					<p className="text-white/50">Редактирование</p>
				</div>
				<div className="flex flex-col gap-3 w-full msx-w-20">
					<p className="text-white">Загрузка аватарки</p>
					<FileInput
						fileIds={fileIds}
						setFileIds={setFileIds}
						setIsLoading={setLoading}
					/>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="flex flex-col gap-3 w-full msx-w-20"
				>
					<Field name="link">
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
										"Ссылка для связи"
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
					<Field name="devoloperLink">
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
										"Ссылка для связи с разработчиком"
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
					<Button
						disabled={pending && loading}
						type="submit"
						className="to-white from-white text-black hover:text-white hover:bg-white/50 mt-4.5"
					>
						Отправить
					</Button>
				</form>
				{info && <Social infoId={info.id} />}
				<div>
					{info?.socials.map((s) => (
						<div
							key={s.id}
							className="flex items-center justify-between bg-[#1C1C1C] py-1 p-2 rounded"
						>
							<div className="flex gap-3 items-center ">
								<Image
									src={s?.logo || ""}
									alt=""
									className="size-8 object-cover"
								/>
								<p className="text-white">{s.link}</p>
							</div>
							<button
								type="button"
								onClick={() => deleteSocialMuattion.mutate({ key: s.id })}
							>
								<Trash2Icon className="text-red-500 size-4 cursor-pointer" />
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function Social({ infoId }: { infoId: string }) {
	const [fileIds, setFileIds] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const { orpc } = Route.useRouteContext();

	const createSocialLinkMutation = useMutation(
		orpc.social.create.mutationOptions({
			onSuccess: async () => {
				queryClient.invalidateQueries({
					queryKey: orpc.info.get.queryKey(),
				});
				return toast.success("Социальная сеть успешно добавлена");
			},
		}),
	);

	useEffect(() => {
		if (fileIds.length > 1) {
			setFileIds([fileIds[fileIds.length - 1]]);
		}
	}, [fileIds]);

	const isPending = createSocialLinkMutation.isPending;

	const form = useForm({
		defaultValues: {
			link: "",
		},
		onSubmit: async ({ value }) => {
			if (!fileIds[0]) {
				return toast.error("Необходимо загрузить изображение");
			}

			const fileId = fileIds[0];

			await createSocialLinkMutation.mutateAsync({
				...value,
				logo: fileId,
				infoId,
			});
		},
		validators: {
			onSubmit: z.object({
				link: z.url("Неккоректная ссылка"),
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
			<h1 className="text-[28px] text-white font-semibold mb-3">
				Социальные сети
			</h1>
			<Field name="link">
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
								"Ссылка на социальную сеть"
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
			<div className="flex flex-col gap-3 w-full msx-w-20">
				<p className="text-white">Загрузка лого</p>
				<FileInput
					fileIds={fileIds}
					setFileIds={setFileIds}
					setIsLoading={setLoading}
				/>
			</div>
			<Button
				disabled={isPending && loading}
				type="submit"
				className="to-white from-white text-black hover:text-white hover:bg-white/50"
			>
				Добавить
			</Button>
		</form>
	);
}
