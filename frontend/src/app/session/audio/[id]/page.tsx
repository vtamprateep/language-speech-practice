'use client';

import React, { useState, useRef, useEffect } from 'react';
import { guidedScenariosDialogue, DialogueTurn } from '@/data/scenarios';
import { Language } from '@/lib/languages';


interface Message {
    sender: 'user' | 'bot';
    text: string;
}

interface AudioRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
    disabled?: boolean;
}


function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
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
    };

    const stopRecording = async () => {
        if (!mediaRecorderRef.current) return;

        return new Promise<void>((resolve) => {
            mediaRecorderRef.current!.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
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
                disabled={disabled}
                className={`px-4 py-2 rounded ${recording ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
            >
                {recording ? "Stop Recording" : "Start Recording"}
            </button>

            {audioUrl && (
                <audio controls className="mt-2">
                    <source src={audioUrl} type="audio/wav" />
                </audio>
            )}
        </div>
    );
}


export default function ChatPage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = React.use(params);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);
    const [currentPrompt, setCurrentPrompt] = useState<string>();
    const [countIncorrect, setCountIncorrect] = useState<number>(0);
    const [currentTurn, setCurrentTurn] = useState<DialogueTurn>()
    const [messages, setMessages] = useState<Message[]>([]);
    const [audioData, setAudioData] = useState<Blob>();
    const [translationPopup, setTranslationPopup] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const evaluateTextSimilarity = async (userText: string, targetText: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/calculate_similarity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text_1: userText,
                    text_2: targetText
                })
            })
            const data = await res.json();
            return data.score;
        } catch (err) {
            console.error('Failed to fetch', err);
        }
    }

    const textToEnglish = async (text: string) => {
        const targetLanguage: Language = 'ENGLISH';
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/translate_text`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    sourceLang: "MANDARIN",
                    targetLang: targetLanguage
                })
            })
            const data = await res.json();
            console.log(`Translated to ${data.text}`);
            return data.text;
        } catch (err) {
            console.log('Failed to fetch', err);
        }
    }

    const transcribeAudio = async (audioData: Blob ) => {
        const targetLanguage: Language = 'ENGLISH';
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/transcribe_audio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: JSON.stringify({
                    file: audioData,
                    language: "MANDARIN"
                })
            })
            const data = await res.json();
            console.log(`Translated to ${data.text}`);
            return data.text;
        } catch (err) {
            console.log('Failed to fetch', err);
        }
    }

    const sendBotMessage = async () => {
        const nextTurn = dialogue[0];
        const botMessage: Message = {
            sender: "bot",
            text: nextTurn.mandarin
        }
        setMessages(prev => [...prev, botMessage]);
        setDialogue(dialogue.slice(1));
        setCurrentPrompt(nextTurn.userPrompt);
        setCurrentTurn(nextTurn);
    }

    const sendUserAudio = async (data: Blob) => {
        // Transcribe and translate audio, calc similarity
        const transcribedAudio = await transcribeAudio(data);
        const translatedText = await textToEnglish(transcribedAudio);
        const similarityScore = await evaluateTextSimilarity(translatedText, currentTurn!.targetSentence);

        setAudioData(undefined); // Reset input

        if (similarityScore < 0.7) {
            console.log("Not similar enough, try again!");
            setCountIncorrect(countIncorrect + 1);
            setTranslationPopup(translatedText);
            setTimeout(() => setTranslationPopup(null), 2000);
            return;
        }

        setMessages(prev => [...prev, transcribedAudio]);
        setCountIncorrect(0);
        

        if (dialogue.length === 0) {
            setIsDisabled(true);
        } else {
            sendBotMessage();
        }
    }

    useEffect(() => {  // On mount, grab appropriate dialogue
        const dialogue = guidedScenariosDialogue[id];
        const firstTurn = dialogue[0];
        const botMessage: Message = {
            sender: "bot",
            text: firstTurn.mandarin
        };

        setMessages([botMessage]);
        setCurrentTurn(firstTurn);
        setCurrentPrompt(firstTurn.userPrompt);
        setDialogue(dialogue.slice(1));
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    useEffect(() => {
        if (audioData) sendUserAudio(audioData);
    }, [audioData])

    return (
        <div className="flex flex-col h-screen p-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`max-w-md p-3 rounded-lg ${
                            msg.sender === 'user'
                                ? 'ml-auto bg-blue-500 text-white'
                                : 'mr-auto bg-gray-200 text-black'
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {translationPopup && (
                <div className="mb-2 p-2 bg-black bg-opacity-80 text-white rounded-md text-sm text-center animate-fade-in-out">
                    🗣️ You said: {translationPopup}
                </div>
            )}

            {currentPrompt && (
                <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-sm">
                    🎯 Next Prompt: {currentPrompt}
                </div>
            )}

            {countIncorrect >= 3 && currentTurn?.hint && (
                <div className="mb-2 p-2 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm">
                    💡 Hint: {currentTurn.hint}
                </div>
            )}

            <AudioRecorder 
                onRecordingComplete={setAudioData}
                disabled={isDisabled}
            />
        </div>
    );
}
