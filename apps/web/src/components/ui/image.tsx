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
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		setIsLoading(true);
		setError(false);

		if (imgRef.current?.complete) {
			setIsLoading(false);
		}
	}, [src]);

	const handleLoad = () => {
		setIsLoading(false);
	};

	const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		console.error("Image failed to load:", e.type, src);
		setError(true);
		setIsLoading(false);
	};

	return (
		<div className={cn("relative", className)}>
			{isLoading && !error && (
				<div className="absolute inset-0 flex items-center justify-center bg-[url('/imageload.svg')] bg-no-repeat bg-center bg-cover border border-[#333333]">
					<Loader className="animate-spin text-white/80" />
				</div>
			)}

			{error && (
				<div className="absolute inset-0 flex items-center justify-center bg-muted">
					<ImageOff className="size-[20%] text-muted-foreground" />
				</div>
			)}

			<img
				ref={imgRef}
				{...props}
				src={`${import.meta.env.VITE_SERVER_URL}/file/${src}`}
				className={cn(
					"size-full object-cover",
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
