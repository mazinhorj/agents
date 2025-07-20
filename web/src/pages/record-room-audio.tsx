import { ArrowLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useRooms } from '../http/use-rooms';

const isRecordingSupported =
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window.MediaRecorder === 'function';

type RoomParams = {
    roomId: string;
    name: string;
};

export function RecordRoomAudio() {
    const params = useParams<RoomParams>();
    const name = useRooms().data?.find((room) => room.id === params.roomId)?.name;

    const [isRecording, setIsRecording] = useState(false);
    const recorder = useRef<MediaRecorder | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    function stopRecording() {
        setIsRecording(false);

        if (recorder.current && recorder.current.state !== 'inactive') {
            recorder.current.stop();
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }

    async function uploadAudio(audio: Blob) {
        const formData = new FormData();
        formData.append('audio', audio, 'recording.webm');

        const response = await fetch(
            `http://localhost:3333/rooms/${params.roomId}/audio`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const result = await response.json();
        if (!response.ok) {
            throw new Error(`Erro ao enviar áudio: ${result.message}`);
        }
        // biome-ignore lint/suspicious/noConsole: takilparil
        console.log('Áudio enviado com sucesso:', result);
    }

    function createRecorder(audio: MediaStream) {
        recorder.current = new MediaRecorder(audio, {
            mimeType: 'audio/webm',
            audioBitsPerSecond: 64_000,
        });

        recorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                // // biome-ignore lint/suspicious/noConsole: q porra chata
                // console.log('Audio disponível:', event.data);
                uploadAudio(event.data);
                // .then(() => {
                //     // biome-ignore lint/suspicious/noConsole: q porra chata
                //     console.log('Áudio enviado com sucesso');
                // })
                // .catch((error) => {
                //     // biome-ignore lint/suspicious/noConsole: q porra chata
                //     console.error('Erro ao enviar áudio:', error);
                // });
            }
        };

        recorder.current.onstart = () => {
            setIsRecording(true);
            // // biome-ignore lint/suspicious/noConsole: q porra chata
            // console.log('Gravação iniciada');
        };

        recorder.current.onstop = () => {
            setIsRecording(false);
            // // biome-ignore lint/suspicious/noConsole: q porra chata
            // console.log('Gravação parada');
        };

        recorder.current.start();
    }

    async function startRecording() {
        if (!isRecordingSupported) {
            alert('Gravação de áudio não é suportada neste navegador.');
            return;
        }
        setIsRecording(true);

        const audio = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44_100,
            },
        });

        createRecorder(audio);

        intervalRef.current = setInterval(() => {
            recorder.current?.stop();
            createRecorder(audio);
        }, 5000);
    }

    if (!params.roomId) {
        return <Navigate replace to="/" />;
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="mb-4 flex items-center justify-between">
                <Link to="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 size-4" />
                        Voltar ao Início
                    </Button>
                </Link>
                <span className="text-muted-foreground text-sm">
                    Gravar áudio para sala {name}
                </span>
                <Link to={`/room/${params.roomId}`}>
                    <Button className="flex items-center gap-2" variant="secondary">
                        <ArrowLeft className="mr-2 size-4" />
                        Voltar para Sala
                    </Button>
                </Link>
            </div>

            <div className="flex h-screen flex-col items-center justify-center gap-3">
                {isRecording ? (
                    <Button onClick={stopRecording}>Parar gravação</Button>
                ) : (
                    <Button onClick={startRecording}>Gravar áudio</Button>
                )}

                {isRecording ? (
                    <p>Gravando...</p>
                ) : (
                    <p>Pressione o botão para gravar</p>
                )}
            </div>
        </div>
    );
}
