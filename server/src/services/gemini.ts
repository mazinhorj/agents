import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

const gemini = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: "Transcreva o áudio para português do Brasil. Seja preciso e natural na trancrição. Mantenha a pontuação correta e divida o texto em parágrafos corretamente",
            },
            {
                inlineData: {
                    mimeType,
                    data: audioAsBase64,
                },
            }
        ],
    });

    if (!response)
        throw new Error("Erro ao transcrever o áudio");

    return response.text;
}

export async function generateEmbeddings(text: string) {
    const response = await gemini.models.embedContent({
        model: "text-embedding-004",
        contents: [{text}],
        config: {
            taskType: 'RETRIEVAL_DOCUMENT',
        },
    });

    if (!response.embeddings?.[0].values)
        throw new Error("Erro ao gerar embeddings");

    return response.embeddings[0].values;
}