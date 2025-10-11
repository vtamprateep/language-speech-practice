import { useState, useRef } from "react";


interface RecordButtonProps {
    onRecordingComplete?: (audioBlob: Blob) => void;
}

export function RecordButton({ onRecordingComplete }: RecordButtonProps) {
    const [status, setStatus] = useState<"idle" | "preparing" | "recording">("idle");
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

        mediaRecorderRef.current.onstart = () => setStatus("recording");
        mediaRecorderRef.current.start(200); // Push chunks every 200 ms
    };

    const stopRecording = async () => {
        if (!mediaRecorderRef.current) return;

        return new Promise<void>((resolve) => {
            mediaRecorderRef.current!.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(blob);
                onRecordingComplete?.(blob);
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
        <button
            onClick={handleButtonClick}
            disabled={status === "preparing"}
            className="relative w-12 h-12 flex items-center justify-center"
        >
            {/* Outer circle border */}
            <div className="absolute w-12 h-12 rounded-full border-2 border-white bg-black/20" />

            {status === "idle" && (
                <div className="w-8 h-8 rounded-full bg-red-600" />
            )}

            {status === "recording" && (
                <div className="w-5 h-5 bg-red-600 rounded-sm" />
            )}

            {status === "preparing" && (
                <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse" />
            )}
        </button>
    );
}