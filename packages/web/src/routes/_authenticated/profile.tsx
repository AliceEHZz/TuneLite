import { Button } from "@/components/ui/button";

import { createFileRoute } from "@tanstack/react-router";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const Route = createFileRoute("/_authenticated/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const { logout, user } = useKindeAuth();
	return (
		<div className="flex flex-col gap-y-6 items-center">
			<h1 className="text-4xl font-bold">Hi {user?.given_name}</h1>
			<p>{user?.email}</p>
			<div className="text-3xl font-bold">
				<p>Welcome Back! </p>
			</div>
			<div className="mt-10">
				<Button onClick={() => logout()}>Logout</Button>
			</div>
		</div>
	);
}
