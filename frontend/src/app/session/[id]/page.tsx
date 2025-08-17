'use client';

import React, { useState, useRef, useEffect } from 'react';
import { guidedScenariosDialogue, DialogueTurn } from '@/data/scenarios';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}


export default function ChatPage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = React.use(params);
    const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);
    const [currentTurn, setCurrentTurn] = useState<DialogueTurn>()
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const evaluateTextSimilarity = async (text_1: string, text_2: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/calculate_similarity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text_1: text_1,
                    text_2: text_2
                })
            })
            const data = await res.json();
            return data.score;
        } catch (err) {
            console.error('Failed to fetch', err);
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
        setCurrentTurn(nextTurn);
    }

    const sendUserMessage = async () => {
        if (!input.trim()) return;
        const newMessage: Message = { sender: 'user', text: input };
        var data;

        // Evaluate if response close enough to target sentence
        const similarityScore = await evaluateTextSimilarity(newMessage.text, currentTurn!.targetSentence);

        if (similarityScore < 0.7) {
            console.log("Not similar enough, try again!");
            return;
        }

        setMessages(prev => [...prev, newMessage]);
        setInput('');
        sendBotMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendUserMessage();
        }
    };

    // useEffect(() => { // Update chat to put next turn into view
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        
    //     if (messages.length <= 2) return;

    //     const lastMessage = messages[messages.length - 1];
    //     if (dialogue.length != 0 && lastMessage.sender != "bot") {
    //         const nextTurn = dialogue[0];
    //         const botMessage: Message = {
    //             sender: "bot",
    //             text: nextTurn.mandarin
    //         }
    //         setMessages(prev => [...prev, botMessage]);
    //         setDialogue(dialogue.slice(1));
    //     }
    // }, [messages]);

    useEffect(() => {  // On mount, grab appropriate dialogue
        const dialogue = guidedScenariosDialogue[id];
        const firstTurn = dialogue[0];
        const botMessage: Message = {
            sender: "bot",
            text: firstTurn.mandarin
        };

        setMessages(prev => [...prev, botMessage]);
        setCurrentTurn(firstTurn);
        setDialogue(dialogue.slice(1));
    }, [])

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
        </div>
    );
}
