import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/aws-lambda";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
const api = new Hono().basePath("/playlists");

api.use(logger());

const fakePlaylists = [
	{
		id: 1,
		name: "Moon",
		coverArt: "https://via.placeholder.com/150",
		createdAt: new Date().toISOString(),
	},
	{
		id: 2,
		name: "Sleep",
		coverArt: "https://via.placeholder.com/150",
		createdAt: new Date().toISOString(),
	},
];

const playlistSchema = z.object({
	id: z.number().int().positive().min(1),
	name: z.string().min(3).max(100),
	coverArt: z.string(),
});

type Playlist = z.infer<typeof playlistSchema>;

const createPlaylistSchema = playlistSchema.omit({ id: true });

api.get("/", (c) => {
	return c.json({ playlists: fakePlaylists });
});

api.post("/", zValidator("json", createPlaylistSchema), async (c) => {
	const playlist = await c.req.valid("json");
	fakePlaylists.push({
		...playlist,
		id: fakePlaylists.length + 1,
		createdAt: new Date().toISOString(),
	});

	return c.json({
		playlists: fakePlaylists,
	});
});

api.get("/:id{[0-9]+}", (c) => {
	const id = +c.req.param("id");
	const playlist = fakePlaylists.find((p) => p.id === id);
	return playlist ? c.json({ playlist }) : c.notFound();
});

// delete
// app.delete("/playlists/:id", async (c) => {
// 	const id = c.req.params.id;
// 	const index = fakePlaylists.findIndex((p) => p.id === id);
// 	if (index !== -1) {
// 		fakePlaylists.splice(index, 1);
// 	}

// 	return c.json({
// 		playlists: fakePlaylists,
// 	});
// });

export const handler = handle(api);
