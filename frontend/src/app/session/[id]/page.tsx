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
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, newMessage]);
        setInput('');

        // try {
        //     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/bot/chat`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ text: newMessage.text }),
        //     });

        //     const data = await res.json();
        //     const botReply: Message = { sender: 'bot', text: data.text };
        //     setMessages(prev => [...prev, botReply]);
        // } catch (err) {
        //     console.error('Failed to fetch', err);
        // }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => { // Update chat to put next turn into view
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        
        if (!dialogue || messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        if (dialogue.length != 0 && lastMessage.sender != "bot") {
            const nextTurn = dialogue[0];
            const botMessage: Message = {
                sender: "bot",
                text: nextTurn.mandarin
            }
            setMessages(prev => [...prev, botMessage]);
            setDialogue(dialogue.slice(1));
        }
    }, [messages]);

    useEffect(() => {  // On mount, grab appropriate dialogue
        const dialogue = guidedScenariosDialogue[id];
        const firstTurn = dialogue.shift()!;
        const botMessage: Message = {
            sender: "bot",
            text: firstTurn.mandarin
        };

        setMessages(prev => [...prev, botMessage]);
        setDialogue(dialogue);
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
                    onClick={sendMessage}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
