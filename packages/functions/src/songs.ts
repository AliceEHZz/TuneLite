import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/aws-lambda";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { songs as songsTable } from "@tunelite/core/db/schema/songs";
import { db } from "@tunelite/core/db";
import { eq, desc, count, and } from "drizzle-orm";

const api = new Hono().basePath("/songs");

api.use(logger());

api.get("/:playlistId", async (c) => {
	const songs = await db
		.select()
		.from(songsTable)
		.orderBy(desc(songsTable.addedAt));
	return c.json({ songs });
});

api.post("/", async (c) => {
	const body = await c.req.json();

	const playlist = {
		...body.playlist,
		userId: "bob",
	};
	const newPlaylist = await db
		.insert(playlistsTable)
		.values(playlist)
		.returning();
	return c.json({
		playlist: newPlaylist,
	});
});

api.get("/:id{[0-9]+}", async (c) => {
	const id = +c.req.param("id");

	const playlist = await db
		.select()
		.from(playlistsTable)
		.where(eq(playlistsTable.id, id))
		.then((res) => res[0]);

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
