import { ArrowBigRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../components/ui/card';
import { useRooms } from '../http/use-rooms';
import { dayjs } from '../lib/dayjs';

export function RoomList() {
    const { data, isLoading } = useRooms();

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Salas recentes</CardTitle>
                <CardDescription>
                    Acesso rápido para as salas criadas recentemente.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {isLoading && (
                    <p className="text-muted-foreground text-sm">Carregando...</p>
                )}
                {data?.map((room) => {
                    return (
                        <Link
                            className="flex items-center justify-between rounded-md border p-3 hover:bg-accent/50"
                            key={room.id}
                            to={`/room/${room.id}`}
                        >
                            <div className="flex flex-1 flex-col gap-1">
                                <h3 className="font-medium antialiased">{room.name}</h3>
                                <div className="flex items-center gap-2">
                                    <Badge className="text-xs" variant="secondary">
                                        {dayjs(room.createdAt).toNow()}
                                    </Badge>
                                    <Badge className="text-xs" variant="secondary">
                                        {room.questionsCount} perguntas
                                    </Badge>
                                </div>
                            </div>
                            <span className="flex items-center gap-1 text-sm">
                                Entrar
                                <ArrowBigRight className="size-3" />
                            </span>
                        </Link>
                    );
                })}
            </CardContent>
        </Card>
    );
}
