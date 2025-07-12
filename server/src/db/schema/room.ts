import {
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    vector,
} from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
    id: uuid().primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
