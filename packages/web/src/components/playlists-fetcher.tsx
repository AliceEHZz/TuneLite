import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

type Playlist = {
	id: number;
	name: string;
	coverArt: string;
	createdAt: string;
};

export function PlaylistsFetcher() {
	
	async function getPlaylists() {
		const res = await fetch(import.meta.env.VITE_APP_API_URL + "/playlists");

		if (!res.ok) {
			throw new Error("Something Went Wrong!");
		}
		return (await res.json()) as { playlists: Playlist[] };
	}

	const { isPending, error, data } = useQuery({
		queryKey: ["getPlaylists"],
		queryFn: getPlaylists,
	});

	return (
		<>
			{error
				? "An error has occurred: " + error.message
				: data?.playlists.map((playlist: Playlist) => (
						<Link
							key={playlist.id}
							to={`/playlist/${playlist.id}` as string}
							className="flex items-center gap-2=3 px-5 py-2 text-md font-bold text-muted-foreground transition-all hover:text-primary data-[status=active]:text-primary"
						>
							{playlist.name}
						</Link>
					))}
		</>
	);
}
