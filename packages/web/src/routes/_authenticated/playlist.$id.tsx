import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/playlist/$id")({
	component: PlaylistComponent,
});

type Playlist = {
	id: number;
	userId: string;
	name: string;
	coverArt: string;
	createdAt: string;
};

function PlaylistComponent() {
	const id = Route.useParams().id;

	async function getPlaylist() {
		const res = await fetch(
			import.meta.env.VITE_APP_API_URL + "/playlists/" + id
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

	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (id: number) => {
			await fetch(import.meta.env.VITE_APP_API_URL + "/playlists/" + id, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});
		},
	});

	//handle deleteOnClick
	const deletePlaylist = async (id: number) => {
		await mutation.mutateAsync(id);
		console.log("Playlist Deleted");
		queryClient.invalidateQueries({ queryKey: ["getPlaylists"] });
		navigate({ to: "/" });
	};

	return (
		<>
			{error ? (
				<div className="text-red-400">{`An error has occurred: ${error.message}`}</div>
			) : data ? (
				<div>
					<div className="max-w-lg mx-auto p-4 bg-gray-800 shadow-md rounded-md text-white">
						<h1 className="text-2xl font-bold mb-4">{data.playlist.name}</h1>
						<div className="relative h-64 mb-4">
							<img
								src={data.playlist.coverArt}
								alt="Playlist Cover Art"
								className="object-cover w-full h-full rounded-md"
							/>
						</div>
						<p className="text-gray-400">
							Created At: {data.playlist.createdAt}
						</p>
						<div>
							<Button
								type="submit"
								className="text-destructive focus:bg-destructive/80 focus:text-white"
								onClick={() => deletePlaylist(parseInt(data.playlist.id))}
							>
								Delete
							</Button>
						</div>
					</div>
				</div>
			) : isPending ? (
				<p className="text-gray-400">Loading...</p>
			) : null}
		</>
	);
}
