import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

type Song = {
	songName: string;
	artist: string;
};

export function CreateSongForm({ playlistId }: { playlistId: number }) {
	const { getToken } = useKindeAuth();

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ data }: { data: Song }) => {
			const token = await getToken();
			if (!token) {
				throw new Error("No token found");
			}

			const res = await fetch(
				import.meta.env.VITE_APP_API_URL +
					"/playlists/" +
					playlistId +
					"/songs",
				{
					method: "POST",
					body: JSON.stringify({ song: data }),
					headers: {
						Authorization: token,
						"Content-Type": "application/json",
					},
				}
			);

			if (!res.ok) {
				throw new Error("An error occurred while adding the song");
			}
			const json = await res.json();
			return json.song;
		},
	});

	const form = useForm({
		defaultValues: {
			songName: "",
			artist: "",
		},
		onSubmit: async ({ value }) => {
			const data = {
				songName: value.songName,
				artist: value.artist,
			};
			await mutation.mutateAsync({ data });
			queryClient.invalidateQueries({ queryKey: ["getSongsForPlaylist"] });
		},
		validatorAdapter: zodValidator,
	});

	return (
		<>
			<div className="mx-auto max-w-[468px] px-2">
				<h1 className="mb-4 text-2xl font-bold">Add Song.</h1>
				<div className="flex flex-row justify-between">
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
						<div>
							<form.Field
								name="songName"
								children={(field) => (
									<>
										<Label htmlFor={field.name}>Song Name</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											placeholder="Enter song's name"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{field.state.meta.touchedErrors ? (
											<em>{field.state.meta.touchedErrors}</em>
										) : null}
									</>
								)}
							/>
						</div>
						<div>
							<form.Field
								name="artist"
								children={(field) => (
									<>
										<Label htmlFor={field.name}>Artist</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											placeholder="Enter artist"
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{field.state.meta.touchedErrors ? (
											<em>{field.state.meta.touchedErrors}</em>
										) : null}
									</>
								)}
							/>
						</div>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									className="mt-4"
									disabled={!canSubmit || isSubmitting}
								>
									{isSubmitting ? "Submitting" : "Add New Song"}
								</Button>
							)}
						></form.Subscribe>
					</form>
				</div>
			</div>
		</>
	);
}
