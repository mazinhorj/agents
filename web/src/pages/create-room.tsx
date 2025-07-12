import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

type GetRoomsAPIResponse = Array<{
    id: string;
    name: string;
    createdAt: string;
}>;

export function CreateRoomPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["get-createRoom"],
        queryFn: async () => {
            const response = await fetch("http://localhost:3333/rooms");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const res: GetRoomsAPIResponse = await response.json();
            return res;
        },
    });

    return (
        <div>
            <h1>Create Room</h1>
            <Link to="/room">
                {isLoading ? (
                    <Button variant="default" size="lg" disabled>
                        Loading...
                    </Button>
                ) : (
                    <Button variant="default" size="lg">
                        Create Room
                    </Button>
                )}
            </Link>
            {/* Abaixo traz apenas o JSON consumido do BD */}
            {/* <pre>
                {data && JSON.stringify(data, null, 2)}
            </pre> */}
            <div className="flex flex-col gap-1">
                {data?.map((room) => (
                    <Link key={room.id} to={`/room/${room.id}`}>
                        {room.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
