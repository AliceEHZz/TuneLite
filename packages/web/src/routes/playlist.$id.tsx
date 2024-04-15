import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/playlist/$id")({
	component: PlaylistComponent,
});

function PlaylistComponent() {
	const id = Route.useParams().id;

	return (
		<div>
			<h1>Playlist {id}</h1>
		</div>
	);
}
