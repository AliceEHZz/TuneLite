import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

type Playlist = {
	id: number;
	name: string;
	coverArt: string;
	createdAt: string;
};

const fetchPlaylists = async () => {
	const res = await fetch(import.meta.env.VITE_APP_API_URL + "/playlists");
	const json: Playlist[] = await res.json();
	return json.playlists;
};

const PlaylistComponent = ({ playlists }: { playlists: Playlist[] }) => {
	if (!Array.isArray(playlists) || playlists.length === 0) {
		return <p>No playlists found.</p>;
	}

	return (
		<>
			{playlists.map((playlist: Playlist) => (
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
};

export function PlaylistsFetcher() {
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			const fetchedPlaylists = await fetchPlaylists();
			setPlaylists(fetchedPlaylists);
		};
		fetchData();
	}, []);

	return <PlaylistComponent playlists={playlists} />;
}
