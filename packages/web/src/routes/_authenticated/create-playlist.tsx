import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/create-playlist")({
	component: CreatePlaylist,
});
type Playlist = {
	name: string;
	image?: string;
};

function CreatePlaylist() {
	return (
		<div className="mx-auto max-w-[468px] px-2">
			<h1 className="mb-4 text-2xl font-bold">Create a New Playlist</h1>
			<CreatePlaylistForm />
		</div>
	);
}

function CreatePlaylistForm() {
	const { getToken } = useKindeAuth();
	const navigate = useNavigate({ from: "/create-playlist" });
	const [filePreviewURL, setFilePreviewURL] = useState<string | undefined>();

	const computeSHA256 = async (file: File) => {
		const buffer = await file.arrayBuffer();
		const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
		return hashHex;
	};

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ data, image }: { data: Playlist; image?: File }) => {
			const token = await getToken();
			if (!token) {
				throw new Error("No token found");
			}

			if (image) {
				const signedURLResponse = await fetch(
					import.meta.env.VITE_APP_API_URL + "/signed-url",
					{
						method: "POST",
						headers: {
							Authorization: token,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							contentType: image.type,
							contentLength: image.size,
							checksum: await computeSHA256(image),
						}),
					}
				);
				if (!signedURLResponse.ok) {
					throw new Error("An error occurred while creating the playlist");
				}
				const { url } = (await signedURLResponse.json()) as { url: string };

				await fetch(url, {
					method: "PUT",
					body: image,
					headers: {
						"Content-Type": image.type,
					},
				});

				const imageUrl = url.split("?")[0];
				data.image = imageUrl;
			}

			const res = await fetch(import.meta.env.VITE_APP_API_URL + "/playlists", {
				method: "POST",
				body: JSON.stringify({ playlist: data }),
				headers: {
					Authorization: token,
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
			image: undefined as undefined | File,
		},
		onSubmit: async ({ value }) => {
			const data = {
				name: value.name,
			};
			await mutation.mutateAsync({ data, image: value.image });
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
					<div>
						<form.Field
							name="image"
							children={(field) => (
								<Label>
									Cover Art
									{filePreviewURL && (
										<img className="max-w-xs m-auto" src={filePreviewURL} />
									)}
									<Input
										type="file"
										accept="image/*"
										onBlur={field.handleBlur}
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (filePreviewURL) {
												URL.revokeObjectURL(filePreviewURL);
											}
											if (file) {
												const url = URL.createObjectURL(file);
												setFilePreviewURL(url);
											} else {
												setFilePreviewURL(undefined);
											}
											field.handleChange(file);
										}}
									/>
									{field.state.meta.errors && (
										<em role="alert">{field.state.meta.errors.join(", ")}</em>
									)}
								</Label>
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
								{isSubmitting ? "Submitting" : "Create New Playlist"}
							</Button>
						)}
					></form.Subscribe>
				</form>
			</div>
		</>
	);
}
