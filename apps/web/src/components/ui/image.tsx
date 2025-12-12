/** biome-ignore-all lint/a11y/useAltText: <explanation> */
import { ImageOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Loader from "../loader";

const className =
	"aspect-square flex items-center justify-center text-muted-foreground rounded-md" as const;

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	imageClassName?: string;
}

export default function Image({
	src,
	imageClassName,
	className,
	...props
}: ImageProps) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);
	// Ссылка на DOM-элемент img для проверки кэша
	const imgRef = useRef<HTMLImageElement>(null);

	// Ключевой эффект: сброс состояния при изменении src
	useEffect(() => {
		setIsLoading(true);
		setError(false);

		// Проверка, не загружено ли изображение уже (например, из кэша)
		if (imgRef.current?.complete) {
			setIsLoading(false);
		}
	}, [src]); // Зависимость от src

	// Основной обработчик успешной загрузки
	const handleLoad = () => {
		setIsLoading(false);
	};

	// Основной обработчик ошибки
	const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		console.error("Image failed to load:", e.type, src);
		setError(true);
		setIsLoading(false);
	};

	return (
		<div className={cn("relative", className)}>
			{isLoading && !error && (
				<div className="absolute inset-0 flex items-center justify-center bg-[url('/imageload.svg')] bg-no-repeat bg-center bg-cover border border-[#333333] rounded-2xl">
					<Loader className="animate-spin" />
				</div>
			)}

			{error && (
				<div className="absolute inset-0 flex items-center justify-center bg-muted rounded-2xl">
					<ImageOff className="size-[20%] text-muted-foreground" />
				</div>
			)}

			<img
				ref={imgRef}
				{...props}
				src={`${import.meta.env.VITE_SERVER_URL}/file/${src}`}
				className={cn(
					"size-full object-cover rounded-2xl",
					imageClassName,
					isLoading
						? "opacity-0"
						: "opacity-100 transition-opacity duration-300",
				)}
				crossOrigin="use-credentials"
				onLoad={handleLoad}
				onError={handleError}
				alt={props.alt || ""}
			/>
		</div>
	);
}
