import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type Song = {
	id: number;
	songName: string;
	artist: string;
	playlistId: number;
	addedAt: string;
};

export function SongsFetcher({
	playlistId,
	playlistName,
}: {
	playlistId: number;
	playlistName: string;
}) {
	const { getToken } = useKindeAuth();
	// get songs for playlist
	async function getSongsForPlaylist() {
		const token = await getToken();
		if (!token) {
			throw new Error("No token found");
		}

		const res = await fetch(
			import.meta.env.VITE_APP_API_URL + "/playlists/" + playlistId + "/songs",
			{
				headers: {
					Authorization: token,
				},
			}
		);
		if (!res.ok) {
			throw new Error("Something Went Wrong With Fetching Songs!");
		}

		return (await res.json()) as { songs: Song[] };
	}

	const { isPending, error, data } = useQuery({
		queryKey: ["getSongsForPlaylist", playlistId],
		queryFn: getSongsForPlaylist,
	});

	return (
		<>
			<h1>List of Songs</h1>
			{error ? (
				"An error has occurred when fetching songs: " + error.message
			) : (
				<Table>
					<TableHeader>
						<TableRow className="font-semibold">
							<TableHead className="w-[100px]">Song</TableHead>
							<TableHead>Artist</TableHead>
							<TableHead>Added Date</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isPending ? (
							<TableRow>
								<TableCell>
									<Skeleton className="h-3 w-full"></Skeleton>
								</TableCell>
								<TableCell>
									<Skeleton className="h-3 w-full"></Skeleton>
								</TableCell>
								<TableCell>
									<Skeleton className="h-3 w-full"></Skeleton>
								</TableCell>
								<TableCell>
									<Skeleton className="h-3 w-full"></Skeleton>
								</TableCell>
							</TableRow>
						) : (
							data.songs.map((song) => (
								<TableRow key={song.id}>
									<TableCell className="text-left">{song.songName}</TableCell>
									<TableCell>{song.artist}</TableCell>
									<TableCell>{song.addedAt.split("T")[0]}</TableCell>
									<TableCell className="text-right">delete</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			)}
		</>
	);
}
