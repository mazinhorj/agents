import { useQuery } from "@tanstack/react-query";
import type { GetRoomsResponse } from "./types/get-rooms-response";

export function useRooms() {
    return useQuery({
        queryKey: ['get-createRoom'],
        queryFn: async () => {
            const response = await fetch('http://localhost:3333/rooms');
            if (!response.ok) {
                throw new Error('Deu erro ao buscar as salas');
            }
            const res: GetRoomsResponse = await response.json();
            return res;
        },
    });
}