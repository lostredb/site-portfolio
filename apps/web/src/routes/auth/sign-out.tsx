import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/sign-out")({
	component: SignOutPage,
});

function SignOutPage() {
	const navigate = useNavigate({ from: "/auth/sign-out" });

	useEffect(() => {
		authClient.signOut().then(navigate({ to: "/" }));
	}, []);

	return <Loader />;
}
