'use client';

import React, { useState, useRef, useEffect } from 'react';
import { guidedScenariosDialogue, DialogueTurn } from '@/data/scenarios';
import AudioRecorder from '@/lib/input';

import { translateText, transcribeAudio, calculateSimilarity } from '@/lib/backend';


interface Message {
    sender: 'user' | 'bot';
    text: string;
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
        const audioText = await transcribeAudio(data);
        const translatedText = await translateText({
            text: audioText.text,
            sourceLang: "MANDARIN",
            targetLang: "ENGLISH"
        });
        const similarityScore = await calculateSimilarity({
            text_1: translatedText.text,
            text_2: currentTurn!.targetSentence
        });

        if (similarityScore.score < 0.7) {
            console.log("Not similar enough, try again!");
            setCountIncorrect(countIncorrect + 1);
            setTranslationPopup(translatedText.text);
            setTimeout(() => setTranslationPopup(null), 2000);
            return;
        }

        const newMessage: Message = {
            sender: "user",
            text: audioText.text
        }
        setMessages(prev => [...prev, newMessage]);
        setCountIncorrect(0);
        

        if (dialogue.length > 0) {
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
            />
        </div>
    );
}
