'use client';

import React, { useState, useRef, useEffect } from 'react';
import { guidedScenariosDialogue, DialogueTurn } from '@/data/scenarios';
import AudioRecorder from '@/lib/input';
import WaveSurfer from 'wavesurfer.js';

import { translateText, transcribeAudio, calculateSimilarity, generateAudio } from '@/lib/backend';


interface WaveformAudioPlayerProps {
    src: string;
}

function WaveformAudioPlayer({ src }: WaveformAudioPlayerProps) {
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


interface VoiceMessage {
    sender: 'user' | 'bot';
    audioUrl: string;
}


export default function ChatPage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = React.use(params);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);
    const [countIncorrect, setCountIncorrect] = useState<number>(0);
    const [messages, setMessages] = useState<VoiceMessage[]>([]);
    const [audioData, setAudioData] = useState<Blob>();
    const [translationPopup, setTranslationPopup] = useState<string | null>(null);

    const createMessage = async (user: "bot" | "user", text?: string, audioUrl?: string) => {
        if (!text && !audioUrl) throw new Error("Must provide at least one of text or audioUrl args");

        var message: VoiceMessage;

        if (audioUrl) {
            message = {
                sender: user,
                audioUrl: audioUrl
            }
        } else {
            const audioBlob = await generateAudio({
                text: text!,
                language: "MANDARIN"
            });
            message = {
                sender: user,
                audioUrl: URL.createObjectURL(audioBlob)
            }
        }
        
        setMessages(prev => [...prev, message]);
    }

    const handleIncorrectAttempt = async (text: string) => {
        console.log("Not similar enough, try again!");
        setCountIncorrect(countIncorrect + 1);
        setTranslationPopup(text);
        setTimeout(() => setTranslationPopup(null), 2000);  
    }

    const evaluateUserAudio = async (data: Blob) => {
        // Transcribe and translate audio, calc similarity
        const audioText = await transcribeAudio(data, "MANDARIN");
        const translatedText = await translateText({
            text: audioText.text,
            sourceLang: "MANDARIN",
            targetLang: "ENGLISH"
        });
        const similarityScore = await calculateSimilarity({
            text_1: translatedText.text,
            text_2: dialogue[0].targetSentence
        });

        if (similarityScore.score < 0.7) {
            handleIncorrectAttempt(translatedText.text);
            return;
        }

        await createMessage("user", undefined, URL.createObjectURL(data));
        setCountIncorrect(0);
        

        if (dialogue.length > 1) {
            await createMessage("bot", dialogue[1].mandarin);
            setDialogue(dialogue.slice(1))
        }
    }

    useEffect(() => {  // On mount, grab appropriate dialogue
        const loadedDialogue = guidedScenariosDialogue[id];
        setDialogue(loadedDialogue);
        createMessage("bot", loadedDialogue[0].mandarin); // Load first message
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    useEffect(() => {
        if (audioData) evaluateUserAudio(audioData);
    }, [audioData])

    return (
        <div className="flex flex-col h-screen p-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {messages.map((msg, i) => (
                    <div
                        key={i} 
                        className={`
                            relative max-w-[75%] rounded-2xl shadow-md flex-shrink-0
                            ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} px-2
                            animate-slide-in
                        `}
                    >
                        <div
                            className={`
                                relative max-w-[75%] rounded-2xl shadow-md flex-shrink-0
                                ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}
                                animate-slide-in
                            `}
                        >
                            <div className="p-2">
                                <WaveformAudioPlayer src={msg.audioUrl} />
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {translationPopup && (
                <div className="mb-2 p-2 bg-black bg-opacity-80 text-white rounded-md text-sm text-center animate-fade-in-out">
                    🗣️ You said: {translationPopup}
                </div>
            )}

            {dialogue[0]?.userPrompt && (
                <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-sm">
                    🎯 Next Prompt: {dialogue[0].userPrompt}
                </div>
            )}

            {countIncorrect >= 3 && dialogue[0].hint && (
                <div className="mb-2 p-2 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm">
                    💡 Hint: {dialogue[0].hint}
                </div>
            )}

            <AudioRecorder 
                onRecordingComplete={setAudioData}
            />
        </div>
    );
}
