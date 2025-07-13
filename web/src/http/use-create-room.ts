import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateRoomResponse } from "./types/create-room-response";

export function useCreateRoom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string; description?: string }) => {
            const response = await fetch('http://localhost:3333/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result: CreateRoomResponse = await response.json();

            return result;
        },
        onSuccess: () => {
            // Invalidate the 'get-createRoom' query to refetch the rooms
            queryClient.invalidateQueries({ queryKey: ['get-createRoom'] });
        }
    })
}