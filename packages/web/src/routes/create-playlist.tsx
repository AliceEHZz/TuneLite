import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";

type Playlist = {
	name: string;
	coverArt: string;
};

export const Route = createFileRoute("/create-playlist")({
	component: CreatePlaylist,
});
function CreatePlaylist() {
	return (
		<div className="mx-auto max-w-[468px] px-2">
			<h1 className="mb-4 text-2xl font-bold">Create a New Playlist</h1>
			<CreatePlaylistForm />
		</div>
	);
}

function CreatePlaylistForm() {
	const navigate = useNavigate({ from: "/new-expense" });
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async ({ data }: { data: Playlist }) => {
			const res = await fetch(import.meta.env.VITE_APP_API_URL + "/playlists", {
				method: "POST",
				body: JSON.stringify({ playlist: data }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				throw new Error("An error occurred while creating the playlist");
			}
			const json = await res.json();
			return json.playlist;
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			coverArt: "",
		},
		onSubmit: async ({ value }) => {
			const data = {
				name: value.name,
				coverArt: value.coverArt,
			};
			await mutation.mutateAsync({ data });
			queryClient.invalidateQueries({ queryKey: ["getPlaylists"] });
			navigate({ to: "/" });
		},
		validatorAdapter: zodValidator,
	});

	return (
		<>
			<div className="flex flex-col space-y-4">
				{mutation.isError && (
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error!</AlertTitle>
						<AlertDescription>{mutation.error.message}</AlertDescription>
					</Alert>
				)}

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
					className="flex flex-col gap-y-4"
				>
					{" "}
					<form.Field
						name="name"
						children={(field) => (
							<>
								<Label htmlFor={field.name}>Playlist Name</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									placeholder="Enter a Playlist Name"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.touchedErrors ? (
									<em>{field.state.meta.touchedErrors}</em>
								) : null}
							</>
						)}
					/>
					<form.Field
						name="coverArt"
						children={(field) => (
							<>
								<Label htmlFor={field.name}>Playlist Cover</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									placeholder="Upload a Cover Art for your Playlist"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.touchedErrors ? (
									<em>{field.state.meta.touchedErrors}</em>
								) : null}
							</>
						)}
					/>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								className="mt-4"
								disabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? "Submitting" : "Create New Playlist"}
							</Button>
						)}
					></form.Subscribe>
				</form>
			</div>
		</>
	);
}
