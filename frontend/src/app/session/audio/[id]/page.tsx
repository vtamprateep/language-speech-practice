'use client';

import React, { useState, useRef, useEffect } from 'react';
import { guidedScenariosDialogue, DialogueTurn } from '@/data/scenarios';
import AudioRecorder from '@/lib/input';

import { translateText, transcribeAudio, calculateSimilarity, generateAudio } from '@/lib/backend';


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
                        className={`max-w-md p-3 rounded-lg ${
                            msg.sender === 'user'
                                ? 'ml-auto bg-blue-500 text-white'
                                : 'mr-auto bg-gray-200 text-black'
                        }`}
                    >
                        <audio controls className="mt-2">
                            <source src={msg.audioUrl} type="audio/webm" />
                        </audio>
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
