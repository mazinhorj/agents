import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env.ts";
import { schema } from "./schema/index.ts";

export const sql = postgres(env.DATABASE_URL);
export const db = drizzle(sql, {
    schema,
    casing: "camelCase",
});

const res = await sql`SELECT 1 AS one`;

console.log("Database connection established:", res);
