import { useQuery } from "@tanstack/react-query";
import type { GetRoomsQuestionsResponse } from "./types/get-rooms-questions-response";

export function useRoomQuestions(roomId: string) {
    return useQuery({
        queryKey: ['get-questions', roomId],
        queryFn: async () => {
            const response = await fetch(`http://localhost:3333/rooms/${roomId}/questions`);
            if (!response.ok) {
                throw new Error('Deu erro ao buscar as salas');
            }
            const res: GetRoomsQuestionsResponse = await response.json();
            return res;
        },
    });
}