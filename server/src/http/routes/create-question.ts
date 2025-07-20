import { and, eq, sql } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts";

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
    const paramsSchema = z.object({
        roomId: z.string(),
    });
    const createQuestionSchema = z.object({
        question: z.string().min(1, "Cadê a pergunta?"),
    });

    app.post(
        "/rooms/:roomId/questions",
        {
            schema: {
                params: paramsSchema,
                body: createQuestionSchema,
            },
        },

        async (request, reply) => {
            const { roomId } = paramsSchema.parse(request.params);
            const { question } = createQuestionSchema.parse(request.body);

            const embeddings = await generateEmbeddings(question);
            if (!embeddings) {
                return reply.status(400).send({
                    error: "Erro ao gerar embeddings para a pergunta.",
                });
            }

            const embeddingsAsString = `[${embeddings.join(",")}]`;

            const chunks = await db
                .select({
                    id: schema.audioChunks.id,
                    transcription: schema.audioChunks.transcription,
                    embeddings: schema.audioChunks.embeddings,
                    similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
                })
                .from(schema.audioChunks)
                .where(
                    and(
                        eq(schema.audioChunks.roomId, roomId),
                        sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`,
                    ),
                )
                .orderBy(
                    sql`(${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
                )
                .limit(3);


            let answer: string | null = null;
            if (chunks.length > 0) {
                const transcriptions = chunks.map(chunk => chunk.transcription);
                answer = await generateAnswer(question, transcriptions);

            }
            // return chunks;

            const result = await db
                .insert(schema.questions)
                .values({
                    roomId,
                    question,
                    answer
                })
                .returning();

            const insertedQuestion = result[0];

            if (!insertedQuestion) {
                throw new Error("Failed to create a question");
            }

            return reply.status(201).send({
                qustionId: insertedQuestion.id,
                answer,
            });
        },
    );
};
