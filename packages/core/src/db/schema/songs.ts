import {
	integer,
	pgTable,
	serial,
	varchar,
	timestamp,
} from "drizzle-orm/pg-core";
import { playlists } from "./playlists";

export const songs = pgTable("songs", {
	id: serial("id").primaryKey().notNull(),
	songName: varchar("song_name", { length: 256 }).notNull(),
	artist: varchar("artist", { length: 256 }).notNull(),
	playlistId: integer("playlist_id").references(() => playlists.id),
	addedAt: timestamp("added_at").notNull().defaultNow(),
});
