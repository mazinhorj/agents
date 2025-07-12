import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
    const paramsSchema = z.object({
        roomId: z.string(),
    });
    const createQuestionSchema = z.object({
        question: z.string().min(1, "Cadê a pergunta?"),
    })

    app.post(
        "/rooms/:roomId/questions",
        {
            schema: {
                params: paramsSchema,
                body: createQuestionSchema,
                },
            },
        
        async (request, reply) => {
            const { roomId } = paramsSchema.parse(request.params)
            const { question } = createQuestionSchema.parse(request.body)

            const result = await db
            .insert(schema.questions)
            .values({
                roomId,
                question,
            })
            .returning()

            const insertedQuestion = result[0];

            if (!insertedQuestion) {
                throw new Error("Failed to create a question");
            }

            return reply.status(201).send({
                qustionId: insertedQuestion.id,
            }
            )
        })
};
