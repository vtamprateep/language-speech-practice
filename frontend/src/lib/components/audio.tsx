import { useState, useRef } from "react";

interface AudioRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
    const [status, setStatus] = useState<"idle" | "preparing" | "recording">("idle");
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioStreamRef = useRef<MediaStream | null>(null);

    const startRecording = async () => {
        setStatus("preparing");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: {
            channelCount: 1, // mono
            sampleRate: 16000, // optional, match your model’s preferred rate
            echoCancellation: true, // optional, reduces background echo
            noiseSuppression: true, // optional
        }});
        audioStreamRef.current = stream;

        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstart = () => setStatus("recording")

        mediaRecorderRef.current.start(200); // Push chunks every 200 ms
        setAudioUrl(null);
    };

    const stopRecording = async () => {
        if (!mediaRecorderRef.current) return;

        return new Promise<void>((resolve) => {
            mediaRecorderRef.current!.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                onRecordingComplete(blob);
                setStatus("idle");
                resolve();
            };

            mediaRecorderRef.current!.stop();
            audioStreamRef.current?.getTracks().forEach(track => track.stop());
        });
    };

    const handleButtonClick = () => {
        if (status === "recording") {
            stopRecording();
        } else if (status === "idle") {
            startRecording();
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <button
                onClick={handleButtonClick}
                disabled={status === "preparing"}
                className={`
                    px-4 py-2 rounded
                    ${status === "recording" ? "bg-red-500 text-white" : ""}
                    ${status === "idle" ? "bg-green-500 text-white" : ""}
                    ${status === "preparing" ? "bg-gray-400 text-white cursor-not-allowed" : ""}
                `}
            >
                {status === "idle" && "Start Recording"}
                {status === "preparing" && "Preparing microphone…"}
                {status === "recording" && "Stop Recording"}
            </button>

            {audioUrl && (
                <audio controls className="mt-2">
                    <source src={audioUrl} type="audio/webm" />
                </audio>
            )}
        </div>
    );
}