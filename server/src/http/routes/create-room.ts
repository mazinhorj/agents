import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const createRoomRoute: FastifyPluginCallbackZod = (app) => {
    const createRoomSchema = z.object({
        name: z.string().min(1, "Room name is required"),
        description: z.string().optional(),
    })

    app.post(
        "/rooms",
        {
            schema: {
                body: createRoomSchema,
                },
            },
        
        async (request, reply) => {
            const { name, description } = createRoomSchema.parse(request.body)

            const result = await db.insert(schema.rooms).values({
                name,
                description,
            }).returning()

            const insertedRoom = result[0];

            if (!insertedRoom) {
                throw new Error("Failed to create room");
            }

            return reply.status(201).send({
                roomId: insertedRoom.id,
            }
            )
        })
};
