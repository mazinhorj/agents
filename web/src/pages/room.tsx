import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";

type RoomParams = {
    roomId: string
}

export function RoomPage() {
    const params = useParams<RoomParams>();

    if (!params.roomId) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <h1>Room Page</h1>
            <p>Detalhes da sala {JSON.stringify(params.roomId)}.</p>
            <Link to="/">
                <Button>Voltar</Button>
            </Link>
            {/* Aqui você pode adicionar mais detalhes sobre a sala, como participantes, mensagens, etc. */}
        </div>
    );
}