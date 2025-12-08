import { cn } from "@/lib/utils";

export function CheckBoxLabel({
	title,
	onClick,
	checked,
}: {
	title: string;
	onClick: () => void;
	checked: boolean;
}) {
	return (
		<button
			type="button"
			className="text-white flex items-center gap-2"
			onClick={onClick}
		>
			<div
				className={cn(
					"size-4 flex items-center justify-center rounded text-black transition-colors duration-200 ease-in-out",
					checked ? "bg-white" : "outline outline-white",
				)}
			>
				<p
					className={cn(
						"text-[8px]",
						checked ? "text-black" : "text-transparent",
					)}
				>
					✓
				</p>
			</div>
			<p>{title}</p>
		</button>
	);
}
