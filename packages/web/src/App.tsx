import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";

type Playlist = {
	id: number;
	name: string;
	coverArt: string;
	createdAt: string;
};

function App() {
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [newPlaylistName, setNewPlaylistName] = useState<string>("");
	const [newPlaylistCoverArt, setNewPlaylistCoverArt] = useState<string>("");

	useEffect(() => {
		async function getPlaylists() {
			// this is how we access the environment variable in myStack
			const res = await fetch(import.meta.env.VITE_APP_API_URL + "/playlists");
			const json: Playlist[] = await res.json();

			// json is now an array of Playlist objects
			setPlaylists(json.playlists);
		}
		getPlaylists();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await fetch(import.meta.env.VITE_APP_API_URL + "/playlists", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: newPlaylistName,
				coverArt: newPlaylistCoverArt,
			}),
		});
		const json = await res.json();
		setPlaylists(json.playlists);
		setNewPlaylistName("");
		setNewPlaylistCoverArt("");
	};
	return (
		<div className="App">
			<div className="card">
				{playlists.map((playlist: Playlist) => (
					<div key={playlist.id} className="playlist">
						<img src={playlist.coverArt} alt={playlist.name} />
						<div>
							<h3>{playlist.name}</h3>
							<p>{new Date(playlist.createdAt).toLocaleDateString()}</p>
						</div>
					</div>
				))}
			</div>

			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Playlist Name"
					value={newPlaylistName}
					onChange={(e) => setNewPlaylistName(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Cover Art URL"
					value={newPlaylistCoverArt}
					onChange={(e) => setNewPlaylistCoverArt(e.target.value)}
				/>
				<Button type="submit">Add Playlist</Button>
			</form>
		</div>
	);
}
export default App;
