import { useState, useRef, useEffect } from "react";
import WaveSurfer from 'wavesurfer.js';

interface AudioPlayerProps {
    src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
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