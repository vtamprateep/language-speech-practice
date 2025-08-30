"use client";

import { useState } from "react";

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