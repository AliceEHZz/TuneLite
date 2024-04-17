import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/aws-lambda";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { playlists as playlistsTable } from "@tunelite/core/db/schema/playlists";
import { songs as songsTable } from "@tunelite/core/db/schema/songs";
import { db } from "@tunelite/core/db";
import { eq, desc, count, and } from "drizzle-orm";
import { authMiddleware } from "@tunelite/core/auth";

const api = new Hono().basePath("/playlists");

api.use(logger());

api.get("/", async (c) => {
	const playlists = await db
		.select()
		.from(playlistsTable)
		.orderBy(desc(playlistsTable.createdAt));
	return c.json({ playlists });
});

api.post("/", authMiddleware, async (c) => {
	const userId = c.var.userId;
	const body = await c.req.json();

	const playlist = {
		...body.playlist,
		userId,
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

// get songs for playlist
api.get("/:id{[0-9]+}/songs", async (c) => {
	const playlistId = +c.req.param("id");

	const songs = await db
		.select()
		.from(songsTable)
		.where(eq(songsTable.playlistId, playlistId))
		.orderBy(desc(songsTable.addedAt));

	return c.json({ songs });
});

//add songs to playlist
api.post("/:id{[0-9]+}/songs", async (c) => {
	const playlistId = +c.req.param("id");
	const body = await c.req.json();

	const song = {
		...body.song,
		playlistId,
	};

	const newSong = await db.insert(songsTable).values(song).returning();

	return c.json({
		song: newSong,
	});
});

// delete playlist
api.delete("/:id{[0-9]+}", authMiddleware, async (c) => {
	const userId = c.var.userId;
	const id = +c.req.param("id");

	const playlist = await db
		.select()
		.from(playlistsTable)
		.where(and(eq(playlistsTable.userId, userId), eq(playlistsTable.id, id)))
		.then((res) => res[0]);

	if (!playlist) {
		return c.json({ error: "Playlist not found" }, 404);
	}

	const deletedPlaylist = await db
		.delete(playlistsTable)
		.where(and(eq(playlistsTable.userId, userId), eq(playlistsTable.id, id)))
		.returning();

	if (!deletedPlaylist) {
		return c.json({ error: "Delete Playlist Not Success" }, 404);
	}

	return c.json({ success: true });
});

// delete song from playlist
api.delete("/:id{[0-9]+}/songs/:songId{[0-9]+}", async (c) => {
	const playlistId = +c.req.param("id");
	const songId = +c.req.param("songId");

	const song = await db
		.select()
		.from(songsTable)
		.where(
			and(eq(songsTable.playlistId, playlistId), eq(songsTable.id, songId))
		)
		.then((res) => res[0]);

	if (!song) {
		return c.json({ error: "Song not found" }, 404);
	}

	const deletedSong = await db
		.delete(songsTable)
		.where(
			and(eq(songsTable.playlistId, playlistId), eq(songsTable.id, songId))
		)
		.returning();

	if (!deletedSong) {
		return c.json({ error: "Delete Song Not Success" }, 404);
	}

	return c.json({ success: true });
});

export const handler = handle(api);
