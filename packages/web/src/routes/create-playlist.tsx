import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
// import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";

type Playlist = {
	id: number;
	name: string;
	coverArt: string;
	createdAt: string;
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
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			name: "",
			coverArt: "",
		},
		onSubmit: async ({ value }) => {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			const res = await fetch(import.meta.env.VITE_APP_API_URL + "/playlists", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(value),
			});
			const json = await res.json();
			if (!res.ok) {
				throw new Error("Server Error");
			}
			// navigate({ to: "/" });
			setPlaylists(json.playlists);
			console.log(value);
		},
	});

	return (
		<>
			<div className="flex flex-col space-y-4">
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
							<Button type="submit" className="mt-4" disabled={!canSubmit}>
								{isSubmitting ? "Submitting" : "Create New Playlist"}
							</Button>
						)}
					/>
				</form>
			</div>
			<div className="space-y-4">
				{playlists.map((playlist: Playlist) => (
					<div key={playlist.id} className="flex space-x-4">
						<img
							src={playlist.coverArt}
							alt={playlist.name}
							className="w-16 h-16 rounded-md"
						/>
						<div className="flex flex-col">
							<h3>{playlist.name}</h3>
							<p>{new Date(playlist.createdAt).toLocaleDateString()}</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
