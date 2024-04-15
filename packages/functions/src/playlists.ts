import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/aws-lambda";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { playlists as playlistsTable } from "@tunelite/core/db/schema/playlists";
import { db } from "@tunelite/core/db";
import { eq, desc, count, and } from "drizzle-orm";

const api = new Hono().basePath("/playlists");

api.use(logger());

api.get("/", async (c) => {
	const playlists = await db
		.select()
		.from(playlistsTable)
		.orderBy(desc(playlistsTable.createdAt));
	return c.json({ playlists });
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
api.delete("/:id{[0-9]+}", async (c) => {
	const id = +c.req.param("id");

	const playlist = await db
		.select()
		.from(playlistsTable)
		.where(eq(playlistsTable.id, id))
		.then((res) => res[0]);

	if (!playlist) {
		return c.json({ error: "Playlist not found" }, 404);
	}

	const deletedPlaylist = await db
		.delete(playlistsTable)
		.where(eq(playlistsTable.id, playlist.id))
		.returning();

	if (!deletedPlaylist) {
		return c.json({ error: "Delete Not Success" }, 404);
	}

	return c.json({ success: true });
});

export const handler = handle(api);
