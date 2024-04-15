import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
		console.log(playlist);
		return playlist;
	}

	const { isPending, error, data } = useQuery({
		queryKey: ["getPlaylist", id],
		queryFn: getPlaylist,
	});

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
							<Button type="submit">Delete</Button>
						</div>
					</div>
				</div>
			) : isPending ? (
				<p className="text-gray-400">Loading...</p>
			) : null}
		</>
	);
}
