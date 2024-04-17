import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { SongsFetcher } from "@/components/songs-fetcher";
import { CreateSongForm } from "@/components/createSong";

export const Route = createFileRoute("/_authenticated/playlist/$id")({
	component: PlaylistComponent,
});

type Playlist = {
	id: number;
	userId: string;
	name: string;
	image: string;
	createdAt: string;
};

function PlaylistComponent() {
	const id = Route.useParams().id;
	const { getToken } = useKindeAuth();
	async function getPlaylist() {
		const token = await getToken();
		if (!token) {
			throw new Error("No token found");
		}

		const res = await fetch(
			import.meta.env.VITE_APP_API_URL + "/playlists/" + id,
			{
				headers: {
					Authorization: token,
				},
			}
		);
		if (!res.ok) {
			throw new Error("Something Went Wrong!");
		}

		const playlist: Playlist = await res.json();
		return playlist;
	}

	const { isPending, error, data } = useQuery({
		queryKey: ["getPlaylist", id],
		queryFn: getPlaylist,
	});

	//handle deleteOnClick
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (id: number) => {
			const token = await getToken();
			if (!token) {
				throw new Error("No token found");
			}
			await fetch(import.meta.env.VITE_APP_API_URL + "/playlists/" + id, {
				method: "DELETE",
				headers: {
					Authorization: token,
					"Content-Type": "application/json",
				},
			});
		},
	});

	const deletePlaylist = async (id: number) => {
		await mutation.mutateAsync(id);
		queryClient.invalidateQueries({ queryKey: ["getPlaylists"] });
		navigate({ to: "/" });
	};

	const formatDate = (date: string) => {
		return date.toString().split("T")[0];
	};

	return (
		<>
			{error ? (
				<div className="text-red-400">{`An error has occurred: ${error.message}`}</div>
			) : data ? (
				<div className="flex flex-col space-y-4">
					<div className="max-w-lg mx-auto p-4 bg-gray-800 shadow-md rounded-md text-white">
						<h1 className="text-3xl font-bold mb-4">{data.playlist.name}</h1>{" "}
						<div className="relative h-64 mb-4">
							<img
								src={data.playlist.image}
								alt="Playlist Cover Art"
								className="object-cover w-full h-full rounded-md"
							/>
						</div>
						<div className="my-2 text-right flex flex-row justify-between">
							<p className="mb-4">
								Created at: {formatDate(data.playlist.createdAt)}
							</p>
							<Button
								type="submit"
								className="focus:bg-destructive/80 focus:text-white"
								onClick={() => deletePlaylist(parseInt(id))}
							>
								Delete
							</Button>
						</div>
					</div>
					<div className="mt-10">
						<CreateSongForm playlistId={parseInt(id)} />
					</div>
					<div className="mt-10">
						<SongsFetcher playlistId={parseInt(id)} playlistName={data.name} />
					</div>
				</div>
			) : isPending ? (
				<p className="text-gray-400">Loading Playlist...</p>
			) : null}
		</>
	);
}
