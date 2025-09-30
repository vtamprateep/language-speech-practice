import { useState, useRef, useEffect } from "react";
import WaveSurfer from 'wavesurfer.js';

interface WaveformAudioPlayerProps {
    src: string;
}

export function WaveformAudioPlayer({ src }: WaveformAudioPlayerProps) {
    const waveformRef = useRef<HTMLDivElement | null>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!waveformRef.current) return;

        // Initialize wavesurfer
        wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#ddd',
            progressColor: '#3b82f6', // Tailor to your color scheme
            cursorColor: 'transparent',
            barWidth: 3,
            barRadius: 3,
            height: 40,
            // responsive: true,
        });

        wavesurferRef.current.load(src);

        wavesurferRef.current.on('finish', () => setIsPlaying(false));

        return () => {
            wavesurferRef.current?.destroy();
        };
    }, [src]);

    const togglePlay = () => {
        wavesurferRef.current?.playPause();
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={togglePlay}
                className="
                    w-10 h-10
                    flex items-center justify-center
                    bg-blue-500 text-white
                    rounded-full
                    shadow-md
                    hover:bg-blue-600
                    transition-colors duration-200
                "
            >
                {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                            <path d="M5 3v18l15-9L5 3z" />
                        </svg>
                    )
                }
            </button>
            <div ref={waveformRef} className="w-full" />
        </div>
    );
}

interface AudioRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
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
            <div className="flex items-center space-x-4">
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
            </div>
        </div>
    );
}