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
        contents: [{ text }],
        config: {
            taskType: 'RETRIEVAL_DOCUMENT',
        },
    });

    if (!response.embeddings?.[0].values)
        throw new Error("Erro ao gerar embeddings");

    return response.embeddings[0].values;
}

export async function generateAnswer(question: string, transcriptions: string[]) {
    const context = transcriptions.join("\n\n");
    const prompt = `
        Com base no texto fornecido abaixo como contexto, responda à pergunta de forma clara e objetiva em português do Brasil.
        CONTEXTO:
        ${context}
        PERGUNTA:
        ${question}
        INSTRUÇÕES:
        - Use apenas informações contidas no  contexto enviado;
        - Seja objetivo e direto na resposta;
        - Use uma linguagem natural e acessível;
        - Se a resposta não for encontrada no contexto, responda "Ainda não sei" ou "Não tenho informações suficientes para responder";
        - Cite trechos relevantes do contexto, se necessário, para embasar sua resposta;
        - Se for citar o contexto, utilize o termo "conteúdo do vídeo"
    `.trim()
    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: prompt
            }
        ]
    })
    if (!response.text) {
        throw new Error("Erro ao gerar resposta");
    }
    return response.text;
}