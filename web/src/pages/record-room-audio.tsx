import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';

const isRecordingSupported =
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window.MediaRecorder === 'function';

type RoomParams = {
    roomId: string;
};

export function RecordRoomAudio() {
    const params = useParams<RoomParams>();
    

    const [isRecording, setIsRecording] = useState(false);
    const recorder = useRef<MediaRecorder | null>(null);

    function stopRecording() {
        setIsRecording(false);

        if (recorder.current && recorder.current.state !== 'inactive') {
            recorder.current.stop();
            // biome-ignore lint/suspicious/noConsole: q porra chata
            console.log('Gravação parada');
        }
    }

    async function uploadAudio(audio: Blob) {
        const formData = new FormData();
        formData.append('audio', audio, 'recording.webm');

        const response = await fetch(`http://localhost:3333/rooms/${params.roomId}/audio`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(`Erro ao enviar áudio: ${result.message}`);
        }
        // biome-ignore lint/suspicious/noConsole: takilparil
        console.log('Áudio enviado com sucesso:', result);
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

        recorder.current = new MediaRecorder(audio, {
            mimeType: 'audio/webm',
            audioBitsPerSecond: 128_000,
        });

        recorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                // biome-ignore lint/suspicious/noConsole: q porra chata
                console.log('Audio disponível:', event.data);
                uploadAudio(event.data)
                    .then(() => {
                        // biome-ignore lint/suspicious/noConsole: q porra chata
                        console.log('Áudio enviado com sucesso');
                    })
                    .catch((error) => {
                        // biome-ignore lint/suspicious/noConsole: q porra chata
                        console.error('Erro ao enviar áudio:', error);
                    });
                // const audioBlob = new Blob([event.data], { type: 'audio/webm' });
                // const audioUrl = URL.createObjectURL(audioBlob);
                // const audioElement = new Audio(audioUrl);
                // audioElement.play();
            }
        };

        recorder.current.onstart = () => {
            // biome-ignore lint/suspicious/noConsole: q porra chata
            console.log('Gravação iniciada');
        };

        recorder.current.onstop = () => {
            setIsRecording(false);
            // biome-ignore lint/suspicious/noConsole: q porra chata
            console.log('Gravação parada');
        };

        recorder.current.start();
    }

    if (!params.roomId) {
        return <Navigate replace to="/" />;
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-3">
            {isRecording ? (
                <Button onClick={stopRecording}>Parar gravação</Button>
            ) : (
                <Button onClick={startRecording}>Gravar áudio</Button>
            )}

            {isRecording ? <p>Gravando...</p> : <p>Pressione o botão para gravar</p>}
        </div>
    );
}
