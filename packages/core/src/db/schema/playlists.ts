import {
	integer,
	pgTable,
	serial,
	varchar,
	timestamp,
	index,
	text,
} from "drizzle-orm/pg-core";

export const playlists = pgTable(
	"playlists",
	{
		id: serial("id").primaryKey().notNull(),
		userId: text("user_id").notNull(),
		name: varchar("name", { length: 256 }).notNull(),
		image: text("image"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => {
		return {
			nameIdx: index("userId_idx").on(table.userId),
		};
	}
);
