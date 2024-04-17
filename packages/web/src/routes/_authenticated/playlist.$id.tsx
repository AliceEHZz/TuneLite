import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { SongsFetcher } from "@/components/songs-fetcher";
import { CreateSongForm } from "@/components/createSong";
import { Separator } from "@/components/ui/separator";

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

		const playlist = await res.json();
		return playlist;
	}

	const { isPending, error, data } = useQuery({
		queryKey: ["getPlaylist", id],
		queryFn: getPlaylist,
	});

	const formatDate = (date: string) => {
		return date.toString().split("T")[0];
	};

	return (
		<>
			{error ? (
				<div className="text-red-400">{`An error has occurred: ${error.message}`}</div>
			) : data ? (
				<div className="flex flex-col space-y-4 w-full self-start items-start content-start">
					<div className="w-full flex flex-row mx-auto p-4 pb-0 shadow-md rounded-md text-white bg-secondary">
						<div className="relative h-64 mb-4">
							<img
								src={data.playlist.image}
								alt="Playlist Cover Art"
								className="object-cover w-full h-full rounded-md"
							/>
						</div>
						<div className="my-2 flex flex-col justify-between place-content-end ml-auto text-right mr-10">
							<h1 className="text-6xl font-bold mb-4">{data.playlist.name}</h1>
							<p className="mb-4 text-xl">
								Created at: {formatDate(data.playlist.createdAt)}
							</p>
						</div>
					</div>
					<Separator className="text-3xl" />
					<div className="mt-10 w-full">
						<CreateSongForm playlistId={parseInt(id)} />
					</div>
					<Separator className="mt-10" />
					<div className="mt-10 w-full">
						<SongsFetcher playlistId={parseInt(id)} />
					</div>
				</div>
			) : isPending ? (
				<p className="text-gray-400">Loading Playlist Content...</p>
			) : null}
		</>
	);
}
