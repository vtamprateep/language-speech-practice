"use client";

import { useState, useRef } from "react";

interface AudioRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioStreamRef = useRef<MediaStream | null>(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;

        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.start();
        setRecording(true);
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
                setRecording(false);
                resolve();
            };

            mediaRecorderRef.current!.stop();
            audioStreamRef.current?.getTracks().forEach(track => track.stop());
        });
    };

    const handleButtonClick = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <button
                onClick={handleButtonClick}
                className={`px-4 py-2 rounded ${recording ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
            >
                {recording ? "Stop Recording" : "Start Recording"}
            </button>

            {audioUrl && (
                <audio controls className="mt-2">
                    <source src={audioUrl} type="audio/webm" />
                </audio>
            )}
        </div>
    );
}

interface ChatTextFieldProps {
    onTextSubmit: (text: string) => void;
}

export function ChatTextField({ onTextSubmit }: ChatTextFieldProps) {
    const [input, setInput] = useState('');

    const sendUserMessage = async () => {
        if (!input.trim()) return;
        onTextSubmit(input);
        setInput('');
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendUserMessage();
        }
    }

    return (
        <div className="flex">
            <textarea
                className="flex-1 p-2 border rounded resize-none"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
            />
            <button
                onClick={sendUserMessage}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Send
            </button>
        </div>
    )
}