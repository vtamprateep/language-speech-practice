import React, { useState, useRef, useEffect } from 'react';
import { DialogueTurn } from '@/data/scenarios';
import { WaveformAudioPlayer } from './audio/player';
import { RecordButton } from './audio/recorder';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { translateText, transcribeAudio, calculateSimilarity, generateAudio } from '@/lib/backend';

interface VoiceMessage {
    sender: 'user' | 'bot';
    audioUrl: string;
}

export function GuidedDialogueAudio(
    { dialogueSet }: { dialogueSet: DialogueTurn[] }
) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [dialogue, setDialogue] = useState<DialogueTurn[]>(dialogueSet.slice());
    const [countIncorrect, setCountIncorrect] = useState<number>(0);
    const [messages, setMessages] = useState<VoiceMessage[]>([]);
    const [audioData, setAudioData] = useState<Blob>();
    const [translationPopup, setTranslationPopup] = useState<string | null>(null);

    const createMessage = async (user: "bot" | "user", text?: string, audioUrl?: string, firstRender: boolean = false) => {
        if (!text && !audioUrl) throw new Error("Must provide at least one of text or audioUrl args");

        let message: VoiceMessage;

        if (audioUrl) {
            message = { sender: user, audioUrl };
        } else {
            const audioBlob = await generateAudio({
                text: text!,
                language: "MANDARIN"
            });
            message = {
                sender: user,
                audioUrl: URL.createObjectURL(audioBlob)
            };
        }

        setMessages(prev =>
            firstRender ? [message] : [...prev, message]
        );
    };

    const handleIncorrectAttempt = async (text: string) => {
        setCountIncorrect(countIncorrect + 1);
        setTranslationPopup(text);
        setTimeout(() => setTranslationPopup(null), 2000);
    };

    const evaluateUserAudio = async (data: Blob) => {
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
            setDialogue(dialogue.slice(1));
        }
    };

    useEffect(() => {
        createMessage("bot", dialogue[0].mandarin, undefined, true);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (audioData) evaluateUserAudio(audioData);
    }, [audioData]);

    return (
        <div className="flex flex-col h-screen p-4">
            <ScrollArea className="flex-1 mb-4 pr-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in mb-2`}
                    >
                        <Card
                            className={`max-w-[75%] rounded-2xl ${
                                msg.sender === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-black rounded-bl-none'
                            }`}
                        >
                            <CardContent className="p-2">
                                <WaveformAudioPlayer src={msg.audioUrl} />
                            </CardContent>
                        </Card>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>

            {translationPopup && (
                <Alert className="mb-2 animate-fade-in-out">
                    <AlertDescription>🗣️ You said: {translationPopup}</AlertDescription>
                </Alert>
            )}

            {dialogue[0]?.userPrompt && (
                <Alert className="mb-2">
                    <AlertDescription>🎯 Next Prompt: {dialogue[0].userPrompt}</AlertDescription>
                </Alert>
            )}

            {countIncorrect >= 3 && dialogue[0].hint && (
                <Alert className="mb-2">
                    <AlertDescription>💡 Hint: {dialogue[0].hint}</AlertDescription>
                </Alert>
            )}

            <RecordButton onRecordingComplete={setAudioData} />
        </div>
    );
}


interface TextMessage {
    sender: 'user' | 'bot';
    text: string;
}

export function GuidedDialogueText(
    { dialogueSet }: { dialogueSet: DialogueTurn[] }
) {
    const [dialogue, setDialogue] = useState<DialogueTurn[]>(dialogueSet);
    const [countIncorrect, setCountIncorrect] = useState<number>(0);
    const [messages, setMessages] = useState<TextMessage[]>([]);
    const [input, setInput] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [translationPopup, setTranslationPopup] = useState<string | null>(null);

    const createMessage = async (user: "bot" | "user", text: string, firstRender: boolean = false) => {
        const message = { sender: user, text: text };

        setMessages(prev =>
            firstRender ? [message] : [...prev, message]
        );
    };

    const handleIncorrectAttempt = async (text: string) => {
        setCountIncorrect(countIncorrect + 1);
        setTranslationPopup(text);
        setTimeout(() => setTranslationPopup(null), 2000);
    };

    const evaluateUserText = async () => {
        if (!input.trim()) return;
        const translatedText = await translateText({
            text: input,
            sourceLang: "MANDARIN",
            targetLang: "ENGLISH"
        });

        // Evaluate if response close enough to target sentence
        const similarityScore = await calculateSimilarity({
            text_1: input,
            text_2: dialogue[0].targetSentence
        });

        if (similarityScore.score < 0.7) {
            console.log("Not similar enough, try again!");
            handleIncorrectAttempt(translatedText.text);
            return;
        }

        await createMessage("user", input);
        setCountIncorrect(0);
        setInput('');

        if (dialogue.length > 1) {
            await createMessage("bot", dialogue[1].mandarin);
            setDialogue(dialogue.slice(1));
        } else {
            setIsDisabled(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            evaluateUserText();
        }
    };

    useEffect(() => {
        createMessage("bot", dialogue[0].mandarin, true);
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    return (
        <div className="flex flex-col h-screen p-4">
            <ScrollArea className="flex-1 mb-4 pr-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in mb-2`}
                    >
                        <Card
                            className={`max-w-[75%] rounded-2xl ${
                                msg.sender === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-black rounded-bl-none'
                            }`}
                        >
                            <CardContent className="p-2">
                                {msg.text}
                            </CardContent>
                        </Card>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>

            {translationPopup && (
                <div className="mb-2 p-2 bg-black bg-opacity-80 text-white rounded-md text-sm text-center animate-fade-in-out">
                    🗣️ You said: {translationPopup}
                </div>
            )}

            {dialogue[0].userPrompt && (
                <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-sm">
                    🎯 Next Prompt: {dialogue[0].userPrompt}
                </div>
            )}

            {countIncorrect >= 3 && dialogue[0].hint && (
                <div className="mb-2 p-2 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm">
                    💡 Hint: {dialogue[0].hint}
                </div>
            )}

            <div className="flex items-center">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isDisabled}
                    placeholder="Type your message..."
                />
                <Button
                    onClick={evaluateUserText}
                    className="ml-2 px-4 py-2 rounded"
                >
                    Send
                </Button>
            </div>
        </div>
    );
}
