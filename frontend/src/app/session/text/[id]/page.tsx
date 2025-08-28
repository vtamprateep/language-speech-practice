'use client';

import React, { useState, useRef, useEffect } from 'react';
import { guidedScenariosDialogue, DialogueTurn } from '@/data/scenarios';
import { translateText, calculateSimilarity } from '@/lib/backend';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}


export default function ChatPage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = React.use(params);
    const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);
    const [currentPrompt, setCurrentPrompt] = useState<string>();
    const [countIncorrect, setCountIncorrect] = useState<number>(0);
    const [currentTurn, setCurrentTurn] = useState<DialogueTurn>()
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
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

    const sendUserMessage = async () => {
        if (!input.trim()) return;
        const newMessage: Message = { sender: 'user', text: input };
        const newMessageEnglish = await translateText({
            text: input,
            sourceLang: "MANDARIN",
            targetLang: "ENGLISH"
        });
        

        // Evaluate if response close enough to target sentence
        const similarityScore = await calculateSimilarity({
            text_1: newMessageEnglish.text,
            text_2: currentTurn!.targetSentence
        });

        if (similarityScore.score < 0.7) {
            console.log("Not similar enough, try again!");
            setCountIncorrect(countIncorrect + 1);
            setTranslationPopup(newMessageEnglish.text);
            setTimeout(() => setTranslationPopup(null), 2000);
            return;
        }

        setMessages(prev => [...prev, newMessage]);
        setCountIncorrect(0);
        setInput('');

        if (dialogue.length === 0) {
            setIsDisabled(true);
        } else {
            sendBotMessage();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendUserMessage();
        }
    };

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

            <div className="flex">
                <textarea
                    className="flex-1 p-2 border rounded resize-none"
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isDisabled}
                    placeholder="Type your message..."
                />
                <button
                    onClick={sendUserMessage}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
